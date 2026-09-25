package com.aurevia.menu.repository;

import com.aurevia.menu.entity.MenuItem;
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
class MenuItemRepositoryTest {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Test
    void shouldReadAllMenuItems() {
        long count = menuItemRepository.count();

        assertThat(count).isEqualTo(10);
    }

    @Test
    void shouldReadMenuItemWithParentMenu() {
        Optional<MenuItem> result =
                menuItemRepository.findById(1);

        assertThat(result).isPresent();

        MenuItem item = result.orElseThrow();

        assertThat(item.getMenu().getMenuId()).isEqualTo(1);
        assertThat(item.getItemName())
                .isEqualTo("Grilled Chicken Supreme");
        assertThat(item.getCategory()).isEqualTo("MAIN_COURSE");
        assertThat(item.getPrice())
                .isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(item.getAvailabilityStatus())
                .isEqualTo("AVAILABLE");
    }

    @Test
    void shouldFindItemsForMenu() {
        List<MenuItem> items =
                menuItemRepository
                        .findByMenuMenuIdOrderByMenuItemIdAsc(5);

        assertThat(items)
                .extracting(MenuItem::getItemName)
                .containsExactly(
                        "Fresh Lime Juice",
                        "Ceylon Tea Selection"
                );
    }

    @Test
    void shouldFindAvailableItemsByCategory() {
        List<MenuItem> items =
                menuItemRepository
                        .findByCategoryIgnoreCaseAndAvailabilityStatusIgnoreCase(
                                "dessert",
                                "available"
                        );

        assertThat(items).hasSize(1);
        assertThat(items.getFirst().getMenuItemId()).isEqualTo(6);
        assertThat(items.getFirst().getItemName())
                .isEqualTo("Classic Tiramisu");
    }
}