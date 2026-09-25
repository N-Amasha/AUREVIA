package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.RestaurantTable;
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
class RestaurantTableRepositoryTest {

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Test
    void shouldReadAllRestaurantTables() {
        long count = restaurantTableRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldFindTableByTableNumber() {
        Optional<RestaurantTable> result =
                restaurantTableRepository
                        .findByTableNumberIgnoreCase("t01");

        assertThat(result).isPresent();

        RestaurantTable table = result.orElseThrow();

        assertThat(table.getTableId()).isEqualTo(1);
        assertThat(table.getCapacity()).isEqualTo(2);
        assertThat(table.getLocation()).isEqualTo("Window Area");
        assertThat(table.getTableStatus()).isEqualTo("AVAILABLE");
    }

    @Test
    void shouldFindAvailableTablesWithRequiredCapacity() {
        List<RestaurantTable> tables =
                restaurantTableRepository
                        .findByTableStatusIgnoreCaseAndCapacityGreaterThanEqual(
                                "available",
                                6
                        );

        assertThat(tables)
                .extracting(RestaurantTable::getTableNumber)
                .containsExactlyInAnyOrder("T03", "T04");
    }
}