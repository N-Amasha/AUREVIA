package com.aurevia.billing.controller;

import com.aurevia.billing.dto.InvoiceResponse;
import com.aurevia.billing.service.InvoiceService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = InvoiceController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;

    @Test
    void shouldCreateInvoice() throws Exception {
        when(invoiceService.createInvoice(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/invoices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": 1,
                                          "reservationId": 10,
                                          "subtotal": 1000.00,
                                          "discount": 100.00,
                                          "taxAmount": 90.00
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.invoiceId").value(1))
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.reservationId").value(10))
                .andExpect(jsonPath("$.totalAmount")
                        .value(990.00))
                .andExpect(jsonPath("$.invoiceStatus")
                        .value("ISSUED"));
    }

    @Test
    void shouldRejectInvalidInvoiceRequest() throws Exception {
        mockMvc.perform(
                        post("/api/invoices")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": null,
                                          "subtotal": -1,
                                          "discount": -1,
                                          "taxAmount": -1
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.customerId"
                ).value("Customer ID is required."));
    }

    @Test
    void shouldGetInvoiceById() throws Exception {
        when(invoiceService.getInvoiceById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/invoices/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.invoiceId").value(1))
                .andExpect(jsonPath("$.customerName")
                        .value("Amaya Perera"))
                .andExpect(jsonPath("$.outstandingAmount")
                        .value(990.00));
    }

    @Test
    void shouldGetCustomerInvoices() throws Exception {
        when(invoiceService.getInvoicesByCustomer(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/invoices/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].invoiceId")
                        .value(1));
    }

    @Test
    void shouldGetInvoicesByStatus() throws Exception {
        when(invoiceService.getInvoicesByStatus("ISSUED"))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/invoices/statuses/ISSUED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].invoiceStatus")
                        .value("ISSUED"));
    }

    @Test
    void shouldReturnNotFoundForMissingInvoice()
            throws Exception {

        when(invoiceService.getInvoiceById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Invoice",
                                "invoiceId",
                                99
                        )
                );

        mockMvc.perform(get("/api/invoices/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Invoice not found with invoiceId: 99"
                ));
    }

    private InvoiceResponse response() {
        return new InvoiceResponse(
                1,
                1,
                "Amaya Perera",
                10,
                null,
                null,
                null,
                new BigDecimal("1000.00"),
                new BigDecimal("100.00"),
                new BigDecimal("90.00"),
                new BigDecimal("990.00"),
                BigDecimal.ZERO,
                new BigDecimal("990.00"),
                "ISSUED"
        );
    }
}