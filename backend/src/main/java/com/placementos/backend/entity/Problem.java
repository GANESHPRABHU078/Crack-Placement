package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String acceptanceRate;
    private int frequency;

    @ElementCollection
    @CollectionTable(name = "problem_topics", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "topic")
    private List<String> topics;

    @ElementCollection
    @CollectionTable(name = "problem_companies", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "company")
    private List<String> companies;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String hints;

    @Column(columnDefinition = "TEXT")
    private String editorial;

    @Column(columnDefinition = "TEXT")
    private String starterCodeJava;
    @Column(columnDefinition = "TEXT")
    private String starterCodePython;
    @Column(columnDefinition = "TEXT")
    private String starterCodeCpp;
    @Column(columnDefinition = "TEXT")
    private String starterCodeJs;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Difficulty { Easy, Medium, Hard }
}
