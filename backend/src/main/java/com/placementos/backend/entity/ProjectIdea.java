package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "project_ideas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectIdea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ProjectDomain domain;
    
    @Enumerated(EnumType.STRING)
    private ProjectDifficulty difficulty;
    
    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "project_tech_stack", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> techStack = new ArrayList<>();
    
    private String estimatedTime;
    
    @Column(columnDefinition = "TEXT")
    private String realWorldUseCase;
    
    private int resumeImpactScore; // 1-10
    
    private String githubLink;
    private String demoLink;
    
    @Builder.Default
    @OneToMany(mappedBy = "projectIdea", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ProjectStep> steps = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ProjectDomain {
        WEB_DEV, DATA_SCIENCE, AI_ML, SYSTEM_DESIGN, MOBILE_APP, BLOCKCHAIN, CYBERSECURITY;
    }

    public enum ProjectDifficulty {
        BEGINNER, INTERMEDIATE, ADVANCED;
    }
}
