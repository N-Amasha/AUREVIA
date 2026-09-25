package com.aurevia.event.repository;

import com.aurevia.event.entity.Vendor;
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
class VendorRepositoryTest {

    @Autowired
    private VendorRepository vendorRepository;

    @Test
    void shouldReadAllVendors() {
        long count = vendorRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldFindVendorByEmail() {
        Optional<Vendor> result =
                vendorRepository.findByEmailIgnoreCase(
                        "CONTACT@ELEGANTFLORAL.TEST"
                );

        assertThat(result).isPresent();

        Vendor vendor = result.orElseThrow();

        assertThat(vendor.getVendorId()).isEqualTo(1);
        assertThat(vendor.getVendorName())
                .isEqualTo("Elegant Floral Designs");
        assertThat(vendor.getVendorType()).isEqualTo("FLORAL");
        assertThat(vendor.getContactNumber())
                .isEqualTo("0711001001");
        assertThat(vendor.getCity()).isEqualTo("Colombo");
    }

    @Test
    void shouldFindVendorByType() {
        List<Vendor> vendors =
                vendorRepository
                        .findByVendorTypeIgnoreCase("photography");

        assertThat(vendors).hasSize(1);
        assertThat(vendors.getFirst().getVendorId()).isEqualTo(3);
    }

    @Test
    void shouldFindVendorsByCity() {
        List<Vendor> vendors =
                vendorRepository.findByCityIgnoreCase("colombo");

        assertThat(vendors)
                .extracting(Vendor::getVendorId)
                .containsExactlyInAnyOrder(1, 2, 5);
    }
}