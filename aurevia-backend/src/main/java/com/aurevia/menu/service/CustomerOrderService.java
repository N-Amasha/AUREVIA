package com.aurevia.menu.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CustomerOrderCreateRequest;
import com.aurevia.menu.dto.CustomerOrderResponse;
import com.aurevia.menu.dto.OrderItemCreateRequest;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.entity.OrderItem;
import com.aurevia.menu.mapper.CustomerOrderMapper;
import com.aurevia.menu.repository.CustomerOrderRepository;
import com.aurevia.menu.repository.MenuItemRepository;
import com.aurevia.menu.repository.OrderItemRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class CustomerOrderService {

    private static final String AVAILABLE = "AVAILABLE";
    private static final String PENDING = "PENDING";

    private static final Set<String> ALLOWED_ORDER_TYPES =
            Set.of("DINE_IN", "TAKEAWAY");

    private final CustomerOrderRepository
            customerOrderRepository;

    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderMapper customerOrderMapper;

    public CustomerOrderService(
            CustomerOrderRepository customerOrderRepository,
            OrderItemRepository orderItemRepository,
            MenuItemRepository menuItemRepository,
            CustomerRepository customerRepository,
            CustomerOrderMapper customerOrderMapper
    ) {
        this.customerOrderRepository =
                customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.customerRepository = customerRepository;
        this.customerOrderMapper = customerOrderMapper;
    }

    @Transactional
    public CustomerOrderResponse createOrder(
            CustomerOrderCreateRequest request
    ) {
        Customer customer = findCustomer(request.customerId());

        String orderType = normalizeOrderType(
                request.orderType()
        );

        ensureNoDuplicateItems(request.items());

        List<ValidatedOrderItem> validatedItems =
                validateItems(request.items());

        BigDecimal totalAmount = validatedItems.stream()
                .map(ValidatedOrderItem::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CustomerOrder customerOrder =
                new CustomerOrder(
                        customer,
                        orderType,
                        PENDING,
                        totalAmount
                );

        CustomerOrder savedOrder =
                customerOrderRepository.save(customerOrder);

        List<OrderItem> orderItems = validatedItems.stream()
                .map(validatedItem ->
                        new OrderItem(
                                savedOrder,
                                validatedItem.menuItem(),
                                validatedItem.quantity(),
                                validatedItem.unitPrice(),
                                validatedItem.subtotal()
                        )
                )
                .toList();

        List<OrderItem> savedItems =
                orderItemRepository.saveAll(orderItems);

        return customerOrderMapper.toResponse(
                savedOrder,
                savedItems
        );
    }

    public CustomerOrderResponse getOrderById(
            Integer orderId
    ) {
        CustomerOrder customerOrder = findOrder(orderId);
        return mapOrder(customerOrder);
    }

    public List<CustomerOrderResponse> getOrdersByCustomer(
            Integer customerId
    ) {
        findCustomer(customerId);

        return customerOrderRepository
                .findByCustomerUserIdOrderByOrderDateDesc(
                        customerId
                )
                .stream()
                .map(this::mapOrder)
                .toList();
    }

    public List<CustomerOrderResponse> getOrdersByStatus(
            String orderStatus
    ) {
        if (orderStatus == null || orderStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Order status is required."
            );
        }

        return customerOrderRepository
                .findByOrderStatusIgnoreCase(
                        orderStatus.trim()
                )
                .stream()
                .map(this::mapOrder)
                .toList();
    }

    private List<ValidatedOrderItem> validateItems(
            List<OrderItemCreateRequest> requests
    ) {
        List<ValidatedOrderItem> validatedItems =
                new ArrayList<>();

        for (OrderItemCreateRequest request : requests) {
            MenuItem menuItem =
                    menuItemRepository
                            .findById(request.menuItemId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Menu item",
                                            "menuItemId",
                                            request.menuItemId()
                                    )
                            );

            if (!AVAILABLE.equalsIgnoreCase(
                    menuItem.getAvailabilityStatus()
            )) {
                throw new BusinessRuleException(
                        "Menu item '" +
                        menuItem.getItemName() +
                        "' is not currently available."
                );
            }

            BigDecimal unitPrice = menuItem.getPrice();

            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(request.quantity())
            );

            validatedItems.add(
                    new ValidatedOrderItem(
                            menuItem,
                            request.quantity(),
                            unitPrice,
                            subtotal
                    )
            );
        }

        return validatedItems;
    }

    private void ensureNoDuplicateItems(
            List<OrderItemCreateRequest> requests
    ) {
        Set<Integer> menuItemIds = new HashSet<>();

        for (OrderItemCreateRequest request : requests) {
            if (!menuItemIds.add(request.menuItemId())) {
                throw new BusinessRuleException(
                        "Duplicate menu items are not allowed " +
                        "in the same order."
                );
            }
        }
    }

    private String normalizeOrderType(String orderType) {
        String normalized = orderType.trim()
                .toUpperCase(Locale.ROOT);

        if (!ALLOWED_ORDER_TYPES.contains(normalized)) {
            throw new BusinessRuleException(
                    "Order type must be DINE_IN or TAKEAWAY."
            );
        }

        return normalized;
    }

    private Customer findCustomer(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                customerId
                        )
                );
    }

    private CustomerOrder findOrder(Integer orderId) {
        return customerOrderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer order",
                                "orderId",
                                orderId
                        )
                );
    }

    private CustomerOrderResponse mapOrder(
            CustomerOrder customerOrder
    ) {
        List<OrderItem> orderItems =
                orderItemRepository
                        .findByCustomerOrderOrderIdOrderByIdMenuItemIdAsc(
                                customerOrder.getOrderId()
                        );

        return customerOrderMapper.toResponse(
                customerOrder,
                orderItems
        );
    }

    private record ValidatedOrderItem(
            MenuItem menuItem,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal subtotal
    ) {
    }
}