package com.aurevia.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Integer paymentId,
        Integer invoiceId,
        Integer customerId,
        String customerName,
        Integer verifiedByCashierId,
        String transactionReference,
        String paymentType,
        LocalDateTime paymentDate,
        BigDecimal amount,
        String paymentMethod,
        String paymentStatus,
        LocalDateTime verifiedAt
) {
}