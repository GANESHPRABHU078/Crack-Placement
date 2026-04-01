package com.placementos.backend.repository;

import com.placementos.backend.entity.RoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoadmapProgressRepository extends JpaRepository<RoadmapProgress, Long> {
    List<RoadmapProgress> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<RoadmapProgress> findByUserIdAndRoadmapIdAndTopicId(Long userId, String roadmapId, String topicId);
}
