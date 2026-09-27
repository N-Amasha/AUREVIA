package com.aurevia.menu.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FavoritePackageResponse(
        Integer favoriteId,
        Integer customerId,
        String customerName,
        Integer packageId,
        String packageName,
        String packageType,
        BigDecimal basePrice,
        LocalDateTime savedDate,
        String notes
) {
}