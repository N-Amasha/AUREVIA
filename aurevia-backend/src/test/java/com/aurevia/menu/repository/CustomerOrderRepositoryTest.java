package com.aurevia.menu.repository;

import com.aurevia.menu.entity.CustomerOrder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class CustomerOrderRepositoryTest {

    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Test
    void shouldReadAllCustomerOrders() {
        long count = customerOrderRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadOrderWithCustomer() {
        Optional<CustomerOrder> result =
                customerOrderRepository.findById(1);

        assertThat(result).isPresent();

        CustomerOrder order = result.orElseThrow();

        assertThat(order.getCustomer().getUserId()).isEqualTo(1);
        assertThat(order.getOrderDate())
                .isEqualTo(LocalDateTime.of(
                        2026,
                        9,
                        18,
                        18,
                        0
                ));
        assertThat(order.getOrderType()).isEqualTo("DINE_IN");
        assertThat(order.getOrderStatus()).isEqualTo("COMPLETED");
        assertThat(order.getTotalAmount())
                .isEqualByComparingTo(new BigDecimal("6800.00"));
    }

    @Test
    void shouldFindCustomerOrderHistory() {
        List<CustomerOrder> orders =
                customerOrderRepository
                        .findByCustomerUserIdOrderByOrderDateDesc(3);

        assertThat(orders).hasSize(1);
        assertThat(orders.getFirst().getOrderId()).isEqualTo(3);
    }

    @Test
    void shouldFindCompletedDineInOrders() {
        List<CustomerOrder> orders =
                customerOrderRepository
                        .findByOrderTypeIgnoreCaseAndOrderStatusIgnoreCase(
                                "dine_in",
                                "completed"
                        );

        assertThat(orders)
                .extracting(CustomerOrder::getOrderId)
                .containsExactlyInAnyOrder(1, 2);
    }
}