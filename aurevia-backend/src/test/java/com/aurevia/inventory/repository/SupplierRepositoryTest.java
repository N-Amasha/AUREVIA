package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.Supplier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

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
class SupplierRepositoryTest {

    @Autowired
    private SupplierRepository supplierRepository;

    @Test
    void shouldLoadAllSuppliers() {
        assertThat(supplierRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindSupplierByEmailIgnoringCase() {
        Optional<Supplier> result =
                supplierRepository.findByEmailIgnoreCase(
                        "SALES@LANKAFRESH.TEST"
                );

        assertThat(result).isPresent();
        assertThat(result.get().getSupplierId()).isEqualTo(1);
        assertThat(result.get().getSupplierName())
                .isEqualTo("Lanka Fresh Foods");
    }

    @Test
    void shouldFindSupplierByNameIgnoringCase() {
        Optional<Supplier> result =
                supplierRepository.findBySupplierNameIgnoreCase(
                        "central meat suppliers"
                );

        assertThat(result).isPresent();
        assertThat(result.get().getSupplierId()).isEqualTo(2);
        assertThat(result.get().getCity()).isEqualTo("Kandy");
    }

    @Test
    void shouldFindSuppliersInColomboOrderedByName() {
        List<Supplier> suppliers =
                supplierRepository
                        .findByCityIgnoreCaseOrderBySupplierNameAsc(
                                "colombo"
                        );

        assertThat(suppliers)
                .extracting(Supplier::getSupplierId)
                .containsExactly(5, 1);
    }

    @Test
    void shouldFindSuppliersInCentralProvince() {
        List<Supplier> suppliers =
                supplierRepository
                        .findByProvinceIgnoreCaseOrderBySupplierNameAsc(
                                "central"
                        );

        assertThat(suppliers)
                .extracting(Supplier::getSupplierId)
                .containsExactly(2, 4);
    }
}