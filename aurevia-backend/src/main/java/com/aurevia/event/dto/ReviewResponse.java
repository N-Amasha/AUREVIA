package com.aurevia.event.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Integer reviewId,
        Integer customerId,
        String customerName,
        Integer eventId,
        String eventName,
        Integer orderId,
        LocalDateTime reviewDate,
        Integer rating,
        String comment,
        String sentiment
) {
}