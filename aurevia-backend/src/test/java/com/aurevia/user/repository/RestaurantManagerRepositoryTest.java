package com.aurevia.user.repository;

import com.aurevia.user.entity.RestaurantManager;
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
class RestaurantManagerRepositoryTest {

    @Autowired
    private RestaurantManagerRepository restaurantManagerRepository;

    @Test
    void shouldReadAllRestaurantManagers() {
        long count = restaurantManagerRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadRestaurantManagerUsingSharedEmployeeId() {
        Optional<RestaurantManager> result =
                restaurantManagerRepository.findById(1);

        assertThat(result).isPresent();

        RestaurantManager manager = result.orElseThrow();

        assertThat(manager.getEmployeeId()).isEqualTo(1);
        assertThat(manager.getManagementArea())
                .isEqualTo("Main Restaurant");
        assertThat(manager.getEmployee().getEmployeeId()).isEqualTo(1);
    }

    @Test
    void shouldFindManagerByManagementArea() {
        List<RestaurantManager> managers =
                restaurantManagerRepository
                        .findByManagementAreaIgnoreCase("main restaurant");

        assertThat(managers).hasSize(1);
        assertThat(managers.getFirst().getEmployeeId()).isEqualTo(1);
    }
}