package com.aurevia.inventory.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryUsageCreateRequest;
import com.aurevia.inventory.dto.InventoryUsageResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.entity.InventoryUsage;
import com.aurevia.inventory.mapper.InventoryUsageMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import com.aurevia.inventory.repository.InventoryUsageRepository;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.repository.CustomerOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class InventoryUsageService {

    private final InventoryUsageRepository usageRepository;
    private final InventoryItemRepository itemRepository;
    private final CustomerOrderRepository orderRepository;
    private final InventoryUsageMapper usageMapper;

    public InventoryUsageService(
            InventoryUsageRepository usageRepository,
            InventoryItemRepository itemRepository,
            CustomerOrderRepository orderRepository,
            InventoryUsageMapper usageMapper
    ) {
        this.usageRepository = usageRepository;
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
        this.usageMapper = usageMapper;
    }

    @Transactional
    public InventoryUsageResponse recordUsage(
            InventoryUsageCreateRequest request
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

        if (request.quantityUsed().compareTo(
                item.getCurrentQuantity()
        ) > 0) {
            throw new BusinessRuleException(
                    "Insufficient inventory quantity "
                            + "for this usage."
            );
        }

        CustomerOrder order = null;

        if (request.orderId() != null) {
            order = orderRepository
                    .findById(request.orderId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Customer order",
                                    "orderId",
                                    request.orderId()
                            )
                    );
        }

        InventoryUsage usage = new InventoryUsage();
        usage.setInventoryItem(item);
        usage.setCustomerOrder(order);
        usage.setUsageDate(request.usageDate());
        usage.setQuantityUsed(request.quantityUsed());
        usage.setUsageReason(request.usageReason().trim());

        InventoryUsage savedUsage =
                usageRepository.saveAndFlush(usage);

        return usageMapper.toResponse(savedUsage);
    }

    public InventoryUsageResponse getUsageById(
            Integer usageId
    ) {
        InventoryUsage usage = usageRepository
                .findById(usageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory usage",
                                "usageId",
                                usageId
                        )
                );

        return usageMapper.toResponse(usage);
    }

    public List<InventoryUsageResponse> getUsageByItem(
            Integer inventoryItemId
    ) {
        return mapUsage(
                usageRepository
                        .findByInventoryItemInventoryItemIdOrderByUsageDateDesc(
                                inventoryItemId
                        )
        );
    }

    public List<InventoryUsageResponse> getUsageByOrder(
            Integer orderId
    ) {
        return mapUsage(
                usageRepository
                        .findByCustomerOrderOrderIdOrderByUsageDateDesc(
                                orderId
                        )
        );
    }

    public List<InventoryUsageResponse> getGeneralUsage() {
        return mapUsage(
                usageRepository
                        .findByCustomerOrderIsNullOrderByUsageDateDesc()
        );
    }

    public List<InventoryUsageResponse> getUsageByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        validateDateRange(startDate, endDate);

        return mapUsage(
                usageRepository
                        .findByUsageDateBetweenOrderByUsageDateAsc(
                                startDate,
                                endDate
                        )
        );
    }

    public BigDecimal getTotalUsageForItem(
            Integer inventoryItemId
    ) {
        BigDecimal total =
                usageRepository
                        .calculateTotalUsageForItem(
                                inventoryItemId
                        );

        return total == null ? BigDecimal.ZERO : total;
    }

    private List<InventoryUsageResponse> mapUsage(
            List<InventoryUsage> usageRecords
    ) {
        return usageRecords.stream()
                .map(usageMapper::toResponse)
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