package com.aurevia.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InventoryUsageResponse(
        Integer usageId,
        Integer inventoryItemId,
        String itemName,
        Integer orderId,
        LocalDateTime usageDate,
        BigDecimal quantityUsed,
        String unit,
        String usageReason
) {
}