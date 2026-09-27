package com.aurevia.menu.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CustomerOrderResponse(
        Integer orderId,
        Integer customerId,
        String customerName,
        LocalDateTime orderDate,
        String orderType,
        String orderStatus,
        BigDecimal totalAmount,
        List<OrderItemResponse> items
) {
}