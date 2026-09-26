package com.aurevia.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationResponse(
        Integer reservationId,
        Integer customerId,
        String customerName,
        Integer tableId,
        String tableNumber,
        String tableLocation,
        LocalDate reservationDate,
        LocalTime startTime,
        LocalTime endTime,
        Integer numberOfGuests,
        String reservationStatus,
        LocalDateTime createdAt
) {
}