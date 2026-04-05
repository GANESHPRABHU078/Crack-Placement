package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private ProjectIdea projectIdea;
    
    private int stepNumber;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
