package com.placementos.backend.controller;

import com.placementos.backend.dto.PracticeProgressUpdateRequest;
import com.placementos.backend.entity.PracticeProblem;
import com.placementos.backend.entity.PracticeProgress;
import com.placementos.backend.entity.PracticeTopic;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.PracticeProblemRepository;
import com.placementos.backend.repository.PracticeProgressRepository;
import com.placementos.backend.repository.PracticeTopicRepository;
import com.placementos.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
public class PracticeController {
    private final PracticeTopicRepository practiceTopicRepository;
    private final PracticeProblemRepository practiceProblemRepository;
    private final PracticeProgressRepository practiceProgressRepository;
    private final UserRepository userRepository;

    public PracticeController(final PracticeTopicRepository practiceTopicRepository, 
                              final PracticeProblemRepository practiceProblemRepository, 
                              final PracticeProgressRepository practiceProgressRepository, 
                              final UserRepository userRepository) {
        this.practiceTopicRepository = practiceTopicRepository;
        this.practiceProblemRepository = practiceProblemRepository;
        this.practiceProgressRepository = practiceProgressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/practice/topics")
    public ResponseEntity<List<Map<String, Object>>> getTopics() {
        List<Map<String, Object>> response = practiceTopicRepository.findAllByOrderByDisplayOrderAscNameAsc().stream().map(topic -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", topic.getId());
            item.put("name", topic.getName());
            item.put("slug", topic.getSlug());
            item.put("description", topic.getDescription());
            item.put("iconName", topic.getIconName());
            item.put("accentColor", topic.getAccentColor());
            item.put("problemCount", practiceProblemRepository.countByTopicId(topic.getId()));
            return item;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/practice/problems")
    public ResponseEntity<List<Map<String, Object>>> getProblems(@RequestParam(required = false) String topic, @RequestParam(required = false) String difficulty, @RequestParam(required = false) String platform, @RequestParam(required = false) String search) {
        List<PracticeProblem> problems = (topic == null || topic.isBlank()) 
            ? practiceProblemRepository.findAllByOrderByDisplayOrderAscTitleAsc() 
            : practiceProblemRepository.findByTopicSlugOrderByDisplayOrderAscTitleAsc(topic);
        
        List<Map<String, Object>> response = problems.stream()
            .filter(problem -> difficulty == null || difficulty.isBlank() || problem.getDifficulty().name().equalsIgnoreCase(difficulty))
            .filter(problem -> platform == null || platform.isBlank() || problem.getPlatform().name().equalsIgnoreCase(platform))
            .filter(problem -> search == null || search.isBlank() || problem.getTitle().toLowerCase().contains(search.toLowerCase()))
            .map(this::toProblemResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/practice-progress")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getProgress(Authentication authentication) {
        User user = requireUser(authentication);
        List<PracticeProgress> completed = practiceProgressRepository.findByUserIdAndCompletedTrue(user.getId());
        Set<Long> completedProblemIds = completed.stream().map(progress -> progress.getProblem().getId()).collect(Collectors.toCollection(LinkedHashSet::new));
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("completedProblemIds", completedProblemIds);
        response.put("completedCount", completedProblemIds.size());
        response.put("remainingCount", Math.max(0, practiceProblemRepository.count() - completedProblemIds.size()));
        response.put("totalProblems", practiceProblemRepository.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/practice-insights")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getPracticeInsights(Authentication authentication) {
        User user = requireUser(authentication);
        List<PracticeTopic> topics = practiceTopicRepository.findAllByOrderByDisplayOrderAscNameAsc();
        List<PracticeProblem> allProblems = practiceProblemRepository.findAllByOrderByDisplayOrderAscTitleAsc();
        Set<Long> completedProblemIds = practiceProgressRepository.findByUserIdAndCompletedTrue(user.getId())
                .stream().map(progress -> progress.getProblem().getId()).collect(Collectors.toSet());
        
        List<Map<String, Object>> topicInsights = topics.stream()
                .map(topic -> buildTopicInsight(topic, allProblems, completedProblemIds))
                .sorted(Comparator.comparingDouble((Map<String, Object> insight) -> ((Number) insight.get("completionRate")).doubleValue())
                .thenComparing((Map<String, Object> insight) -> ((Number) insight.get("remaining")).intValue(), Comparator.reverseOrder())).toList();
        
        Map<String, Object> weakestTopic = topicInsights.isEmpty() ? null : topicInsights.get(0);
        List<Map<String, Object>> recommendations = weakestTopic == null ? List.of() : allProblems.stream()
                .filter(problem -> problem.getTopic().getSlug().equals(weakestTopic.get("slug")))
                .filter(problem -> !completedProblemIds.contains(problem.getId()))
                .sorted(Comparator.comparingInt((PracticeProblem problem) -> difficultyWeight(problem.getDifficulty()))
                .thenComparing(problem -> Optional.ofNullable(problem.getDisplayOrder()).orElse(Integer.MAX_VALUE))
                .thenComparing(PracticeProblem::getTitle)).limit(5).map(this::toProblemResponse).toList();
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("generatedAt", LocalDateTime.now());
        response.put("topicInsights", topicInsights);
        response.put("weakestTopic", weakestTopic);
        response.put("recommendedProblems", recommendations);
        response.put("headline", buildHeadline(weakestTopic, recommendations.size()));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/practice-progress/{problemId}")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateProgress(@PathVariable Long problemId, @Valid @RequestBody PracticeProgressUpdateRequest request, Authentication authentication) {
        User user = requireUser(authentication);
        PracticeProblem problem = practiceProblemRepository.findById(problemId).orElseThrow();
        PracticeProgress progress = practiceProgressRepository.findByUserIdAndProblemId(user.getId(), problemId)
                .orElseGet(() -> PracticeProgress.builder().user(user).problem(problem).completed(false).build());
        
        boolean wasCompleted = progress.isCompleted();
        progress.setCompleted(request.getCompleted());
        progress.setCompletedAt(Boolean.TRUE.equals(request.getCompleted()) ? LocalDateTime.now() : null);
        
        // Initialize Spaced Repetition on first completion
        if (Boolean.TRUE.equals(request.getCompleted()) && !wasCompleted) {
            progress.setRevisionStep(0);
            progress.setNextRevisionDate(LocalDateTime.now().plusDays(1));
        } else if (Boolean.FALSE.equals(request.getCompleted())) {
            progress.setNextRevisionDate(null);
            progress.setRevisionStep(null);
            progress.setLastRevisedAt(null);
        }
        
        practiceProgressRepository.save(progress);
        
        long completedCount = practiceProgressRepository.countByUserIdAndCompletedTrue(user.getId());
        user.setProblemsSolved((int) completedCount);
        userRepository.save(user);
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("problemId", problemId);
        response.put("completed", progress.isCompleted());
        response.put("completedCount", completedCount);
        response.put("remainingCount", Math.max(0, practiceProblemRepository.count() - completedCount));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/practice/revisions")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getRevisions(Authentication authentication) {
        User user = requireUser(authentication);
        List<PracticeProgress> revisions = practiceProgressRepository.findByUserIdAndCompletedTrue(user.getId());
        
        List<Map<String, Object>> response = revisions.stream()
                .filter(p -> p.getNextRevisionDate() != null)
                .sorted(Comparator.comparing(PracticeProgress::getNextRevisionDate))
                .map(p -> {
                    try {
                        Map<String, Object> map = toProblemResponse(p.getProblem());
                        map.put("nextRevisionDate", p.getNextRevisionDate());
                        map.put("revisionStep", p.getRevisionStep());
                        map.put("lastRevisedAt", p.getLastRevisedAt());
                        map.put("isDue", p.getNextRevisionDate().isBefore(LocalDateTime.now()));
                        return map;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/practice/revisions/{problemId}/complete")
    @Transactional
    public ResponseEntity<Map<String, Object>> completeRevision(@PathVariable Long problemId, Authentication authentication) {
        User user = requireUser(authentication);
        PracticeProgress progress = practiceProgressRepository.findByUserIdAndProblemId(user.getId(), problemId)
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Progress not found"));
        
        if (!progress.isCompleted()) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Problem must be completed before revision");
        }
        
        int currentStep = Optional.ofNullable(progress.getRevisionStep()).orElse(0);
        int nextStep = currentStep + 1;
        
        // Spaced Repetition Logic (Days): 1, 3, 7, 14, 30, 60...
        long baseDays = switch (currentStep) {
            case 0 -> 3;
            case 1 -> 7;
            case 2 -> 14;
            case 3 -> 30;
            default -> 60;
        };
        
        // Difficulty Multiplier
        double multiplier = switch (progress.getProblem().getDifficulty()) {
            case Easy -> 1.5;
            case Medium -> 1.0;
            case Hard -> 0.7;
        };
        
        long finalDays = Math.max(1, Math.round(baseDays * multiplier));
        
        progress.setRevisionStep(nextStep);
        progress.setLastRevisedAt(LocalDateTime.now());
        progress.setNextRevisionDate(LocalDateTime.now().plusDays(finalDays));
        practiceProgressRepository.save(progress);
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("problemId", problemId);
        response.put("nextRevisionDate", progress.getNextRevisionDate());
        response.put("revisionStep", nextStep);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toProblemResponse(PracticeProblem problem) {
        PracticeTopic topic = problem.getTopic();
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", problem.getId());
        item.put("title", problem.getTitle());
        item.put("difficulty", problem.getDifficulty().name());
        item.put("platform", problem.getPlatform().name());
        item.put("problemUrl", problem.getProblemUrl());
        item.put("summary", problem.getSummary());
        Map<String, Object> topicMap = new LinkedHashMap<>();
        topicMap.put("id", topic.getId());
        topicMap.put("name", topic.getName());
        topicMap.put("slug", topic.getSlug());
        topicMap.put("accentColor", topic.getAccentColor());
        topicMap.put("iconName", topic.getIconName());
        item.put("topic", topicMap);
        return item;
    }

    private Map<String, Object> buildTopicInsight(PracticeTopic topic, List<PracticeProblem> allProblems, Set<Long> completedProblemIds) {
        List<PracticeProblem> topicProblems = allProblems.stream().filter(problem -> problem.getTopic().getId().equals(topic.getId())).toList();
        int total = topicProblems.size();
        int completed = (int) topicProblems.stream().filter(problem -> completedProblemIds.contains(problem.getId())).count();
        int remaining = Math.max(0, total - completed);
        double completionRate = total == 0 ? 0 : (completed * 100.0) / total;
        String status;
        if (completionRate >= 70) {
            status = "Strong";
        } else if (completionRate >= 35) {
            status = "Improving";
        } else {
            status = "Needs Work";
        }
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", topic.getId());
        item.put("name", topic.getName());
        item.put("slug", topic.getSlug());
        item.put("accentColor", topic.getAccentColor());
        item.put("completed", completed);
        item.put("total", total);
        item.put("remaining", remaining);
        item.put("completionRate", Math.round(completionRate * 10.0) / 10.0);
        item.put("status", status);
        return item;
    }

    private int difficultyWeight(PracticeProblem.Difficulty difficulty) {
        return switch (difficulty) {
            case Easy -> 1;
            case Medium -> 2;
            case Hard -> 3;
        };
    }

    private String buildHeadline(Map<String, Object> weakestTopic, int recommendationCount) {
        if (weakestTopic == null) {
            return "Start solving problems to unlock topic insights.";
        }
        String name = Objects.toString(weakestTopic.get("name"), "this topic");
        int remaining = ((Number) weakestTopic.get("remaining")).intValue();
        if (remaining == 0) {
            return "You are in a strong position across tracked topics. Time to raise the bar with harder sets.";
        }
        return "You are weakest in " + name + " right now. Practice these " + recommendationCount + " problems next.";
    }

    private User requireUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required.");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "User not found for the provided token."));
    }
}
