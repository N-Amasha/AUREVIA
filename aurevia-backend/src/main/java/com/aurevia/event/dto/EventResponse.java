package com.aurevia.event.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventResponse(
        Integer eventId,
        Integer eventBookingId,
        Integer coordinatorId,
        String coordinatorName,
        String eventName,
        String eventType,
        LocalDate eventDate,
        LocalTime startTime,
        LocalTime endTime,
        BigDecimal budget,
        Integer numberOfGuests,
        String eventStatus
) {
}