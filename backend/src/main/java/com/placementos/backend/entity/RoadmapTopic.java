package com.placementos.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_topics")
public class RoadmapTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private RoadmapDefinition roadmap;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stage_id", nullable = false)
    private RoadmapStage stage;

    @Column(nullable = false, length = 150)
    private String topicKey;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(nullable = false, length = 120)
    private String route;

    @Column(nullable = false)
    private Integer displayOrder;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoadmapDefinition getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(RoadmapDefinition roadmap) {
        this.roadmap = roadmap;
    }

    public RoadmapStage getStage() {
        return stage;
    }

    public void setStage(RoadmapStage stage) {
        this.stage = stage;
    }

    public String getTopicKey() {
        return topicKey;
    }

    public void setTopicKey(String topicKey) {
        this.topicKey = topicKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
