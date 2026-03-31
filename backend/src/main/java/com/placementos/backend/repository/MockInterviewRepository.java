package com.placementos.backend.repository;

import com.placementos.backend.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByIntervieweeId(Long userId);
    List<MockInterview> findByInterviewerId(Long userId);
}
