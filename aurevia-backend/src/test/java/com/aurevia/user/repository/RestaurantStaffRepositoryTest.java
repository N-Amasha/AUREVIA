package com.aurevia.user.repository;

import com.aurevia.user.entity.RestaurantStaff;
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
class RestaurantStaffRepositoryTest {

    @Autowired
    private RestaurantStaffRepository restaurantStaffRepository;

    @Test
    void shouldReadAllRestaurantStaff() {
        long count = restaurantStaffRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadRestaurantStaffUsingSharedEmployeeId() {
        Optional<RestaurantStaff> result =
                restaurantStaffRepository.findById(31);

        assertThat(result).isPresent();

        RestaurantStaff staff = result.orElseThrow();

        assertThat(staff.getEmployeeId()).isEqualTo(31);
        assertThat(staff.getStaffType()).isEqualTo("Waiter");
        assertThat(staff.getEmployee().getEmployeeId())
                .isEqualTo(31);
    }

    @Test
    void shouldFindRestaurantStaffByType() {
        List<RestaurantStaff> staff =
                restaurantStaffRepository
                        .findByStaffTypeContainingIgnoreCase("wait");

        assertThat(staff).hasSize(2);
        assertThat(staff)
                .extracting(RestaurantStaff::getEmployeeId)
                .containsExactlyInAnyOrder(31, 32);
    }
}