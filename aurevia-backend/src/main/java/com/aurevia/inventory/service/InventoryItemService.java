package com.aurevia.inventory.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryItemResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.mapper.InventoryItemMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryItemMapper inventoryItemMapper;

    public InventoryItemService(
            InventoryItemRepository inventoryItemRepository,
            InventoryItemMapper inventoryItemMapper
    ) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryItemMapper = inventoryItemMapper;
    }

    public InventoryItemResponse getInventoryItemById(
            Integer inventoryItemId
    ) {
        InventoryItem item = inventoryItemRepository
                .findById(inventoryItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory item",
                                "inventoryItemId",
                                inventoryItemId
                        )
                );

        return inventoryItemMapper.toResponse(item);
    }

    public List<InventoryItemResponse> getAllInventoryItems() {
        return mapItems(inventoryItemRepository.findAll());
    }

    public List<InventoryItemResponse> getItemsBySupplier(
            Integer supplierId
    ) {
        return mapItems(
                inventoryItemRepository
                        .findBySupplierSupplierIdOrderByItemNameAsc(
                                supplierId
                        )
        );
    }

    public List<InventoryItemResponse> getItemsByCategory(
            String itemCategory
    ) {
        if (itemCategory == null || itemCategory.isBlank()) {
            throw new IllegalArgumentException(
                    "Item category is required."
            );
        }

        return mapItems(
                inventoryItemRepository
                        .findByItemCategoryIgnoreCaseOrderByItemNameAsc(
                                itemCategory.trim()
                        )
        );
    }

    public List<InventoryItemResponse> getReorderAlerts() {
        return mapItems(
                inventoryItemRepository
                        .findItemsAtOrBelowReorderLevel()
        );
    }

    public List<InventoryItemResponse> getExpiredItems() {
        return mapItems(
                inventoryItemRepository
                        .findByExpiryDateBeforeOrderByExpiryDateAsc(
                                LocalDate.now()
                        )
        );
    }

    public List<InventoryItemResponse> getExpiryAlerts(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required."
            );
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        return mapItems(
                inventoryItemRepository.findItemsExpiringBetween(
                        startDate,
                        endDate
                )
        );
    }

    private List<InventoryItemResponse> mapItems(
            List<InventoryItem> items
    ) {
        return items.stream()
                .map(inventoryItemMapper::toResponse)
                .toList();
    }
}