package com.aurevia.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WasteRecordCreateRequest(

        @NotNull(message = "Inventory item ID is required.")
        @Positive(message = "Inventory item ID must be positive.")
        Integer inventoryItemId,

        @NotNull(message = "Inventory manager ID is required.")
        @Positive(
                message = "Inventory manager ID must be positive."
        )
        Integer managerId,

        @NotNull(message = "Waste date is required.")
        LocalDateTime wasteDate,

        @NotBlank(message = "Waste reason is required.")
        String wasteReason,

        @NotNull(message = "Waste quantity is required.")
        @DecimalMin(
                value = "0.001",
                message = "Waste quantity must be greater than zero."
        )
        BigDecimal quantity
) {
}