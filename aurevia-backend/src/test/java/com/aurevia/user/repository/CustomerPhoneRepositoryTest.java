package com.aurevia.user.repository;

import com.aurevia.user.entity.CustomerPhone;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class CustomerPhoneRepositoryTest {

    @Autowired
    private CustomerPhoneRepository customerPhoneRepository;

    @Test
    void shouldCountAllCustomerPhoneRecords() {
        assertThat(customerPhoneRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindPhonesByCustomerId() {
        List<CustomerPhone> phones =
                customerPhoneRepository
                        .findByCustomerUserIdOrderByIdPhoneNumberAsc(1);

        assertThat(phones).hasSize(1);
        assertThat(phones.getFirst().getCustomer().getUserId())
                .isEqualTo(1);
        assertThat(phones.getFirst().getPhoneNumber())
                .isEqualTo("0711111111");
    }

    @Test
    void shouldFindCustomerPhoneByPhoneNumber() {
        CustomerPhone customerPhone =
                customerPhoneRepository
                        .findByIdPhoneNumber("0753333333")
                        .orElseThrow();

        assertThat(customerPhone.getCustomer().getUserId())
                .isEqualTo(3);
        assertThat(customerPhone.getPhoneNumber())
                .isEqualTo("0753333333");
    }

    @Test
    void shouldCheckWhetherPhoneNumberExists() {
        assertThat(
                customerPhoneRepository
                        .existsByIdPhoneNumber("0775555555")
        ).isTrue();

        assertThat(
                customerPhoneRepository
                        .existsByIdPhoneNumber("0700000000")
        ).isFalse();
    }
}