package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapStageRepository extends JpaRepository<RoadmapStage, Long> {
    List<RoadmapStage> findAllByOrderByRoadmapDisplayOrderAscDisplayOrderAsc();
}
