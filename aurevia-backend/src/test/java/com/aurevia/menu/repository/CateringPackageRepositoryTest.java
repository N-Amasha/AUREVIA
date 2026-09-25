package com.aurevia.menu.repository;

import com.aurevia.menu.entity.CateringPackage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class CateringPackageRepositoryTest {

    @Autowired
    private CateringPackageRepository cateringPackageRepository;

    @Test
    void shouldReadAllCateringPackages() {
        long count = cateringPackageRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldFindPackageByName() {
        Optional<CateringPackage> result =
                cateringPackageRepository
                        .findByPackageNameIgnoreCase(
                                "silver wedding package"
                        );

        assertThat(result).isPresent();

        CateringPackage cateringPackage = result.orElseThrow();

        assertThat(cateringPackage.getPackageId()).isEqualTo(1);
        assertThat(cateringPackage.getPackageType())
                .isEqualTo("WEDDING");
        assertThat(cateringPackage.getBasePrice())
                .isEqualByComparingTo(new BigDecimal("150000.00"));
        assertThat(cateringPackage.getMinimumGuests()).isEqualTo(50);
        assertThat(cateringPackage.getMaximumGuests()).isEqualTo(150);
    }

    @Test
    void shouldFindPackagesByType() {
        List<CateringPackage> packages =
                cateringPackageRepository
                        .findByPackageTypeIgnoreCase("wedding");

        assertThat(packages)
                .extracting(CateringPackage::getPackageId)
                .containsExactlyInAnyOrder(1, 2);
    }

    @Test
    void shouldFindPackagesSupportingGuestCount() {
        List<CateringPackage> packages =
                cateringPackageRepository
                        .findPackagesSupportingGuestCount(120);

        assertThat(packages)
                .extracting(CateringPackage::getPackageId)
                .containsExactly(5, 1, 2);
    }
}