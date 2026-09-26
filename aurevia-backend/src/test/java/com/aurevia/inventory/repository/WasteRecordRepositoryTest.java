package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.WasteRecord;
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
class WasteRecordRepositoryTest {

    @Autowired
    private WasteRecordRepository wasteRecordRepository;

    @Test
    void shouldLoadAllWasteRecords() {
        assertThat(wasteRecordRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindWasteRecordsByInventoryItem() {
        List<WasteRecord> records =
                wasteRecordRepository
                        .findByInventoryItemInventoryItemIdOrderByWasteDateDesc(
                                2
                        );

        assertThat(records).hasSize(1);

        WasteRecord waste = records.getFirst();

        assertThat(waste.getWasteId()).isEqualTo(2);
        assertThat(waste.getQuantity())
                .isEqualByComparingTo(new BigDecimal("2.000"));
        assertThat(waste.getEstimatedCost())
                .isEqualByComparingTo(new BigDecimal("3600.00"));
    }

    @Test
    void shouldFindWasteRecordsByInventoryManager() {
        List<WasteRecord> records =
                wasteRecordRepository
                        .findByRecordedByManagerEmployeeIdOrderByWasteDateDesc(
                                21
                        );

        assertThat(records)
                .extracting(WasteRecord::getWasteId)
                .containsExactly(1);

        assertThat(records.getFirst()
                .getRecordedByManager()).isNotNull();
    }

    @Test
    void shouldFindWasteRecordsWithinDateRange() {
        List<WasteRecord> records =
                wasteRecordRepository
                        .findByWasteDateBetweenOrderByWasteDateAsc(
                                LocalDateTime.of(2026, 9, 19, 0, 0),
                                LocalDateTime.of(2026, 9, 19, 23, 59, 59)
                        );

        assertThat(records)
                .extracting(WasteRecord::getWasteId)
                .containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    void shouldCalculateTotalEstimatedWasteCost() {
        BigDecimal totalCost =
                wasteRecordRepository
                        .calculateTotalEstimatedWasteCost();

        assertThat(totalCost)
                .isEqualByComparingTo(new BigDecimal("11550.00"));
    }

    @Test
    void shouldCalculateEstimatedWasteCostForItem() {
        BigDecimal itemWasteCost =
                wasteRecordRepository
                        .calculateEstimatedWasteCostForItem(1);

        assertThat(itemWasteCost)
                .isEqualByComparingTo(new BigDecimal("2250.00"));
    }

    @Test
    void shouldCalculateTotalWasteQuantityForItem() {
        BigDecimal totalQuantity =
                wasteRecordRepository
                        .calculateTotalWasteQuantityForItem(5);

        assertThat(totalQuantity)
                .isEqualByComparingTo(new BigDecimal("1.500"));
    }
}