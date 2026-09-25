package com.aurevia.reservation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;

@Entity
@Table(
        name = "venue",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_venue_name",
                columnNames = "venue_name"
        )
)
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venue_id", nullable = false)
    private Integer venueId;

    @Column(name = "venue_name", nullable = false, length = 100)
    private String venueName;

    @Column(
            name = "availability_status",
            nullable = false,
            length = 30
    )
    private String availabilityStatus;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "location", nullable = false, length = 150)
    private String location;

    @Column(name = "venue_type", nullable = false, length = 50)
    private String venueType;

    @Column(
            name = "base_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal basePrice;

    protected Venue() {
    }

    public Venue(
            String venueName,
            String availabilityStatus,
            Integer capacity,
            String location,
            String venueType,
            BigDecimal basePrice
    ) {
        this.venueName = venueName;
        this.availabilityStatus = availabilityStatus;
        this.capacity = capacity;
        this.location = location;
        this.venueType = venueType;
        this.basePrice = basePrice;
    }

    public Integer getVenueId() {
        return venueId;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVenueType() {
        return venueType;
    }

    public void setVenueType(String venueType) {
        this.venueType = venueType;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }
}