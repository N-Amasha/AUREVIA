package com.aurevia.reservation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationCreateRequest(

        @NotNull(message = "Customer ID is required.")
        @Positive(message = "Customer ID must be greater than zero.")
        Integer customerId,

        @NotNull(message = "Table ID is required.")
        @Positive(message = "Table ID must be greater than zero.")
        Integer tableId,

        @NotNull(message = "Reservation date is required.")
        @FutureOrPresent(
                message = "Reservation date cannot be in the past."
        )
        LocalDate reservationDate,

        @NotNull(message = "Start time is required.")
        LocalTime startTime,

        @NotNull(message = "End time is required.")
        LocalTime endTime,

        @NotNull(message = "Number of guests is required.")
        @Positive(
                message = "Number of guests must be greater than zero."
        )
        Integer numberOfGuests
) {
}