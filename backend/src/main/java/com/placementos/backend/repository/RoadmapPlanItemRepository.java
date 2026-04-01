package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapPlanItemRepository extends JpaRepository<RoadmapPlanItem, Long> {
    List<RoadmapPlanItem> findAllByOrderByRoadmapDisplayOrderAscPlanTypeAscDisplayOrderAsc();
}
