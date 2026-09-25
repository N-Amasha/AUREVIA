package com.aurevia.user.repository;

import com.aurevia.user.entity.UserAccount;
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
class UserAccountRepositoryTest {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void shouldReadAllExistingUserAccounts() {
        long userCount = userAccountRepository.count();

        assertThat(userCount).isEqualTo(45);
    }

    @Test
    void shouldFindExistingUserByEmailIgnoringCase() {
        Optional<UserAccount> result =
                userAccountRepository.findByEmailIgnoreCase(
                        "AMAYA.CUSTOMER@AUREVIA.TEST"
                );

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Amaya");
        assertThat(result.get().getLastName()).isEqualTo("Perera");
    }
}