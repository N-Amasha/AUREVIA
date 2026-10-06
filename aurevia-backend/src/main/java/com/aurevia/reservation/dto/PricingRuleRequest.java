package com.aurevia.reservation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PricingRuleRequest(

        @NotNull(message = "Venue ID is required.")
        @Positive(message = "Venue ID must be positive.")
        Integer venueId,

        @NotBlank(message = "Rule name is required.")
        String ruleName,

        @NotNull(message = "Start date is required.")
        LocalDate startDate,

        @NotNull(message = "End date is required.")
        LocalDate endDate,

        @NotNull(message = "Surcharge is required.")
        @DecimalMin(
                value = "0.00",
                message = "Surcharge cannot be negative."
        )
        BigDecimal surcharge,

        @NotNull(message = "Price is required.")
        @DecimalMin(
                value = "0.00",
                message = "Price cannot be negative."
        )
        BigDecimal price,

        @NotBlank(message = "Approval status is required.")
        String approvalStatus
) {
}