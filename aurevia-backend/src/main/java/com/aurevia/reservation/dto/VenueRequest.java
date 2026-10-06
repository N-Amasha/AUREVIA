package com.aurevia.reservation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record VenueRequest(

        @NotBlank(message = "Venue name is required.")
        @Size(
                max = 100,
                message = "Venue name cannot exceed 100 characters."
        )
        String venueName,

        @NotBlank(
                message = "Availability status is required."
        )
        String availabilityStatus,

        @NotNull(message = "Capacity is required.")
        @Positive(
                message = "Capacity must be greater than zero."
        )
        Integer capacity,

        @NotBlank(message = "Location is required.")
        @Size(
                max = 150,
                message = "Location cannot exceed 150 characters."
        )
        String location,

        @NotBlank(message = "Venue type is required.")
        @Size(
                max = 50,
                message = "Venue type cannot exceed 50 characters."
        )
        String venueType,

        @NotNull(message = "Base price is required.")
        @DecimalMin(
                value = "0.00",
                message = "Base price cannot be negative."
        )
        BigDecimal basePrice
) {
}