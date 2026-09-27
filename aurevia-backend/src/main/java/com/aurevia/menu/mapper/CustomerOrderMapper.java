package com.aurevia.menu.mapper;

import com.aurevia.menu.dto.CustomerOrderResponse;
import com.aurevia.menu.dto.OrderItemResponse;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.entity.OrderItem;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerOrderMapper {

    public CustomerOrderResponse toResponse(
            CustomerOrder customerOrder,
            List<OrderItem> orderItems
    ) {
        UserAccount userAccount =
                customerOrder
                        .getCustomer()
                        .getUserAccount();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        List<OrderItemResponse> items = orderItems.stream()
                .map(this::toItemResponse)
                .toList();

        return new CustomerOrderResponse(
                customerOrder.getOrderId(),
                customerOrder.getCustomer().getUserId(),
                customerName,
                customerOrder.getOrderDate(),
                customerOrder.getOrderType(),
                customerOrder.getOrderStatus(),
                customerOrder.getTotalAmount(),
                items
        );
    }

    public OrderItemResponse toItemResponse(
            OrderItem orderItem
    ) {
        MenuItem menuItem = orderItem.getMenuItem();

        return new OrderItemResponse(
                menuItem.getMenuItemId(),
                menuItem.getItemName(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getSubtotal()
        );
    }
}