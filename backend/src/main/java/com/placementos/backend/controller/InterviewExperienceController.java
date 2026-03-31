package com.placementos.backend.controller;

import com.placementos.backend.entity.InterviewExperience;
import com.placementos.backend.repository.InterviewExperienceRepository;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews/experiences")
@RequiredArgsConstructor
public class InterviewExperienceController {

    private final InterviewExperienceRepository repo;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<InterviewExperience>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<InterviewExperience> create(@RequestBody InterviewExperience exp, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        exp.setUser(user);
        return ResponseEntity.ok(repo.save(exp));
    }
}
