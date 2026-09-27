package com.aurevia.menu.dto;

import java.math.BigDecimal;

public record MenuItemResponse(
        Integer menuItemId,
        Integer menuId,
        String menuName,
        String itemName,
        String category,
        String description,
        BigDecimal price,
        String availabilityStatus
) {
}