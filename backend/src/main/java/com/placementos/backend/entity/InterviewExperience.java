package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_experiences")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewExperience {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String userName; // For anonymous or quick-seeded experiences
    private String company;
    private String role;
    private String difficulty; 
    private String date; // To match seeder

    @Enumerated(EnumType.STRING)
    private Outcome outcome;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int rounds;
    private int upvotes;
    private int views;
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Outcome { Selected, Rejected, Pending }
}
