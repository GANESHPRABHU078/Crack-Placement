package com.placementos.backend.repository;

import com.placementos.backend.entity.ProjectStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.placementos.backend.entity.ProjectIdea;

public interface ProjectStepRepository extends JpaRepository<ProjectStep, Long> {
    List<ProjectStep> findByProjectIdeaOrderByStepNumberAsc(ProjectIdea projectIdea);
}
