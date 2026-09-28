package com.aurevia.billing.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceResponse(
        Integer invoiceId,
        Integer customerId,
        String customerName,
        Integer reservationId,
        Integer eventBookingId,
        Integer orderId,
        LocalDateTime invoiceDate,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        BigDecimal approvedAmount,
        BigDecimal outstandingAmount,
        String invoiceStatus
) {
}