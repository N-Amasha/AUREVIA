package com.aurevia.billing.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentCreateRequest(

        @NotNull(message = "Invoice ID is required.")
        @Positive(message = "Invoice ID must be positive.")
        Integer invoiceId,

        @NotBlank(message = "Transaction reference is required.")
        String transactionReference,

        @NotBlank(message = "Payment type is required.")
        String paymentType,

        @NotNull(message = "Payment date is required.")
        LocalDateTime paymentDate,

        @NotNull(message = "Payment amount is required.")
        @DecimalMin(
                value = "0.01",
                message = "Payment amount must be greater than zero."
        )
        BigDecimal amount,

        @NotBlank(message = "Payment method is required.")
        String paymentMethod
) {
}