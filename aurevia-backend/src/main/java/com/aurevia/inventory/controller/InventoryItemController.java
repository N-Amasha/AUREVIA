package com.aurevia.inventory.controller;

import com.aurevia.inventory.dto.InventoryItemResponse;
import com.aurevia.inventory.service.InventoryItemService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-items")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    public InventoryItemController(
            InventoryItemService inventoryItemService
    ) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping
    public List<InventoryItemResponse> getAllItems() {
        return inventoryItemService
                .getAllInventoryItems();
    }

    @GetMapping("/{inventoryItemId}")
    public InventoryItemResponse getItemById(
            @PathVariable Integer inventoryItemId
    ) {
        return inventoryItemService
                .getInventoryItemById(inventoryItemId);
    }

    @GetMapping("/suppliers/{supplierId}")
    public List<InventoryItemResponse> getItemsBySupplier(
            @PathVariable Integer supplierId
    ) {
        return inventoryItemService
                .getItemsBySupplier(supplierId);
    }

    @GetMapping("/categories/{itemCategory}")
    public List<InventoryItemResponse> getItemsByCategory(
            @PathVariable String itemCategory
    ) {
        return inventoryItemService
                .getItemsByCategory(itemCategory);
    }

    @GetMapping("/alerts/reorder")
    public List<InventoryItemResponse> getReorderAlerts() {
        return inventoryItemService.getReorderAlerts();
    }

    @GetMapping("/alerts/expired")
    public List<InventoryItemResponse> getExpiredItems() {
        return inventoryItemService.getExpiredItems();
    }

    @GetMapping("/alerts/expiring")
    public List<InventoryItemResponse> getExpiryAlerts(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return inventoryItemService.getExpiryAlerts(
                startDate,
                endDate
        );
    }
}