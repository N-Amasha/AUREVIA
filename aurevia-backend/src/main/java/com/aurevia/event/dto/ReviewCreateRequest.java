package com.aurevia.event.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ReviewCreateRequest(

        @NotNull(message = "Customer ID is required.")
        @Positive(message = "Customer ID must be positive.")
        Integer customerId,

        @Positive(message = "Event ID must be positive.")
        Integer eventId,

        @Positive(message = "Order ID must be positive.")
        Integer orderId,

        @NotNull(message = "Rating is required.")
        @Min(
                value = 1,
                message = "Rating must be between 1 and 5."
        )
        @Max(
                value = 5,
                message = "Rating must be between 1 and 5."
        )
        Integer rating,

        String comment
) {
}