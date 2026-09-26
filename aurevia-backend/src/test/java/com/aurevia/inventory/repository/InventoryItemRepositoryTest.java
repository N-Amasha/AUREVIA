package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.InventoryItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class InventoryItemRepositoryTest {

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Test
    void shouldLoadAllInventoryItems() {
        assertThat(inventoryItemRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindInventoryItemByNameIgnoringCase() {
        Optional<InventoryItem> result =
                inventoryItemRepository.findByItemNameIgnoreCase(
                        "basmati rice"
                );

        assertThat(result).isPresent();

        InventoryItem item = result.get();

        assertThat(item.getInventoryItemId()).isEqualTo(1);
        assertThat(item.getSupplier().getSupplierId()).isEqualTo(1);
        assertThat(item.getCurrentQuantity())
                .isEqualByComparingTo(new BigDecimal("150.000"));
        assertThat(item.getUnitCost())
                .isEqualByComparingTo(new BigDecimal("450.00"));
    }

    @Test
    void shouldFindItemsBySupplier() {
        List<InventoryItem> items =
                inventoryItemRepository
                        .findBySupplierSupplierIdOrderByItemNameAsc(2);

        assertThat(items).hasSize(1);
        assertThat(items.getFirst().getInventoryItemId())
                .isEqualTo(2);
        assertThat(items.getFirst().getItemName())
                .isEqualTo("Fresh Chicken");
    }

    @Test
    void shouldFindItemsByCategoryIgnoringCase() {
        List<InventoryItem> items =
                inventoryItemRepository
                        .findByItemCategoryIgnoreCaseOrderByItemNameAsc(
                                "dairy"
                        );

        assertThat(items)
                .extracting(InventoryItem::getInventoryItemId)
                .containsExactly(4);
    }

    @Test
    void shouldFindItemsExpiringBeforeDate() {
        List<InventoryItem> items =
                inventoryItemRepository
                        .findByExpiryDateBeforeOrderByExpiryDateAsc(
                                LocalDate.of(2026, 10, 10)
                        );

        assertThat(items)
                .extracting(InventoryItem::getInventoryItemId)
                .containsExactly(4, 3);
    }

    @Test
    void shouldFindItemsExpiringWithinDateRange() {
        List<InventoryItem> items =
                inventoryItemRepository.findItemsExpiringBetween(
                        LocalDate.of(2026, 10, 1),
                        LocalDate.of(2026, 10, 15)
                );

        assertThat(items)
                .extracting(InventoryItem::getInventoryItemId)
                .containsExactly(4, 3, 2);
    }

    @Test
    void shouldReturnNoLowStockItemsForCurrentSampleData() {
        List<InventoryItem> items =
                inventoryItemRepository
                        .findItemsAtOrBelowReorderLevel();

        assertThat(items).isEmpty();
    }
}