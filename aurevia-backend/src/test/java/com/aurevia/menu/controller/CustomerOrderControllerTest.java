package com.aurevia.menu.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CustomerOrderCreateRequest;
import com.aurevia.menu.dto.CustomerOrderResponse;
import com.aurevia.menu.dto.OrderItemResponse;
import com.aurevia.menu.service.CustomerOrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CustomerOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class CustomerOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CustomerOrderService customerOrderService;

    @Test
    void shouldCreateOrder() throws Exception {
        when(customerOrderService.createOrder(
                any(CustomerOrderCreateRequest.class)
        )).thenReturn(response());

        mockMvc.perform(
                        post("/api/orders")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "customerId": 1,
                                          "orderType": "DINE_IN",
                                          "items": [
                                            {
                                              "menuItemId": 1,
                                              "quantity": 2
                                            },
                                            {
                                              "menuItemId": 6,
                                              "quantity": 1
                                            }
                                          ]
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value(6))
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.orderStatus")
                        .value("PENDING"))
                .andExpect(jsonPath("$.totalAmount")
                        .value(6800.00))
                .andExpect(jsonPath("$.items.length()")
                        .value(2));
    }

    @Test
    void shouldValidateOrderRequest() throws Exception {
        mockMvc.perform(
                        post("/api/orders")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "orderType": "",
                                          "items": []
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.customerId"
                ).value("Customer ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.orderType"
                ).value("Order type is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.items"
                ).value(
                        "At least one order item is required."
                ));
    }

    @Test
    void shouldReturnOrderById() throws Exception {
        when(customerOrderService.getOrderById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(6))
                .andExpect(jsonPath("$.customerName")
                        .value("Amaya Perera"));
    }

    @Test
    void shouldReturnNotFoundForUnknownOrder()
            throws Exception {

        when(customerOrderService.getOrderById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Customer order",
                        "orderId",
                        99
                ));

        mockMvc.perform(get("/api/orders/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Customer order not found with orderId: 99"
                ));
    }

    @Test
    void shouldReturnOrdersByCustomer()
            throws Exception {

        when(customerOrderService
                .getOrdersByCustomer(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/orders/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerId")
                        .value(1))
                .andExpect(jsonPath("$[0].totalAmount")
                        .value(6800.00));
    }

    @Test
    void shouldReturnOrdersByStatus() throws Exception {
        when(customerOrderService
                .getOrdersByStatus("PENDING"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/orders/statuses/PENDING")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderStatus")
                        .value("PENDING"));
    }

    private CustomerOrderResponse response() {
        return new CustomerOrderResponse(
                6,
                1,
                "Amaya Perera",
                LocalDateTime.of(
                        2026,
                        9,
                        27,
                        18,
                        50
                ),
                "DINE_IN",
                "PENDING",
                new BigDecimal("6800.00"),
                List.of(
                        new OrderItemResponse(
                                1,
                                "Grilled Chicken Supreme",
                                2,
                                new BigDecimal("2500.00"),
                                new BigDecimal("5000.00")
                        ),
                        new OrderItemResponse(
                                6,
                                "Classic Tiramisu",
                                1,
                                new BigDecimal("1800.00"),
                                new BigDecimal("1800.00")
                        )
                )
        );
    }
}