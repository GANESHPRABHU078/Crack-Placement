package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapTopicResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapTopicResourceRepository extends JpaRepository<RoadmapTopicResource, Long> {
    List<RoadmapTopicResource> findAllByOrderByTopicRoadmapDisplayOrderAscTopicStageDisplayOrderAscTopicDisplayOrderAscDisplayOrderAsc();
}
