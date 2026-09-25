package com.aurevia.user.repository;

import com.aurevia.user.entity.Cashier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class CashierRepositoryTest {

    @Autowired
    private CashierRepository cashierRepository;

    @Test
    void shouldReadAllCashiers() {
        long count = cashierRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadCashierUsingSharedEmployeeId() {
        Optional<Cashier> result = cashierRepository.findById(16);

        assertThat(result).isPresent();

        Cashier cashier = result.orElseThrow();

        assertThat(cashier.getEmployeeId()).isEqualTo(16);
        assertThat(cashier.getCounterNumber()).isEqualTo("C01");
        assertThat(cashier.getEmployee().getEmployeeId()).isEqualTo(16);
    }

    @Test
    void shouldFindCashierByCounterNumber() {
        Optional<Cashier> result =
                cashierRepository.findByCounterNumberIgnoreCase("c01");

        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getEmployeeId()).isEqualTo(16);
    }
}