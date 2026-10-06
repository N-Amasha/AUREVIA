package com.aurevia.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record RestaurantTableRequest(

        @NotBlank(message = "Table number is required.")
        @Size(
                max = 20,
                message = "Table number cannot exceed 20 characters."
        )
        String tableNumber,

        @NotNull(message = "Capacity is required.")
        @Positive(message = "Capacity must be greater than zero.")
        Integer capacity,

        @NotBlank(message = "Location is required.")
        @Size(
                max = 100,
                message = "Location cannot exceed 100 characters."
        )
        String location,

        @NotBlank(message = "Table status is required.")
        String tableStatus
) {
}