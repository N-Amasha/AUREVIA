package com.aurevia.user.repository;

import com.aurevia.user.entity.Administrator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
class AdministratorRepositoryTest {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Test
    void shouldReadAllExistingAdministrators() {
        long administratorCount =
                administratorRepository.count();

        assertThat(administratorCount).isEqualTo(5);
    }

    @Test
    void shouldLoadAdministratorWithUserAccount() {
        Optional<Administrator> result =
                administratorRepository.findById(6);

        assertThat(result).isPresent();
        assertThat(result.get().getUserId()).isEqualTo(6);
        assertThat(
                result.get()
                        .getUserAccount()
                        .getUserId()
        ).isEqualTo(6);
    }
}