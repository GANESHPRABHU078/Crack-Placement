package com.placementos.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_topic_resources")
public class RoadmapTopicResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private RoadmapTopic topic;

    @Column(nullable = false, length = 150)
    private String label;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false)
    private Boolean internalLink;

    @Column(nullable = false)
    private Integer displayOrder;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoadmapTopic getTopic() {
        return topic;
    }

    public void setTopic(RoadmapTopic topic) {
        this.topic = topic;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getInternalLink() {
        return internalLink;
    }

    public void setInternalLink(Boolean internalLink) {
        this.internalLink = internalLink;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
