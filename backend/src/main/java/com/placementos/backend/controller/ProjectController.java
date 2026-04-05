package com.placementos.backend.controller;

import com.placementos.backend.entity.User;
import com.placementos.backend.entity.ProjectIdea;
import com.placementos.backend.entity.UserProjectProgress;
import com.placementos.backend.repository.ProjectIdeaRepository;
import com.placementos.backend.repository.UserRepository;
import com.placementos.backend.repository.UserProjectProgressRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectIdeaRepository projectIdeaRepository;
    private final UserRepository userRepository;
    private final UserProjectProgressRepository userProjectProgressRepository;

    public ProjectController(
            ProjectIdeaRepository projectIdeaRepository,
            UserRepository userRepository,
            UserProjectProgressRepository userProjectProgressRepository
    ) {
        this.projectIdeaRepository = projectIdeaRepository;
        this.userRepository = userRepository;
        this.userProjectProgressRepository = userProjectProgressRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProjectIdea>> getAll() {
        return ResponseEntity.ok(projectIdeaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectIdea> getById(@PathVariable Long id) {
        return projectIdeaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status")
    public ResponseEntity<List<UserProjectProgress>> getUserProgress(Authentication authentication) {
        User user = requireUser(authentication);
        return ResponseEntity.ok(userProjectProgressRepository.findByUser(user));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<UserProjectProgress> updateStatus(
            @PathVariable Long id,
            @RequestParam UserProjectProgress.ProjectStatus status,
            Authentication authentication
    ) {
        User user = requireUser(authentication);
        ProjectIdea project = projectIdeaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        UserProjectProgress progress = userProjectProgressRepository.findByUserAndProjectIdea(user, project)
                .orElse(UserProjectProgress.builder().user(user).projectIdea(project).build());

        progress.setStatus(status);
        return ResponseEntity.ok(userProjectProgressRepository.save(progress));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<Map<String, Object>>> getRecommended(Authentication authentication) {
        User user = requireUser(authentication);
        Set<String> userSkills = user.getSkills().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<ProjectIdea> allProjects = projectIdeaRepository.findAll();
        List<Map<String, Object>> recommendations = new ArrayList<>();

        for (ProjectIdea project : allProjects) {
            List<String> projectTech = project.getTechStack();
            if (projectTech == null || projectTech.isEmpty()) continue;

            long matchCount = projectTech.stream()
                    .filter(t -> userSkills.contains(t.toLowerCase()))
                    .count();

            int matchPercent = (int) (((double) matchCount / projectTech.size()) * 100);
            
            // Boost if the domain matches user's primary goal (e.g. "Web" in goal matches WEB_DEV)
            if (user.getPrimaryGoal() != null && project.getDomain().name().contains(user.getPrimaryGoal().toUpperCase())) {
                matchPercent = Math.min(100, matchPercent + 20);
            }

            Map<String, Object> rec = new HashMap<>();
            rec.put("project", project);
            rec.put("matchPercent", matchPercent);
            recommendations.add(rec);
        }

        recommendations.sort((a, b) -> (Integer) b.get("matchPercent") - (Integer) a.get("matchPercent"));
        return ResponseEntity.ok(recommendations);
    }

    private User requireUser(Authentication authentication) {
        if (authentication == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
