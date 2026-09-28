package com.aurevia.inventory.mapper;

import com.aurevia.inventory.dto.InventoryItemResponse;
import com.aurevia.inventory.entity.InventoryItem;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class InventoryItemMapper {

    public InventoryItemResponse toResponse(
            InventoryItem item
    ) {
        boolean reorderRequired =
                item.getCurrentQuantity().compareTo(
                        item.getReorderLevel()
                ) <= 0;

        boolean expired =
                item.getExpiryDate() != null
                        && item.getExpiryDate().isBefore(
                                LocalDate.now()
                        );

        return new InventoryItemResponse(
                item.getInventoryItemId(),
                item.getSupplier().getSupplierId(),
                item.getSupplier().getSupplierName(),
                item.getItemName(),
                item.getItemCategory(),
                item.getUnit(),
                item.getCurrentQuantity(),
                item.getReorderLevel(),
                item.getUnitCost(),
                item.getExpiryDate(),
                reorderRequired,
                expired
        );
    }
}