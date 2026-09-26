package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.InventoryUsage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class InventoryUsageRepositoryTest {

    @Autowired
    private InventoryUsageRepository inventoryUsageRepository;

    @Test
    void shouldLoadAllInventoryUsageRecords() {
        assertThat(inventoryUsageRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindUsageByInventoryItem() {
        List<InventoryUsage> records =
                inventoryUsageRepository
                        .findByInventoryItemInventoryItemIdOrderByUsageDateDesc(
                                1
                        );

        assertThat(records).hasSize(1);

        InventoryUsage usage = records.getFirst();

        assertThat(usage.getUsageId()).isEqualTo(1);
        assertThat(usage.getQuantityUsed())
                .isEqualByComparingTo(new BigDecimal("4.000"));
        assertThat(usage.getUsageReason())
                .isEqualTo("Rice used for customer order 1");
    }

    @Test
    void shouldFindUsageByCustomerOrder() {
        List<InventoryUsage> records =
                inventoryUsageRepository
                        .findByCustomerOrderOrderIdOrderByUsageDateDesc(2);

        assertThat(records)
                .extracting(InventoryUsage::getUsageId)
                .containsExactly(2);

        assertThat(records.getFirst()
                .getCustomerOrder()
                .getOrderId()).isEqualTo(2);
    }

    @Test
    void shouldFindUsageWithoutCustomerOrder() {
        List<InventoryUsage> records =
                inventoryUsageRepository
                        .findByCustomerOrderIsNullOrderByUsageDateDesc();

        assertThat(records)
                .extracting(InventoryUsage::getUsageId)
                .containsExactly(4);

        assertThat(records.getFirst().getCustomerOrder()).isNull();
    }

    @Test
    void shouldFindUsageWithinDateRange() {
        List<InventoryUsage> records =
                inventoryUsageRepository
                        .findByUsageDateBetweenOrderByUsageDateAsc(
                                LocalDateTime.of(2026, 9, 18, 0, 0),
                                LocalDateTime.of(2026, 9, 18, 23, 59, 59)
                        );

        assertThat(records)
                .extracting(InventoryUsage::getUsageId)
                .containsExactly(4, 1, 2, 3, 5);
    }

    @Test
    void shouldCalculateTotalUsageForInventoryItem() {
        BigDecimal totalUsage =
                inventoryUsageRepository
                        .calculateTotalUsageForItem(1);

        assertThat(totalUsage)
                .isEqualByComparingTo(new BigDecimal("4.000"));
    }
}