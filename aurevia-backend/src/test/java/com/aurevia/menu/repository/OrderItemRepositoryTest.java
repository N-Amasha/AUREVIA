package com.aurevia.menu.repository;

import com.aurevia.menu.entity.OrderItem;
import com.aurevia.menu.entity.OrderItemId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class OrderItemRepositoryTest {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Test
    void shouldReadAllOrderItems() {
        long count = orderItemRepository.count();

        assertThat(count).isEqualTo(9);
    }

    @Test
    void shouldReadOrderItemUsingCompositeId() {
        OrderItemId id = new OrderItemId(1, 1);

        Optional<OrderItem> result =
                orderItemRepository.findById(id);

        assertThat(result).isPresent();

        OrderItem item = result.orElseThrow();

        assertThat(item.getCustomerOrder().getOrderId())
                .isEqualTo(1);
        assertThat(item.getMenuItem().getMenuItemId())
                .isEqualTo(1);
        assertThat(item.getQuantity()).isEqualTo(2);
        assertThat(item.getUnitPrice())
                .isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(item.getSubtotal())
                .isEqualByComparingTo(new BigDecimal("5000.00"));
    }

    @Test
    void shouldFindItemsForOrder() {
        List<OrderItem> items =
                orderItemRepository
                        .findByCustomerOrderOrderIdOrderByIdMenuItemIdAsc(
                                1
                        );

        assertThat(items).hasSize(2);

        assertThat(items)
                .extracting(
                        item -> item.getMenuItem().getMenuItemId()
                )
                .containsExactly(1, 6);
    }

    @Test
    void shouldCalculatePersistedOrderTotal() {
        BigDecimal total =
                orderItemRepository.calculateOrderTotal(1);

        assertThat(total)
                .isEqualByComparingTo(new BigDecimal("6800.00"));
    }
}