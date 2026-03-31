package com.placementos.backend.controller;

import com.placementos.backend.entity.Job;
import com.placementos.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAll(@RequestParam(required = false) String type) {
        if (type != null) {
            return ResponseEntity.ok(jobRepository.findByType(Job.JobType.valueOf(type)));
        }
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/new")
    public ResponseEntity<List<Job>> getNew() {
        return ResponseEntity.ok(jobRepository.findByIsNewTrue());
    }

    @PostMapping
    public ResponseEntity<Job> create(@RequestBody Job job) {
        return ResponseEntity.ok(jobRepository.save(job));
    }
}
