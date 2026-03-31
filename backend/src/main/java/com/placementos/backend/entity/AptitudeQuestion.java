package com.placementos.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "aptitude_questions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AptitudeQuestion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @ElementCollection
    @CollectionTable(name = "aptitude_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;

    private int correctAnswer; // index of the correct option

    @Column(columnDefinition = "TEXT")
    private String explanation;

    private int difficultyLevel; // 1=Easy, 2=Medium, 3=Hard
}
