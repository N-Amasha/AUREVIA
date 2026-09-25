package com.aurevia.menu.repository;

import com.aurevia.menu.entity.Menu;
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
class MenuRepositoryTest {

    @Autowired
    private MenuRepository menuRepository;

    @Test
    void shouldReadAllMenus() {
        long count = menuRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldFindMenuByName() {
        Optional<Menu> result =
                menuRepository
                        .findByMenuNameIgnoreCase("fine dining menu");

        assertThat(result).isPresent();

        Menu menu = result.orElseThrow();

        assertThat(menu.getMenuId()).isEqualTo(1);
        assertThat(menu.getMenuType()).isEqualTo("DINE_IN");
        assertThat(menu.getStatus()).isEqualTo("ACTIVE");
        assertThat(menu.getDescription())
                .isEqualTo("Premium à la carte dining menu");
    }

    @Test
    void shouldFindAllActiveMenus() {
        List<Menu> menus =
                menuRepository.findByStatusIgnoreCase("active");

        assertThat(menus).hasSize(5);
    }

    @Test
    void shouldFindActiveMenuByType() {
        List<Menu> menus =
                menuRepository
                        .findByMenuTypeIgnoreCaseAndStatusIgnoreCase(
                                "catering",
                                "active"
                        );

        assertThat(menus).hasSize(1);
        assertThat(menus.getFirst().getMenuId()).isEqualTo(4);
        assertThat(menus.getFirst().getMenuName())
                .isEqualTo("Event Catering Menu");
    }
}