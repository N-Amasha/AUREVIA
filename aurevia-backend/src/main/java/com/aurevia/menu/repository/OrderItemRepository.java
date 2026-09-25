package com.aurevia.menu.repository;

import com.aurevia.menu.entity.OrderItem;
import com.aurevia.menu.entity.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, OrderItemId> {

    List<OrderItem>
    findByCustomerOrderOrderIdOrderByIdMenuItemIdAsc(
            Integer orderId
    );

    List<OrderItem> findByMenuItemMenuItemId(Integer menuItemId);

    @Query("""
            SELECT COALESCE(SUM(oi.subtotal), 0)
            FROM OrderItem oi
            WHERE oi.customerOrder.orderId = :orderId
            """)
    BigDecimal calculateOrderTotal(
            @Param("orderId") Integer orderId
    );
}