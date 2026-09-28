package com.aurevia.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WasteRecordResponse(
        Integer wasteId,
        Integer inventoryItemId,
        String itemName,
        Integer managerId,
        String managerName,
        LocalDateTime wasteDate,
        String wasteReason,
        BigDecimal quantity,
        String unit,
        BigDecimal estimatedCost
) {
}