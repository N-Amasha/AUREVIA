package com.aurevia.billing.dto;

import jakarta.validation.constraints.NotBlank;

public record PaymentVerificationRequest(

        @NotBlank(message = "Payment status is required.")
        String paymentStatus
) {
}