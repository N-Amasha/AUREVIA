package com.aurevia.inventory.controller;

import com.aurevia.inventory.dto.WasteRecordCreateRequest;
import com.aurevia.inventory.dto.WasteRecordResponse;
import com.aurevia.inventory.service.WasteRecordService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/waste-records")
public class WasteRecordController {

    private final WasteRecordService wasteService;

    public WasteRecordController(
            WasteRecordService wasteService
    ) {
        this.wasteService = wasteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WasteRecordResponse recordWaste(
            @Valid @RequestBody
            WasteRecordCreateRequest request
    ) {
        return wasteService.recordWaste(request);
    }

    @GetMapping("/{wasteId}")
    public WasteRecordResponse getWasteRecordById(
            @PathVariable Integer wasteId
    ) {
        return wasteService.getWasteRecordById(wasteId);
    }

    @GetMapping("/items/{inventoryItemId}")
    public List<WasteRecordResponse> getWasteByItem(
            @PathVariable Integer inventoryItemId
    ) {
        return wasteService.getWasteByItem(
                inventoryItemId
        );
    }

    @GetMapping("/managers/{managerId}")
    public List<WasteRecordResponse> getWasteByManager(
            @PathVariable Integer managerId
    ) {
        return wasteService.getWasteByManager(managerId);
    }

    @GetMapping("/date-range")
    public List<WasteRecordResponse> getWasteByDateRange(
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
        return wasteService.getWasteByDateRange(
                startDate,
                endDate
        );
    }

    @GetMapping("/total-cost")
    public BigDecimal getTotalEstimatedWasteCost() {
        return wasteService
                .getTotalEstimatedWasteCost();
    }

    @GetMapping("/items/{inventoryItemId}/total-cost")
    public BigDecimal getWasteCostForItem(
            @PathVariable Integer inventoryItemId
    ) {
        return wasteService
                .getEstimatedWasteCostForItem(
                        inventoryItemId
                );
    }
}