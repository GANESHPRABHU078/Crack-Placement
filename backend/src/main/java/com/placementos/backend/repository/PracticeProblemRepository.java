package com.placementos.backend.repository;

import com.placementos.backend.entity.PracticeProblem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeProblemRepository extends JpaRepository<PracticeProblem, Long> {
    List<PracticeProblem> findAllByOrderByDisplayOrderAscTitleAsc();
    List<PracticeProblem> findByTopicSlugOrderByDisplayOrderAscTitleAsc(String slug);
    long countByTopicId(Long topicId);
}
