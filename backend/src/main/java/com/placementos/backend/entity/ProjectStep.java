package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "project_steps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProjectIdea projectIdea;
    
    private int stepNumber;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
