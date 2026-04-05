package com.placementos.backend.repository;

import com.placementos.backend.entity.ProjectIdea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectIdeaRepository extends JpaRepository<ProjectIdea, Long> {
    List<ProjectIdea> findByDomain(ProjectIdea.ProjectDomain domain);
    List<ProjectIdea> findByDifficulty(ProjectIdea.ProjectDifficulty difficulty);
}
