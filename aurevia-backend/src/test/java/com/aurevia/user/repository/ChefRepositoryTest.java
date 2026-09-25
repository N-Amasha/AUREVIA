package com.aurevia.user.repository;

import com.aurevia.user.entity.Chef;
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
class ChefRepositoryTest {

    @Autowired
    private ChefRepository chefRepository;

    @Test
    void shouldReadAllChefs() {
        long count = chefRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadChefUsingSharedEmployeeId() {
        Optional<Chef> result = chefRepository.findById(11);

        assertThat(result).isPresent();

        Chef chef = result.orElseThrow();

        assertThat(chef.getEmployeeId()).isEqualTo(11);
        assertThat(chef.getSpecialization())
                .isEqualTo("Sri Lankan Cuisine");
        assertThat(chef.getEmployee().getEmployeeId()).isEqualTo(11);
    }

    @Test
    void shouldFindChefByPartialSpecialization() {
        List<Chef> chefs =
                chefRepository
                        .findBySpecializationContainingIgnoreCase(
                                "sri lankan"
                        );

        assertThat(chefs).hasSize(1);
        assertThat(chefs.getFirst().getEmployeeId()).isEqualTo(11);
    }
}