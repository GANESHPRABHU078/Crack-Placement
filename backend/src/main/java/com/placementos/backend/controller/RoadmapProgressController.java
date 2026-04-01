package com.placementos.backend.controller;

import com.placementos.backend.dto.RoadmapProgressUpdateRequest;
import com.placementos.backend.entity.RoadmapProgress;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.RoadmapProgressRepository;
import com.placementos.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class RoadmapProgressController {
    private final RoadmapProgressRepository roadmapProgressRepository;
    private final UserRepository userRepository;

    public RoadmapProgressController(RoadmapProgressRepository roadmapProgressRepository, UserRepository userRepository) {
        this.roadmapProgressRepository = roadmapProgressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/roadmap-progress")
    public ResponseEntity<Map<String, Object>> getRoadmapProgress(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        List<RoadmapProgress> entries = roadmapProgressRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());

        List<Map<String, Object>> progressEntries = entries.stream()
                .map(this::toProgressResponse)
                .toList();

        List<Map<String, Object>> roadmapSummaries = entries.stream()
                .collect(Collectors.groupingBy(RoadmapProgress::getRoadmapId, LinkedHashMap::new, Collectors.toList()))
                .values()
                .stream()
                .map(group -> buildRoadmapSummary(group))
                .sorted(Comparator.comparing(item -> item.get("roadmapTitle").toString()))
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("progressEntries", progressEntries);
        response.put("roadmapSummaries", roadmapSummaries);
        response.put("updatedAt", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/roadmap-progress")
    public ResponseEntity<Map<String, Object>> updateRoadmapProgress(
            @Valid @RequestBody RoadmapProgressUpdateRequest request,
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        RoadmapProgress progress = roadmapProgressRepository
                .findByUserIdAndRoadmapIdAndTopicId(user.getId(), request.getRoadmapId(), request.getTopicId())
                .orElseGet(RoadmapProgress::new);

        boolean isNew = progress.getId() == null;
        if (isNew) {
            progress.setUser(user);
            progress.setStartedAt(LocalDateTime.now());
        }

        progress.setRoadmapId(request.getRoadmapId());
        progress.setRoadmapTitle(request.getRoadmapTitle());
        progress.setLevelLabel(request.getLevelLabel());
        progress.setTopicId(request.getTopicId());
        progress.setTopicTitle(request.getTopicTitle());
        progress.setStatus(request.getStatus());

        if ("completed".equals(request.getStatus())) {
            if (progress.getStartedAt() == null) {
                progress.setStartedAt(LocalDateTime.now());
            }
            progress.setCompletedAt(LocalDateTime.now());
        } else {
            progress.setCompletedAt(null);
            if ("in_progress".equals(request.getStatus()) && progress.getStartedAt() == null) {
                progress.setStartedAt(LocalDateTime.now());
            }
        }

        roadmapProgressRepository.save(progress);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("entry", toProgressResponse(progress));
        response.put("message", "Roadmap progress updated successfully.");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toProgressResponse(RoadmapProgress progress) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", progress.getId());
        item.put("roadmapId", progress.getRoadmapId());
        item.put("roadmapTitle", progress.getRoadmapTitle());
        item.put("levelLabel", progress.getLevelLabel());
        item.put("topicId", progress.getTopicId());
        item.put("topicTitle", progress.getTopicTitle());
        item.put("status", progress.getStatus());
        item.put("startedAt", progress.getStartedAt());
        item.put("completedAt", progress.getCompletedAt());
        item.put("updatedAt", progress.getUpdatedAt());
        return item;
    }

    private Map<String, Object> buildRoadmapSummary(List<RoadmapProgress> group) {
        RoadmapProgress first = group.get(0);
        long completed = group.stream().filter(item -> "completed".equals(item.getStatus())).count();
        long inProgress = group.stream().filter(item -> "in_progress".equals(item.getStatus())).count();

        Map<String, Object> item = new LinkedHashMap<>();
        item.put("roadmapId", first.getRoadmapId());
        item.put("roadmapTitle", first.getRoadmapTitle());
        item.put("trackedTopics", group.size());
        item.put("completedTopics", completed);
        item.put("inProgressTopics", inProgress);
        item.put("lastUpdatedAt", group.stream().map(RoadmapProgress::getUpdatedAt).max(LocalDateTime::compareTo).orElse(null));
        return item;
    }
}
