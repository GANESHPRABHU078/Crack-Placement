package com.placementos.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_stages")
public class RoadmapStage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private RoadmapDefinition roadmap;

    @Column(nullable = false, length = 100)
    private String stageKey;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false, length = 400)
    private String description;

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

    public String getStageKey() {
        return stageKey;
    }

    public void setStageKey(String stageKey) {
        this.stageKey = stageKey;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
