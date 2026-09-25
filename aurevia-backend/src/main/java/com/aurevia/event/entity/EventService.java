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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "event_service")
public class EventService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_service_id", nullable = false)
    private Integer eventServiceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "event_id",
            referencedColumnName = "event_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_event_service_event"
            )
    )
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "vendor_id",
            referencedColumnName = "vendor_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_event_service_vendor"
            )
    )
    private Vendor vendor;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(
            name = "cost",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal cost;

    @Column(
            name = "service_status",
            nullable = false,
            length = 30
    )
    private String serviceStatus;

    protected EventService() {
    }

    public EventService(
            Event event,
            Vendor vendor,
            String serviceName,
            LocalDate serviceDate,
            LocalTime startTime,
            LocalTime endTime,
            BigDecimal cost,
            String serviceStatus
    ) {
        this.event = event;
        this.vendor = vendor;
        this.serviceName = serviceName;
        this.serviceDate = serviceDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.cost = cost;
        this.serviceStatus = serviceStatus;
    }

    public Integer getEventServiceId() {
        return eventServiceId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
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

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public String getServiceStatus() {
        return serviceStatus;
    }

    public void setServiceStatus(String serviceStatus) {
        this.serviceStatus = serviceStatus;
    }
}