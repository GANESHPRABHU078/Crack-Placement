package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapTrackRepository extends JpaRepository<RoadmapTrack, Long> {
    List<RoadmapTrack> findAllByOrderByRoadmapDisplayOrderAscDisplayOrderAsc();
}
