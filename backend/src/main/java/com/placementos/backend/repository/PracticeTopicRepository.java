package com.placementos.backend.repository;

import com.placementos.backend.entity.PracticeTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeTopicRepository extends JpaRepository<PracticeTopic, Long> {
    List<PracticeTopic> findAllByOrderByDisplayOrderAscNameAsc();
    Optional<PracticeTopic> findBySlug(String slug);
}
