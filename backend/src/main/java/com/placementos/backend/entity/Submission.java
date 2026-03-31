package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Submission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String language;
    private String runtime;
    private String memory;

    @Column(columnDefinition = "TEXT")
    private String code;

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() { submittedAt = LocalDateTime.now(); }

    public enum Status { Accepted, WrongAnswer, TimeLimitExceeded, RuntimeError, CompileError }
}
