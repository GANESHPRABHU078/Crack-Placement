package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String college;
    private String branch;
    private String gradYear;
    private String primaryGoal;

    // Stats
    @Builder.Default
    private int problemsSolved = 0;
    @Builder.Default
    private int currentStreak = 0;
    @Builder.Default
    private int bestStreak = 0;
    @Builder.Default
    private int xp = 0;
    @Builder.Default
    private int level = 1;
    @Builder.Default
    private String league = "Bronze";

    private int globalRank;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
