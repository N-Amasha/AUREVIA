package com.aurevia.reservation.entity;

import com.aurevia.user.entity.Customer;
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
import java.time.LocalDateTime;

@Entity
@Table(name = "event_booking")
public class EventBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_booking_id", nullable = false)
    private Integer eventBookingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_event_booking_customer"
            )
    )
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "venue_id",
            referencedColumnName = "venue_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_event_booking_venue"
            )
    )
    private Venue venue;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(name = "booking_status", nullable = false, length = 30)
    private String bookingStatus;

    @Column(
            name = "created_at",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    protected EventBooking() {
    }

    public EventBooking(
            Customer customer,
            Venue venue,
            LocalDate bookingDate,
            Integer guestCount,
            BigDecimal totalAmount,
            String bookingStatus
    ) {
        this.customer = customer;
        this.venue = venue;
        this.bookingDate = bookingDate;
        this.guestCount = guestCount;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
    }

    public Integer getEventBookingId() {
        return eventBookingId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}