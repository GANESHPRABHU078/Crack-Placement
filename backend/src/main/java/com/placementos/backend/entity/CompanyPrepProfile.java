package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "company_prep_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPrepProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String company;

    @Column(nullable = false)
    private String aptitudeLevel;

    @Column(nullable = false, length = 8)
    private String logoText;

    @Column(nullable = false, length = 32)
    private String brandColor;

    @Column(nullable = false, length = 1024)
    private String roundPattern;

    @Column(nullable = false, length = 1024)
    private String prepPlan;

    private Integer interviewRounds;

    private Integer onlineAssessmentQuestions;

    private Integer codingQuestions;

    private Integer interviewDurationMinutes;

    private Integer displayOrder;

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, id ASC")
    private List<CompanyPrepFocusArea> focusAreas = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, id ASC")
    private List<CompanyPrepQuestion> askedQuestions = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, id ASC")
    private List<CompanyPrepRecommendation> recommendedProblems = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
