package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapTopicRepository extends JpaRepository<RoadmapTopic, Long> {
    List<RoadmapTopic> findAllByOrderByRoadmapDisplayOrderAscStageDisplayOrderAscDisplayOrderAsc();
}
