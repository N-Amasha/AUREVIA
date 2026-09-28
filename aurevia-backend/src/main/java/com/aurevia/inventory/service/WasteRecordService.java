package com.aurevia.inventory.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.WasteRecordCreateRequest;
import com.aurevia.inventory.dto.WasteRecordResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.entity.WasteRecord;
import com.aurevia.inventory.mapper.WasteRecordMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import com.aurevia.inventory.repository.WasteRecordRepository;
import com.aurevia.user.entity.InventoryManager;
import com.aurevia.user.repository.InventoryManagerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class WasteRecordService {

    private final WasteRecordRepository wasteRepository;
    private final InventoryItemRepository itemRepository;
    private final InventoryManagerRepository managerRepository;
    private final WasteRecordMapper wasteMapper;

    public WasteRecordService(
            WasteRecordRepository wasteRepository,
            InventoryItemRepository itemRepository,
            InventoryManagerRepository managerRepository,
            WasteRecordMapper wasteMapper
    ) {
        this.wasteRepository = wasteRepository;
        this.itemRepository = itemRepository;
        this.managerRepository = managerRepository;
        this.wasteMapper = wasteMapper;
    }

    @Transactional
    public WasteRecordResponse recordWaste(
            WasteRecordCreateRequest request
    ) {
        InventoryItem item = itemRepository
                .findById(request.inventoryItemId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory item",
                                "inventoryItemId",
                                request.inventoryItemId()
                        )
                );

        if (request.quantity().compareTo(
                item.getCurrentQuantity()
        ) > 0) {
            throw new BusinessRuleException(
                    "Waste quantity exceeds the available "
                            + "inventory quantity."
            );
        }

        InventoryManager manager = managerRepository
                .findById(request.managerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory manager",
                                "managerId",
                                request.managerId()
                        )
                );

        BigDecimal estimatedCost =
                request.quantity()
                        .multiply(item.getUnitCost());

        WasteRecord wasteRecord = new WasteRecord();
        wasteRecord.setInventoryItem(item);
        wasteRecord.setRecordedByManager(manager);
        wasteRecord.setWasteDate(request.wasteDate());
        wasteRecord.setWasteReason(
                request.wasteReason().trim()
        );
        wasteRecord.setQuantity(request.quantity());
        wasteRecord.setEstimatedCost(estimatedCost);

        item.setCurrentQuantity(
                item.getCurrentQuantity()
                        .subtract(request.quantity())
        );

        itemRepository.save(item);

        WasteRecord savedRecord =
                wasteRepository.saveAndFlush(wasteRecord);

        return wasteMapper.toResponse(savedRecord);
    }

    public WasteRecordResponse getWasteRecordById(
            Integer wasteId
    ) {
        WasteRecord wasteRecord = wasteRepository
                .findById(wasteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Waste record",
                                "wasteId",
                                wasteId
                        )
                );

        return wasteMapper.toResponse(wasteRecord);
    }

    public List<WasteRecordResponse> getWasteByItem(
            Integer inventoryItemId
    ) {
        return mapWaste(
                wasteRepository
                        .findByInventoryItemInventoryItemIdOrderByWasteDateDesc(
                                inventoryItemId
                        )
        );
    }

    public List<WasteRecordResponse> getWasteByManager(
            Integer managerId
    ) {
        return mapWaste(
                wasteRepository
                        .findByRecordedByManagerEmployeeIdOrderByWasteDateDesc(
                                managerId
                        )
        );
    }

    public List<WasteRecordResponse> getWasteByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        validateDateRange(startDate, endDate);

        return mapWaste(
                wasteRepository
                        .findByWasteDateBetweenOrderByWasteDateAsc(
                                startDate,
                                endDate
                        )
        );
    }

    public BigDecimal getTotalEstimatedWasteCost() {
        BigDecimal total =
                wasteRepository
                        .calculateTotalEstimatedWasteCost();

        return total == null ? BigDecimal.ZERO : total;
    }

    public BigDecimal getEstimatedWasteCostForItem(
            Integer inventoryItemId
    ) {
        BigDecimal total =
                wasteRepository
                        .calculateEstimatedWasteCostForItem(
                                inventoryItemId
                        );

        return total == null ? BigDecimal.ZERO : total;
    }

    private List<WasteRecordResponse> mapWaste(
            List<WasteRecord> records
    ) {
        return records.stream()
                .map(wasteMapper::toResponse)
                .toList();
    }

    private void validateDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
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
    }
}