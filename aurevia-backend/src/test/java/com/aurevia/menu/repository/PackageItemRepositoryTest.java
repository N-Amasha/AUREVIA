package com.aurevia.menu.repository;

import com.aurevia.menu.entity.PackageItem;
import com.aurevia.menu.entity.PackageItemId;
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
class PackageItemRepositoryTest {

    @Autowired
    private PackageItemRepository packageItemRepository;

    @Test
    void shouldReadAllPackageItems() {
        long count = packageItemRepository.count();

        assertThat(count).isEqualTo(10);
    }

    @Test
    void shouldReadPackageItemUsingCompositeId() {
        PackageItemId id = new PackageItemId(1, 1);

        Optional<PackageItem> result =
                packageItemRepository.findById(id);

        assertThat(result).isPresent();

        PackageItem packageItem = result.orElseThrow();

        assertThat(
                packageItem.getCateringPackage().getPackageId()
        ).isEqualTo(1);
        assertThat(packageItem.getMenuItem().getMenuItemId())
                .isEqualTo(1);
        assertThat(packageItem.getQuantity()).isEqualTo(50);
    }

    @Test
    void shouldFindItemsForCateringPackage() {
        List<PackageItem> items =
                packageItemRepository
                        .findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                                1
                        );

        assertThat(items).hasSize(2);

        assertThat(items)
                .extracting(
                        item -> item.getMenuItem().getMenuItemId()
                )
                .containsExactly(1, 8);

        assertThat(items)
                .extracting(PackageItem::getQuantity)
                .containsExactly(50, 100);
    }

    @Test
    void shouldFindPackagesContainingMenuItem() {
        List<PackageItem> items =
                packageItemRepository.findByMenuItemMenuItemId(3);

        assertThat(items)
                .extracting(
                        item ->
                                item.getCateringPackage().getPackageId()
                )
                .containsExactlyInAnyOrder(3, 5);
    }
}