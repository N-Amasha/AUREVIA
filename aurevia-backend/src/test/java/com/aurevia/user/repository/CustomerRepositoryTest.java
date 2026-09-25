package com.aurevia.user.repository;

import com.aurevia.user.entity.Customer;
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
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void shouldReadAllExistingCustomers() {
        long customerCount = customerRepository.count();

        assertThat(customerCount).isEqualTo(5);
    }

    @Test
    void shouldLoadCustomerWithUserAccount() {
        Optional<Customer> result =
                customerRepository.findById(1);

        assertThat(result).isPresent();
        assertThat(result.get().getUserId()).isEqualTo(1);

        assertThat(
                result.get()
                        .getUserAccount()
                        .getEmail()
        ).isEqualTo("amaya.customer@aurevia.test");
    }

    @Test
    void shouldFindCustomerByEmailIgnoringCase() {
        Optional<Customer> result =
                customerRepository.findByUserAccountEmailIgnoreCase(
                        "AMAYA.CUSTOMER@AUREVIA.TEST"
                );

        assertThat(result).isPresent();
        assertThat(
                result.get()
                        .getUserAccount()
                        .getFirstName()
        ).isEqualTo("Amaya");
    }
}