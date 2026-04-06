package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "developer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeveloperProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // GitHub Stats
    private int githubRepos;
    private int githubStars;
    private int githubFollowers;
    @Column(columnDefinition = "TEXT")
    private String githubLanguages; // JSON string

    // LeetCode Stats
    private int leetcodeTotalSolved;
    private int leetcodeEasySolved;
    private int leetcodeMediumSolved;
    private int leetcodeHardSolved;
    private int leetcodeRanking;
    private double leetcodeContestRating;

    // Overall Progress
    private int developerScore; // 0-1000
    private String developerLevel; // Beginner, Intermediate, Advanced
    private LocalDateTime lastSyncedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (lastSyncedAt == null) lastSyncedAt = LocalDateTime.now();
    }
}
