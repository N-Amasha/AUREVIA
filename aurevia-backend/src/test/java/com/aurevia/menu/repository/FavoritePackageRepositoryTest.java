package com.aurevia.menu.repository;

import com.aurevia.menu.entity.FavoritePackage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class FavoritePackageRepositoryTest {

    @Autowired
    private FavoritePackageRepository favoritePackageRepository;

    @Test
    void shouldReadAllFavoritePackages() {
        long count = favoritePackageRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadFavoriteWithCustomerAndPackage() {
        Optional<FavoritePackage> result =
                favoritePackageRepository.findById(1);

        assertThat(result).isPresent();

        FavoritePackage favorite = result.orElseThrow();

        assertThat(favorite.getCustomer().getUserId()).isEqualTo(1);
        assertThat(
                favorite.getCateringPackage().getPackageId()
        ).isEqualTo(2);
        assertThat(favorite.getSavedDate())
                .isEqualTo(LocalDateTime.of(
                        2026,
                        9,
                        15,
                        10,
                        0
                ));
        assertThat(favorite.getNotes())
                .isEqualTo("Preferred wedding package");
    }

    @Test
    void shouldFindCustomerFavoritePackages() {
        List<FavoritePackage> favorites =
                favoritePackageRepository
                        .findByCustomerUserIdOrderBySavedDateDesc(3);

        assertThat(favorites).hasSize(1);
        assertThat(
                favorites.getFirst()
                        .getCateringPackage()
                        .getPackageId()
        ).isEqualTo(5);
    }

    @Test
    void shouldIdentifyExistingCustomerFavorite() {
        boolean exists =
                favoritePackageRepository
                        .existsByCustomerUserIdAndCateringPackagePackageId(
                                1,
                                2
                        );

        boolean doesNotExist =
                favoritePackageRepository
                        .existsByCustomerUserIdAndCateringPackagePackageId(
                                1,
                                3
                        );

        assertThat(exists).isTrue();
        assertThat(doesNotExist).isFalse();
    }
}