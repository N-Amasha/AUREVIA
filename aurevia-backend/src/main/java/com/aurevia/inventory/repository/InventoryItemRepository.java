package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InventoryItemRepository
        extends JpaRepository<InventoryItem, Integer> {

    Optional<InventoryItem> findByItemNameIgnoreCase(
            String itemName
    );

    List<InventoryItem> findBySupplierSupplierIdOrderByItemNameAsc(
            Integer supplierId
    );

    List<InventoryItem> findByItemCategoryIgnoreCaseOrderByItemNameAsc(
            String itemCategory
    );

    List<InventoryItem> findByExpiryDateBeforeOrderByExpiryDateAsc(
            LocalDate expiryDate
    );

    @Query("""
            SELECT item
            FROM InventoryItem item
            WHERE item.currentQuantity <= item.reorderLevel
            ORDER BY item.currentQuantity ASC
            """)
    List<InventoryItem> findItemsAtOrBelowReorderLevel();

    @Query("""
            SELECT item
            FROM InventoryItem item
            WHERE item.expiryDate IS NOT NULL
              AND item.expiryDate BETWEEN :startDate AND :endDate
            ORDER BY item.expiryDate ASC
            """)
    List<InventoryItem> findItemsExpiringBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}