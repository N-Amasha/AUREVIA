package com.aurevia.billing.controller;

import com.aurevia.billing.dto.PaymentResponse;
import com.aurevia.billing.service.PaymentService;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @Test
    void shouldCreatePayment() throws Exception {
        when(paymentService.createPayment(any()))
                .thenReturn(response("PENDING"));

        mockMvc.perform(
                        post("/api/payments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "invoiceId": 1,
                                          "transactionReference": "TEST-REFERENCE",
                                          "paymentType": "FULL_PAYMENT",
                                          "paymentDate": "2026-09-28T09:00:00",
                                          "amount": 1000.00,
                                          "paymentMethod": "BANK_TRANSFER"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paymentId").value(1))
                .andExpect(jsonPath("$.invoiceId").value(1))
                .andExpect(jsonPath("$.paymentStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldRejectInvalidPaymentRequest() throws Exception {
        mockMvc.perform(
                        post("/api/payments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "invoiceId": null,
                                          "transactionReference": "",
                                          "paymentType": "",
                                          "paymentDate": null,
                                          "amount": 0,
                                          "paymentMethod": ""
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.invoiceId"
                ).value("Invoice ID is required."));
    }

    @Test
        void shouldVerifyPayment() throws Exception {
        when(paymentService.verifyPayment(
                eq(1),
                any(),
                eq("cashier1@aurevia.test")
        )).thenReturn(response("APPROVED"));

        mockMvc.perform(
                        patch("/api/payments/1/verification")
                                .principal(
                                        () -> "cashier1@aurevia.test"
                                )
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                        "paymentStatus": "APPROVED"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus")
                        .value("APPROVED"));
        }

    @Test
    void shouldGetPaymentById() throws Exception {
        when(paymentService.getPaymentById(1))
                .thenReturn(response("APPROVED"));

        mockMvc.perform(get("/api/payments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentId").value(1))
                .andExpect(jsonPath("$.transactionReference")
                        .value("TEST-REFERENCE"));
    }

    @Test
    void shouldGetInvoicePayments() throws Exception {
        when(paymentService.getPaymentsByInvoice(1))
                .thenReturn(List.of(response("APPROVED")));

        mockMvc.perform(get("/api/payments/invoices/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].invoiceId")
                        .value(1));
    }

    @Test
    void shouldGetCustomerPayments() throws Exception {
        when(paymentService.getPaymentsByCustomer(1))
                .thenReturn(List.of(response("APPROVED")));

        mockMvc.perform(get("/api/payments/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerId")
                        .value(1));
    }

    @Test
    void shouldGetPendingPayments() throws Exception {
        when(paymentService.getPaymentsByStatus("PENDING"))
                .thenReturn(List.of(response("PENDING")));

        mockMvc.perform(get("/api/payments/statuses/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].paymentStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldReturnNotFoundForMissingPayment()
            throws Exception {

        when(paymentService.getPaymentById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Payment",
                                "paymentId",
                                99
                        )
                );

        mockMvc.perform(get("/api/payments/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Payment not found with paymentId: 99"
                ));
    }

    private PaymentResponse response(String status) {
        return new PaymentResponse(
                1,
                1,
                1,
                "Amaya Perera",
                "PENDING".equals(status) ? null : 16,
                "TEST-REFERENCE",
                "FULL_PAYMENT",
                LocalDateTime.of(
                        2026, 9, 28, 9, 0
                ),
                new BigDecimal("1000.00"),
                "BANK_TRANSFER",
                status,
                "PENDING".equals(status)
                        ? null
                        : LocalDateTime.of(
                                2026, 9, 28, 10, 0
                        )
        );
    }
}