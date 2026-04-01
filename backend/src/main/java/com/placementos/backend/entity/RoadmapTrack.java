package com.placementos.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_tracks")
public class RoadmapTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private RoadmapDefinition roadmap;

    @Column(nullable = false, length = 100)
    private String trackKey;

    @Column(nullable = false, length = 120)
    private String label;

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

    public String getTrackKey() {
        return trackKey;
    }

    public void setTrackKey(String trackKey) {
        this.trackKey = trackKey;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
