package com.aurevia.menu.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Integer menuItemId,
        String itemName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
}