package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapTrackResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapTrackResourceRepository extends JpaRepository<RoadmapTrackResource, Long> {
    List<RoadmapTrackResource> findAllByOrderByTrackRoadmapDisplayOrderAscTrackDisplayOrderAscDisplayOrderAsc();
}
