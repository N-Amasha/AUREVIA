package com.aurevia.reservation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EventBookingResponse(
        Integer eventBookingId,
        Integer customerId,
        String customerName,
        Integer venueId,
        String venueName,
        String venueLocation,
        LocalDate bookingDate,
        Integer guestCount,
        BigDecimal totalAmount,
        String bookingStatus,
        LocalDateTime createdAt
) {
}