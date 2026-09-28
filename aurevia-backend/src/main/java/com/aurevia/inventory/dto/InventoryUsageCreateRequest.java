package com.aurevia.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InventoryUsageCreateRequest(

        @NotNull(message = "Inventory item ID is required.")
        @Positive(message = "Inventory item ID must be positive.")
        Integer inventoryItemId,

        @Positive(message = "Order ID must be positive.")
        Integer orderId,

        @NotNull(message = "Usage date is required.")
        LocalDateTime usageDate,

        @NotNull(message = "Quantity used is required.")
        @DecimalMin(
                value = "0.001",
                message = "Quantity used must be greater than zero."
        )
        BigDecimal quantityUsed,

        @NotBlank(message = "Usage reason is required.")
        String usageReason
) {
}