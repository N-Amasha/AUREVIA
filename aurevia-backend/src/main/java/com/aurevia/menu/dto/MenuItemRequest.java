package com.aurevia.menu.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MenuItemRequest(

        @NotNull(message = "Menu ID is required.")
        @Positive(message = "Menu ID must be positive.")
        Integer menuId,

        @NotBlank(message = "Item name is required.")
        @Size(
                max = 100,
                message = "Item name cannot exceed 100 characters."
        )
        String itemName,

        @NotBlank(message = "Category is required.")
        @Size(
                max = 50,
                message = "Category cannot exceed 50 characters."
        )
        String category,

        String description,

        @NotNull(message = "Price is required.")
        @DecimalMin(
                value = "0.00",
                message = "Price cannot be negative."
        )
        BigDecimal price,

        @NotBlank(message = "Availability status is required.")
        @Size(
                max = 30,
                message = "Availability status cannot exceed 30 characters."
        )
        String availabilityStatus
) {
}