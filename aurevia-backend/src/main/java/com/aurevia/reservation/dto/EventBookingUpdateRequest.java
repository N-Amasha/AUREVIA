package com.aurevia.reservation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record EventBookingUpdateRequest(

        @NotNull(message = "Venue ID is required.")
        @Positive(message = "Venue ID must be positive.")
        Integer venueId,

        @NotNull(message = "Booking date is required.")
        @FutureOrPresent(
                message = "Booking date cannot be in the past."
        )
        LocalDate bookingDate,

        @NotNull(message = "Guest count is required.")
        @Positive(message = "Guest count must be positive.")
        Integer guestCount
) {
}