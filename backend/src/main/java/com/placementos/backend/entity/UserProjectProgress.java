package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_project_progress", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "project_id"})})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProjectProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectIdea projectIdea;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProjectStatus {
        BOOKMARKED, IN_PROGRESS, COMPLETED;
    }
}
