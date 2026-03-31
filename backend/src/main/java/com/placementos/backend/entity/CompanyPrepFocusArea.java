package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_prep_focus_areas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPrepFocusArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private CompanyPrepProfile profile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private PracticeTopic topic;

    private Integer displayOrder;
}
