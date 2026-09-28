package com.aurevia.inventory.mapper;

import com.aurevia.inventory.dto.InventoryUsageResponse;
import com.aurevia.inventory.entity.InventoryUsage;
import org.springframework.stereotype.Component;

@Component
public class InventoryUsageMapper {

    public InventoryUsageResponse toResponse(
            InventoryUsage usage
    ) {
        Integer orderId =
                usage.getCustomerOrder() == null
                        ? null
                        : usage.getCustomerOrder().getOrderId();

        return new InventoryUsageResponse(
                usage.getUsageId(),
                usage.getInventoryItem()
                        .getInventoryItemId(),
                usage.getInventoryItem().getItemName(),
                orderId,
                usage.getUsageDate(),
                usage.getQuantityUsed(),
                usage.getInventoryItem().getUnit(),
                usage.getUsageReason()
        );
    }
}