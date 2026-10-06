package com.aurevia.event.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventServiceUpdateRequest(

        @NotNull(message = "Vendor ID is required.")
        @Positive(message = "Vendor ID must be positive.")
        Integer vendorId,

        @NotBlank(message = "Service name is required.")
        String serviceName,

        @NotNull(message = "Service date is required.")
        LocalDate serviceDate,

        @NotNull(message = "Start time is required.")
        LocalTime startTime,

        @NotNull(message = "End time is required.")
        LocalTime endTime,

        @NotNull(message = "Cost is required.")
        @DecimalMin(
                value = "0.00",
                message = "Cost cannot be negative."
        )
        BigDecimal cost,

        @NotBlank(message = "Service status is required.")
        String serviceStatus
) {
}