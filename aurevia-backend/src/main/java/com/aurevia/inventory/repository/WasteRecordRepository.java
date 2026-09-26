package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.WasteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface WasteRecordRepository
        extends JpaRepository<WasteRecord, Integer> {

    List<WasteRecord>
    findByInventoryItemInventoryItemIdOrderByWasteDateDesc(
            Integer inventoryItemId
    );

    List<WasteRecord>
    findByRecordedByManagerEmployeeIdOrderByWasteDateDesc(
            Integer managerId
    );

    List<WasteRecord>
    findByWasteDateBetweenOrderByWasteDateAsc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    @Query("""
            SELECT COALESCE(SUM(waste.estimatedCost), 0)
            FROM WasteRecord waste
            """)
    BigDecimal calculateTotalEstimatedWasteCost();

    @Query("""
            SELECT COALESCE(SUM(waste.estimatedCost), 0)
            FROM WasteRecord waste
            WHERE waste.inventoryItem.inventoryItemId = :inventoryItemId
            """)
    BigDecimal calculateEstimatedWasteCostForItem(
            @Param("inventoryItemId") Integer inventoryItemId
    );

    @Query("""
            SELECT COALESCE(SUM(waste.quantity), 0)
            FROM WasteRecord waste
            WHERE waste.inventoryItem.inventoryItemId = :inventoryItemId
            """)
    BigDecimal calculateTotalWasteQuantityForItem(
            @Param("inventoryItemId") Integer inventoryItemId
    );
}