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

    @Query("SELECT cast(s.submittedAt as date) as date, COUNT(s) as count " +
           "FROM Submission s " +
           "WHERE s.user.id = :userId AND s.status = :status " +
           "AND s.submittedAt >= :startDate " +
           "GROUP BY cast(s.submittedAt as date) " +
           "ORDER BY cast(s.submittedAt as date) ASC")
    List<Object[]> getDailyAcceptedSubmissionCounts(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("status") Submission.Status status);
}
