package com.placementos.backend.repository;

import com.placementos.backend.entity.PracticeProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeProgressRepository extends JpaRepository<PracticeProgress, Long> {
    Optional<PracticeProgress> findByUserIdAndProblemId(Long userId, Long problemId);
    List<PracticeProgress> findByUserIdAndCompletedTrue(Long userId);
    long countByUserIdAndCompletedTrue(Long userId);
}
