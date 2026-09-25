package com.aurevia.user.repository;

import com.aurevia.user.entity.InventoryManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class InventoryManagerRepositoryTest {

    @Autowired
    private InventoryManagerRepository inventoryManagerRepository;

    @Test
    void shouldReadAllInventoryManagers() {
        long count = inventoryManagerRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadInventoryManagerUsingSharedEmployeeId() {
        Optional<InventoryManager> result =
                inventoryManagerRepository.findById(21);

        assertThat(result).isPresent();

        InventoryManager manager = result.orElseThrow();

        assertThat(manager.getEmployeeId()).isEqualTo(21);
        assertThat(manager.getWarehouseArea())
                .isEqualTo("Dry Storage");
        assertThat(manager.getEmployee().getEmployeeId())
                .isEqualTo(21);
    }

    @Test
    void shouldFindManagerByWarehouseArea() {
        List<InventoryManager> managers =
                inventoryManagerRepository
                        .findByWarehouseAreaContainingIgnoreCase(
                                "dry"
                        );

        assertThat(managers).hasSize(1);
        assertThat(managers.getFirst().getEmployeeId())
                .isEqualTo(21);
    }
}