package com.aurevia.menu.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CustomerOrderCreateRequest;
import com.aurevia.menu.dto.CustomerOrderResponse;
import com.aurevia.menu.dto.OrderItemCreateRequest;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.mapper.CustomerOrderMapper;
import com.aurevia.menu.repository.CustomerOrderRepository;
import com.aurevia.menu.repository.MenuItemRepository;
import com.aurevia.menu.repository.OrderItemRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerOrderServiceTest {

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerOrderMapper customerOrderMapper;

    @InjectMocks
    private CustomerOrderService customerOrderService;

    @Test
    void shouldCreateOrderAndCalculateTotal() {
        Customer customer = mock(Customer.class);
        MenuItem firstItem = mock(MenuItem.class);
        MenuItem secondItem = mock(MenuItem.class);
        CustomerOrderResponse expected = response();

        CustomerOrderCreateRequest request =
                new CustomerOrderCreateRequest(
                        1,
                        " dine_in ",
                        List.of(
                                new OrderItemCreateRequest(1, 2),
                                new OrderItemCreateRequest(6, 1)
                        )
                );

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(menuItemRepository.findById(1))
                .thenReturn(Optional.of(firstItem));
        when(firstItem.getAvailabilityStatus())
                .thenReturn("AVAILABLE");
        when(firstItem.getPrice())
                .thenReturn(new BigDecimal("2500.00"));
        when(firstItem.getMenuItemId()).thenReturn(1);

        when(menuItemRepository.findById(6))
                .thenReturn(Optional.of(secondItem));
        when(secondItem.getAvailabilityStatus())
                .thenReturn("AVAILABLE");
        when(secondItem.getPrice())
                .thenReturn(new BigDecimal("1800.00"));
        when(secondItem.getMenuItemId()).thenReturn(6);

        when(customerOrderRepository.save(
                any(CustomerOrder.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );

        when(orderItemRepository.saveAll(anyList()))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(customerOrderMapper.toResponse(
                any(CustomerOrder.class),
                anyList()
        )).thenReturn(expected);

        CustomerOrderResponse actual =
                customerOrderService.createOrder(request);

        assertEquals(expected, actual);

        ArgumentCaptor<CustomerOrder> captor =
                ArgumentCaptor.forClass(CustomerOrder.class);

        verify(customerOrderRepository).save(
                captor.capture()
        );

        assertEquals(
                new BigDecimal("6800.00"),
                captor.getValue().getTotalAmount()
        );
        assertEquals(
                "DINE_IN",
                captor.getValue().getOrderType()
        );
        assertEquals(
                "PENDING",
                captor.getValue().getOrderStatus()
        );
    }

    @Test
    void shouldRejectDuplicateMenuItems() {
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        CustomerOrderCreateRequest request =
                new CustomerOrderCreateRequest(
                        1,
                        "DINE_IN",
                        List.of(
                                new OrderItemCreateRequest(1, 1),
                                new OrderItemCreateRequest(1, 2)
                        )
                );

        assertThrows(
                BusinessRuleException.class,
                () -> customerOrderService
                        .createOrder(request)
        );

        verify(
                menuItemRepository,
                never()
        ).findById(1);
    }

    @Test
    void shouldRejectUnsupportedOrderType() {
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        CustomerOrderCreateRequest request =
                new CustomerOrderCreateRequest(
                        1,
                        "DELIVERY",
                        List.of(
                                new OrderItemCreateRequest(1, 1)
                        )
                );

        assertThrows(
                BusinessRuleException.class,
                () -> customerOrderService
                        .createOrder(request)
        );

        verify(
                customerOrderRepository,
                never()
        ).save(any(CustomerOrder.class));
    }

    @Test
    void shouldRejectUnavailableMenuItem() {
        Customer customer = mock(Customer.class);
        MenuItem menuItem = mock(MenuItem.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(menuItemRepository.findById(1))
                .thenReturn(Optional.of(menuItem));

        when(menuItem.getAvailabilityStatus())
                .thenReturn("UNAVAILABLE");

        when(menuItem.getItemName())
                .thenReturn("Grilled Chicken Supreme");

        CustomerOrderCreateRequest request =
                new CustomerOrderCreateRequest(
                        1,
                        "TAKEAWAY",
                        List.of(
                                new OrderItemCreateRequest(1, 1)
                        )
                );

        assertThrows(
                BusinessRuleException.class,
                () -> customerOrderService
                        .createOrder(request)
        );

        verify(
                customerOrderRepository,
                never()
        ).save(any(CustomerOrder.class));
    }

    @Test
    void shouldRejectUnknownOrder() {
        when(customerOrderRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> customerOrderService.getOrderById(99)
        );
    }

    @Test
    void shouldReturnOrdersByCustomer() {
        Customer customer = mock(Customer.class);
        CustomerOrder customerOrder =
                mock(CustomerOrder.class);
        CustomerOrderResponse expected = response();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(customerOrderRepository
                .findByCustomerUserIdOrderByOrderDateDesc(1))
                .thenReturn(List.of(customerOrder));

        when(customerOrder.getOrderId()).thenReturn(1);

        when(orderItemRepository
                .findByCustomerOrderOrderIdOrderByIdMenuItemIdAsc(
                        1
                ))
                .thenReturn(List.of());

        when(customerOrderMapper.toResponse(
                customerOrder,
                List.of()
        )).thenReturn(expected);

        List<CustomerOrderResponse> result =
                customerOrderService
                        .getOrdersByCustomer(1);

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRejectBlankOrderStatus() {
        assertThrows(
                IllegalArgumentException.class,
                () -> customerOrderService
                        .getOrdersByStatus(" ")
        );
    }

    private CustomerOrderResponse response() {
        return new CustomerOrderResponse(
                1,
                1,
                "Amaya Perera",
                null,
                "DINE_IN",
                "PENDING",
                new BigDecimal("6800.00"),
                List.of()
        );
    }
}