package com.aurevia.billing.controller;

import com.aurevia.billing.dto.InvoiceCreateRequest;
import com.aurevia.billing.dto.InvoiceResponse;
import com.aurevia.billing.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse createInvoice(
            @Valid @RequestBody InvoiceCreateRequest request
    ) {
        return invoiceService.createInvoice(request);
    }

    @GetMapping("/{invoiceId}")
    public InvoiceResponse getInvoiceById(
            @PathVariable Integer invoiceId
    ) {
        return invoiceService.getInvoiceById(invoiceId);
    }

    @GetMapping("/customers/{customerId}")
    public List<InvoiceResponse> getInvoicesByCustomer(
            @PathVariable Integer customerId
    ) {
        return invoiceService.getInvoicesByCustomer(customerId);
    }

    @GetMapping("/statuses/{invoiceStatus}")
    public List<InvoiceResponse> getInvoicesByStatus(
            @PathVariable String invoiceStatus
    ) {
        return invoiceService.getInvoicesByStatus(invoiceStatus);
    }
}