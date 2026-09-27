package com.aurevia.menu.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemCreateRequest(

        @NotNull(message = "Menu item ID is required.")
        @Positive(message = "Menu item ID must be positive.")
        Integer menuItemId,

        @NotNull(message = "Quantity is required.")
        @Positive(message = "Quantity must be positive.")
        Integer quantity
) {
}