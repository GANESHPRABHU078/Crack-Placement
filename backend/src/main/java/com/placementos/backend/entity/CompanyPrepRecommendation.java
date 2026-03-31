package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_prep_recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPrepRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private CompanyPrepProfile profile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practice_problem_id", nullable = false)
    private PracticeProblem practiceProblem;

    private Integer displayOrder;
}
