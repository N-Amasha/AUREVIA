package com.aurevia.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InventoryItemResponse(
        Integer inventoryItemId,
        Integer supplierId,
        String supplierName,
        String itemName,
        String itemCategory,
        String unit,
        BigDecimal currentQuantity,
        BigDecimal reorderLevel,
        BigDecimal unitCost,
        LocalDate expiryDate,
        boolean reorderRequired,
        boolean expired
) {
}