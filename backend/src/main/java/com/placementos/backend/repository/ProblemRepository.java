package com.placementos.backend.repository;
import com.placementos.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByDifficulty(Problem.Difficulty difficulty);
    List<Problem> findByTopicsContaining(String topic);
}
