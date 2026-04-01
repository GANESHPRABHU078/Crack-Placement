package com.placementos.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_plan_items")
public class RoadmapPlanItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private RoadmapDefinition roadmap;

    @Column(nullable = false, length = 20)
    private String planType;

    @Column(nullable = false, length = 500)
    private String itemText;

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

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getItemText() {
        return itemText;
    }

    public void setItemText(String itemText) {
        this.itemText = itemText;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
