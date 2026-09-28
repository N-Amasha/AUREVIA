package com.aurevia.billing.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record InvoiceCreateRequest(

        @NotNull(message = "Customer ID is required.")
        @Positive(message = "Customer ID must be positive.")
        Integer customerId,

        @Positive(message = "Reservation ID must be positive.")
        Integer reservationId,

        @Positive(message = "Event booking ID must be positive.")
        Integer eventBookingId,

        @Positive(message = "Order ID must be positive.")
        Integer orderId,

        @NotNull(message = "Subtotal is required.")
        @DecimalMin(
                value = "0.00",
                message = "Subtotal cannot be negative."
        )
        BigDecimal subtotal,

        @NotNull(message = "Discount is required.")
        @DecimalMin(
                value = "0.00",
                message = "Discount cannot be negative."
        )
        BigDecimal discount,

        @NotNull(message = "Tax amount is required.")
        @DecimalMin(
                value = "0.00",
                message = "Tax amount cannot be negative."
        )
        BigDecimal taxAmount
) {
}