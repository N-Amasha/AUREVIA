package com.aurevia.inventory.controller;

import com.aurevia.inventory.dto.InventoryUsageCreateRequest;
import com.aurevia.inventory.dto.InventoryUsageResponse;
import com.aurevia.inventory.service.InventoryUsageService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-usages")
public class InventoryUsageController {

    private final InventoryUsageService usageService;

    public InventoryUsageController(
            InventoryUsageService usageService
    ) {
        this.usageService = usageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryUsageResponse recordUsage(
            @Valid @RequestBody
            InventoryUsageCreateRequest request
    ) {
        return usageService.recordUsage(request);
    }

    @GetMapping("/{usageId}")
    public InventoryUsageResponse getUsageById(
            @PathVariable Integer usageId
    ) {
        return usageService.getUsageById(usageId);
    }

    @GetMapping("/items/{inventoryItemId}")
    public List<InventoryUsageResponse> getUsageByItem(
            @PathVariable Integer inventoryItemId
    ) {
        return usageService.getUsageByItem(
                inventoryItemId
        );
    }

    @GetMapping("/orders/{orderId}")
    public List<InventoryUsageResponse> getUsageByOrder(
            @PathVariable Integer orderId
    ) {
        return usageService.getUsageByOrder(orderId);
    }

    @GetMapping("/general")
    public List<InventoryUsageResponse> getGeneralUsage() {
        return usageService.getGeneralUsage();
    }

    @GetMapping("/date-range")
    public List<InventoryUsageResponse> getUsageByDateRange(
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime startDate,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime endDate
    ) {
        return usageService.getUsageByDateRange(
                startDate,
                endDate
        );
    }

    @GetMapping("/items/{inventoryItemId}/total")
    public BigDecimal getTotalUsageForItem(
            @PathVariable Integer inventoryItemId
    ) {
        return usageService.getTotalUsageForItem(
                inventoryItemId
        );
    }
}