package com.aurevia.event.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalTime;

public record CoordinatorEventCreateRequest(

        @NotNull(message = "Event booking ID is required.")
        @Positive(message = "Event booking ID must be positive.")
        Integer eventBookingId,

        @NotBlank(message = "Event name is required.")
        String eventName,

        @NotBlank(message = "Event type is required.")
        String eventType,

        @NotNull(message = "Start time is required.")
        LocalTime startTime,

        @NotNull(message = "End time is required.")
        LocalTime endTime,

        @NotNull(message = "Budget is required.")
        @DecimalMin(
                value = "0.00",
                message = "Budget cannot be negative."
        )
        BigDecimal budget
) {
}