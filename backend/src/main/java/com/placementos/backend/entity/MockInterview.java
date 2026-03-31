package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mock_interviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MockInterview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id")
    private User interviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewee_id")
    private User interviewee;

    private String topic; // Added for seeding
    private LocalDateTime scheduledTime; // Added for seeding
    
    private String scheduledAt;
    private String duration; 
    private String focusArea; 

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private int rating; // 1-5

    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum InterviewStatus { Scheduled, Completed, Cancelled }
}
