package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapDefinitionRepository extends JpaRepository<RoadmapDefinition, String> {
    List<RoadmapDefinition> findAllByOrderByDisplayOrderAscTitleAsc();
}
