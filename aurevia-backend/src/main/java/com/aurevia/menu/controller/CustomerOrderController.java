package com.aurevia.menu.controller;

import com.aurevia.menu.dto.CustomerOrderCreateRequest;
import com.aurevia.menu.dto.CustomerOrderResponse;
import com.aurevia.menu.service.CustomerOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;

    public CustomerOrderController(
            CustomerOrderService customerOrderService
    ) {
        this.customerOrderService = customerOrderService;
    }

    @PostMapping
    public ResponseEntity<CustomerOrderResponse> createOrder(
            @Valid
            @RequestBody
            CustomerOrderCreateRequest request
    ) {
        CustomerOrderResponse response =
                customerOrderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<CustomerOrderResponse> getOrderById(
            @PathVariable Integer orderId
    ) {
        return ResponseEntity.ok(
                customerOrderService.getOrderById(orderId)
        );
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<List<CustomerOrderResponse>>
    getOrdersByCustomer(
            @PathVariable Integer customerId
    ) {
        return ResponseEntity.ok(
                customerOrderService
                        .getOrdersByCustomer(customerId)
        );
    }

    @GetMapping("/statuses/{orderStatus}")
    public ResponseEntity<List<CustomerOrderResponse>>
    getOrdersByStatus(
            @PathVariable String orderStatus
    ) {
        return ResponseEntity.ok(
                customerOrderService
                        .getOrdersByStatus(orderStatus)
        );
    }
}