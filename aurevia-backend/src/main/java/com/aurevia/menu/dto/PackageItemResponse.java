package com.aurevia.menu.dto;

import java.math.BigDecimal;

public record PackageItemResponse(
        Integer menuItemId,
        String itemName,
        String category,
        Integer quantity,
        BigDecimal unitPrice,
        String availabilityStatus
) {
}