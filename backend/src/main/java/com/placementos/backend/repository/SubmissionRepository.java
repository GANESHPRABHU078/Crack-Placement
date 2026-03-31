package com.placementos.backend.repository;
import com.placementos.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByUserIdAndProblemId(Long userId, Long problemId);
    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, Submission.Status status);
}
