package com.aurevia.event.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_timeline")
public class EventTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timeline_id", nullable = false)
    private Integer timelineId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "event_id",
            referencedColumnName = "event_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_event_timeline_event"
            )
    )
    private Event event;

    @Column(
            name = "milestone_name",
            nullable = false,
            length = 150
    )
    private String milestoneName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(
            name = "updated_date",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime updatedDate;

    protected EventTimeline() {
    }

    public EventTimeline(
            Event event,
            String milestoneName,
            String description,
            LocalDateTime scheduledDate,
            String status
    ) {
        this.event = event;
        this.milestoneName = milestoneName;
        this.description = description;
        this.scheduledDate = scheduledDate;
        this.status = status;
    }

    public Integer getTimelineId() {
        return timelineId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getMilestoneName() {
        return milestoneName;
    }

    public void setMilestoneName(String milestoneName) {
        this.milestoneName = milestoneName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }
}