package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String logoEmoji;
    private String location;
    private String salary;

    @Enumerated(EnumType.STRING)
    private JobType type;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills;

    private boolean isNew;
    private String applyLink;
    private LocalDateTime postedAt;

    @PrePersist protected void onCreate() { postedAt = LocalDateTime.now(); }

    public enum JobType { FullTime, Internship, Remote }
}
