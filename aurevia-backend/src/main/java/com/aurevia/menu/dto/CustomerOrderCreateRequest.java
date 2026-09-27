package com.aurevia.menu.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record CustomerOrderCreateRequest(

        @NotNull(message = "Customer ID is required.")
        @Positive(message = "Customer ID must be positive.")
        Integer customerId,

        @NotBlank(message = "Order type is required.")
        String orderType,

        @NotEmpty(
                message = "At least one order item is required."
        )
        List<@Valid OrderItemCreateRequest> items
) {
}