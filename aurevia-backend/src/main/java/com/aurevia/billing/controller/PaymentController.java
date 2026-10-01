package com.aurevia.billing.controller;

import com.aurevia.billing.dto.PaymentCreateRequest;
import com.aurevia.billing.dto.PaymentResponse;
import com.aurevia.billing.dto.PaymentVerificationRequest;
import com.aurevia.billing.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(
            @Valid @RequestBody PaymentCreateRequest request
    ) {
        return paymentService.createPayment(request);
    }

    @PatchMapping("/{paymentId}/verification")
    public PaymentResponse verifyPayment(
            @PathVariable Integer paymentId,
            @Valid @RequestBody
            PaymentVerificationRequest request,
            Principal principal
    ) {
        return paymentService.verifyPayment(
                paymentId,
                request,
                principal.getName()
        );
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse getPaymentById(
            @PathVariable Integer paymentId
    ) {
        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping("/invoices/{invoiceId}")
    public List<PaymentResponse> getPaymentsByInvoice(
            @PathVariable Integer invoiceId
    ) {
        return paymentService.getPaymentsByInvoice(invoiceId);
    }

    @GetMapping("/customers/{customerId}")
    public List<PaymentResponse> getPaymentsByCustomer(
            @PathVariable Integer customerId
    ) {
        return paymentService.getPaymentsByCustomer(customerId);
    }

    @GetMapping("/statuses/{paymentStatus}")
    public List<PaymentResponse> getPaymentsByStatus(
            @PathVariable String paymentStatus
    ) {
        return paymentService.getPaymentsByStatus(paymentStatus);
    }
}