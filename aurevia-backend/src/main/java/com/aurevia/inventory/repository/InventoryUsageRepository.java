package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.InventoryUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface InventoryUsageRepository
        extends JpaRepository<InventoryUsage, Integer> {

    List<InventoryUsage>
    findByInventoryItemInventoryItemIdOrderByUsageDateDesc(
            Integer inventoryItemId
    );

    List<InventoryUsage>
    findByCustomerOrderOrderIdOrderByUsageDateDesc(
            Integer orderId
    );

    List<InventoryUsage>
    findByCustomerOrderIsNullOrderByUsageDateDesc();

    List<InventoryUsage>
    findByUsageDateBetweenOrderByUsageDateAsc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    @Query("""
            SELECT COALESCE(SUM(usage.quantityUsed), 0)
            FROM InventoryUsage usage
            WHERE usage.inventoryItem.inventoryItemId = :inventoryItemId
            """)
    BigDecimal calculateTotalUsageForItem(
            @Param("inventoryItemId") Integer inventoryItemId
    );
}