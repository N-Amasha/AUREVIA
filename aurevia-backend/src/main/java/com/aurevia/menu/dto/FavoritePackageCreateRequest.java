package com.aurevia.menu.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record FavoritePackageCreateRequest(

        @NotNull(message = "Customer ID is required.")
        @Positive(message = "Customer ID must be positive.")
        Integer customerId,

        @NotNull(message = "Package ID is required.")
        @Positive(message = "Package ID must be positive.")
        Integer packageId,

        @Size(
                max = 255,
                message = "Notes cannot exceed 255 characters."
        )
        String notes
) {
}