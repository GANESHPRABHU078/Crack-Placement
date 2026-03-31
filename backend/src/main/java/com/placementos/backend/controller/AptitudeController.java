package com.placementos.backend.controller;

import com.placementos.backend.entity.AptitudeQuestion;
import com.placementos.backend.repository.AptitudeQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/aptitude")
@RequiredArgsConstructor
public class AptitudeController {

    private final AptitudeQuestionRepository repo;

    @GetMapping
    public ResponseEntity<List<AptitudeQuestion>> getAll(@RequestParam(required = false) String category) {
        List<AptitudeQuestion> questions = category != null ? repo.findByCategory(category) : repo.findAll();
        Collections.shuffle(questions);
        return ResponseEntity.ok(questions.stream().limit(10).toList());
    }

    @PostMapping
    public ResponseEntity<AptitudeQuestion> create(@RequestBody AptitudeQuestion q) {
        return ResponseEntity.ok(repo.save(q));
    }
}
