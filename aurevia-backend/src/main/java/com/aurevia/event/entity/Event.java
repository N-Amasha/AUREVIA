package com.aurevia.event.entity;

import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.user.entity.EventCoordinator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "events",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_event_booking",
                columnNames = "event_booking_id"
        )
)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "event_booking_id",
            referencedColumnName = "event_booking_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_event_booking")
    )
    private EventBooking eventBooking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "coordinator_id",
            referencedColumnName = "employee_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_event_coordinator")
    )
    private EventCoordinator coordinator;

    @Column(name = "event_name", nullable = false, length = 150)
    private String eventName;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(
            name = "budget",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal budget;

    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

    @Column(name = "event_status", nullable = false, length = 30)
    private String eventStatus;

    protected Event() {
    }

    public Event(
            EventBooking eventBooking,
            EventCoordinator coordinator,
            String eventName,
            String eventType,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            BigDecimal budget,
            Integer numberOfGuests,
            String eventStatus
    ) {
        this.eventBooking = eventBooking;
        this.coordinator = coordinator;
        this.eventName = eventName;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.budget = budget;
        this.numberOfGuests = numberOfGuests;
        this.eventStatus = eventStatus;
    }

    public Integer getEventId() {
        return eventId;
    }

    public EventBooking getEventBooking() {
        return eventBooking;
    }

    public void setEventBooking(EventBooking eventBooking) {
        this.eventBooking = eventBooking;
    }

    public EventCoordinator getCoordinator() {
        return coordinator;
    }

    public void setCoordinator(EventCoordinator coordinator) {
        this.coordinator = coordinator;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public String getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }
}