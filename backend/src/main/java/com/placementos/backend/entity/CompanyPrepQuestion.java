package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_prep_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPrepQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private CompanyPrepProfile profile;

    @Column(nullable = false, length = 1024)
    private String questionText;

    private Integer displayOrder;
}
