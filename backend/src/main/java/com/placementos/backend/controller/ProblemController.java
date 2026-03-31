package com.placementos.backend.controller;

import com.placementos.backend.entity.Problem;
import com.placementos.backend.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemRepository problemRepository;

    @GetMapping
    public ResponseEntity<List<Problem>> getAll(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String topic) {
        if (difficulty != null) {
            return ResponseEntity.ok(problemRepository.findByDifficulty(Problem.Difficulty.valueOf(difficulty)));
        }
        if (topic != null) {
            return ResponseEntity.ok(problemRepository.findByTopicsContaining(topic));
        }
        return ResponseEntity.ok(problemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getById(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Problem> create(@RequestBody Problem problem) {
        return ResponseEntity.ok(problemRepository.save(problem));
    }
}
