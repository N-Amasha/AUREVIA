package com.aurevia.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentVerificationRequest(

        @NotNull(message = "Cashier ID is required.")
        @Positive(message = "Cashier ID must be positive.")
        Integer cashierId,

        @NotBlank(message = "Payment status is required.")
        String paymentStatus
) {
}