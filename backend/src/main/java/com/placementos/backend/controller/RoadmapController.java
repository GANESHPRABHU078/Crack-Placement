package com.placementos.backend.controller;

import com.placementos.backend.entity.*;
import com.placementos.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class RoadmapController {
    private final RoadmapDefinitionRepository roadmapDefinitionRepository;
    private final RoadmapStageRepository roadmapStageRepository;
    private final RoadmapTopicRepository roadmapTopicRepository;
    private final RoadmapTopicResourceRepository roadmapTopicResourceRepository;
    private final RoadmapTrackRepository roadmapTrackRepository;
    private final RoadmapTrackResourceRepository roadmapTrackResourceRepository;
    private final RoadmapPlanItemRepository roadmapPlanItemRepository;

    public RoadmapController(
            RoadmapDefinitionRepository roadmapDefinitionRepository,
            RoadmapStageRepository roadmapStageRepository,
            RoadmapTopicRepository roadmapTopicRepository,
            RoadmapTopicResourceRepository roadmapTopicResourceRepository,
            RoadmapTrackRepository roadmapTrackRepository,
            RoadmapTrackResourceRepository roadmapTrackResourceRepository,
            RoadmapPlanItemRepository roadmapPlanItemRepository
    ) {
        this.roadmapDefinitionRepository = roadmapDefinitionRepository;
        this.roadmapStageRepository = roadmapStageRepository;
        this.roadmapTopicRepository = roadmapTopicRepository;
        this.roadmapTopicResourceRepository = roadmapTopicResourceRepository;
        this.roadmapTrackRepository = roadmapTrackRepository;
        this.roadmapTrackResourceRepository = roadmapTrackResourceRepository;
        this.roadmapPlanItemRepository = roadmapPlanItemRepository;
    }

    @GetMapping("/api/roadmaps")
    public ResponseEntity<List<Map<String, Object>>> getRoadmaps() {
        List<RoadmapDefinition> roadmaps = roadmapDefinitionRepository.findAllByOrderByDisplayOrderAscTitleAsc();
        List<RoadmapStage> stages = roadmapStageRepository.findAllByOrderByRoadmapDisplayOrderAscDisplayOrderAsc();
        List<RoadmapTopic> topics = roadmapTopicRepository.findAllByOrderByRoadmapDisplayOrderAscStageDisplayOrderAscDisplayOrderAsc();
        List<RoadmapTopicResource> topicResources = roadmapTopicResourceRepository.findAllByOrderByTopicRoadmapDisplayOrderAscTopicStageDisplayOrderAscTopicDisplayOrderAscDisplayOrderAsc();
        List<RoadmapTrack> tracks = roadmapTrackRepository.findAllByOrderByRoadmapDisplayOrderAscDisplayOrderAsc();
        List<RoadmapTrackResource> trackResources = roadmapTrackResourceRepository.findAllByOrderByTrackRoadmapDisplayOrderAscTrackDisplayOrderAscDisplayOrderAsc();
        List<RoadmapPlanItem> planItems = roadmapPlanItemRepository.findAllByOrderByRoadmapDisplayOrderAscPlanTypeAscDisplayOrderAsc();

        Map<Long, List<RoadmapTopicResource>> topicResourcesByTopic = topicResources.stream()
                .collect(Collectors.groupingBy(resource -> resource.getTopic().getId(), LinkedHashMap::new, Collectors.toList()));
        Map<Long, List<RoadmapTrackResource>> trackResourcesByTrack = trackResources.stream()
                .collect(Collectors.groupingBy(resource -> resource.getTrack().getId(), LinkedHashMap::new, Collectors.toList()));
        Map<Long, List<RoadmapTopic>> topicsByStage = topics.stream()
                .collect(Collectors.groupingBy(topic -> topic.getStage().getId(), LinkedHashMap::new, Collectors.toList()));
        Map<String, List<RoadmapStage>> stagesByRoadmap = stages.stream()
                .collect(Collectors.groupingBy(stage -> stage.getRoadmap().getId(), LinkedHashMap::new, Collectors.toList()));
        Map<String, List<RoadmapTrack>> tracksByRoadmap = tracks.stream()
                .collect(Collectors.groupingBy(track -> track.getRoadmap().getId(), LinkedHashMap::new, Collectors.toList()));
        Map<String, List<RoadmapPlanItem>> plansByRoadmap = planItems.stream()
                .collect(Collectors.groupingBy(item -> item.getRoadmap().getId(), LinkedHashMap::new, Collectors.toList()));

        List<Map<String, Object>> response = roadmaps.stream()
                .map(roadmap -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", roadmap.getId());
                    item.put("title", roadmap.getTitle());
                    item.put("subtitle", roadmap.getSubtitle());
                    item.put("color", roadmap.getColor());
                    item.put("iconName", roadmap.getIconName());
                    item.put("duration", roadmap.getDuration());
                    item.put("primaryRoute", roadmap.getPrimaryRoute());

                    List<Map<String, Object>> dailyPlan = plansByRoadmap.getOrDefault(roadmap.getId(), List.of()).stream()
                            .filter(plan -> "daily".equalsIgnoreCase(plan.getPlanType()))
                            .map(plan -> plan.getItemText())
                            .map(text -> Map.<String, Object>of("text", text))
                            .toList();
                    List<Map<String, Object>> weeklyPlan = plansByRoadmap.getOrDefault(roadmap.getId(), List.of()).stream()
                            .filter(plan -> "weekly".equalsIgnoreCase(plan.getPlanType()))
                            .map(plan -> plan.getItemText())
                            .map(text -> Map.<String, Object>of("text", text))
                            .toList();

                    List<Map<String, Object>> trackItems = tracksByRoadmap.getOrDefault(roadmap.getId(), List.of()).stream()
                            .map(track -> {
                                Map<String, Object> trackItem = new LinkedHashMap<>();
                                trackItem.put("id", track.getTrackKey());
                                trackItem.put("label", track.getLabel());
                                trackItem.put("resources", trackResourcesByTrack.getOrDefault(track.getId(), List.of()).stream()
                                        .map(resource -> Map.<String, Object>of(
                                                "label", resource.getLabel(),
                                                "url", resource.getUrl()
                                        ))
                                        .toList());
                                return trackItem;
                            })
                            .toList();

                    List<Map<String, Object>> levelItems = stagesByRoadmap.getOrDefault(roadmap.getId(), List.of()).stream()
                            .map(stage -> {
                                Map<String, Object> levelItem = new LinkedHashMap<>();
                                levelItem.put("id", stage.getStageKey());
                                levelItem.put("label", stage.getLabel());
                                levelItem.put("desc", stage.getDescription());
                                levelItem.put("topics", topicsByStage.getOrDefault(stage.getId(), List.of()).stream()
                                        .map(topic -> {
                                            Map<String, Object> topicItem = new LinkedHashMap<>();
                                            topicItem.put("id", topic.getTopicKey());
                                            topicItem.put("title", topic.getTitle());
                                            topicItem.put("summary", topic.getSummary());
                                            topicItem.put("difficulty", topic.getDifficulty());
                                            topicItem.put("route", topic.getRoute());
                                            topicItem.put("resources", topicResourcesByTopic.getOrDefault(topic.getId(), List.of()).stream()
                                                    .map(resource -> Map.<String, Object>of(
                                                            "label", resource.getLabel(),
                                                            "url", resource.getUrl(),
                                                            "internal", Boolean.TRUE.equals(resource.getInternalLink())
                                                    ))
                                                    .toList());
                                            return topicItem;
                                        })
                                        .toList());
                                return levelItem;
                            })
                            .toList();

                    item.put("daily", dailyPlan.stream().map(plan -> plan.get("text")).toList());
                    item.put("weekly", weeklyPlan.stream().map(plan -> plan.get("text")).toList());
                    item.put("tracks", trackItems);
                    item.put("levels", levelItems);
                    return item;
                })
                .toList();

        return ResponseEntity.ok(response);
    }
}
