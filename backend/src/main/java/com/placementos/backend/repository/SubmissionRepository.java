package com.placementos.backend.repository;

import com.placementos.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByUserIdAndProblemId(Long userId, Long problemId);
    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, Submission.Status status);

    @Query(value = "SELECT DATE(s.submitted_at) as date, COUNT(*) as count " +
           "FROM submissions s " +
           "WHERE s.user_id = :userId AND s.status = :status " +
           "AND s.submitted_at >= :startDate " +
           "GROUP BY DATE(s.submitted_at) " +
           "ORDER BY DATE(s.submitted_at) ASC", nativeQuery = true)
    List<Object[]> getDailyAcceptedSubmissionCounts(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("status") String status);
}
