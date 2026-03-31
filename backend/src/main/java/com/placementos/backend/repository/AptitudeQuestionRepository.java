package com.placementos.backend.repository;
import com.placementos.backend.entity.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AptitudeQuestionRepository extends JpaRepository<AptitudeQuestion, Long> {
    List<AptitudeQuestion> findByCategory(String category);
}
