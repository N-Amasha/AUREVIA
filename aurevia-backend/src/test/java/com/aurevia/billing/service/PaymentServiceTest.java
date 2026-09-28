package com.aurevia.billing.service;

import com.aurevia.billing.dto.PaymentCreateRequest;
import com.aurevia.billing.dto.PaymentResponse;
import com.aurevia.billing.dto.PaymentVerificationRequest;
import com.aurevia.billing.entity.Invoice;
import com.aurevia.billing.entity.Payment;
import com.aurevia.billing.mapper.PaymentMapper;
import com.aurevia.billing.repository.InvoiceRepository;
import com.aurevia.billing.repository.PaymentRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.user.entity.Cashier;
import com.aurevia.user.repository.CashierRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private CashierRepository cashierRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void shouldGetPaymentById() {
        Payment payment = new Payment();
        PaymentResponse response = response();

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(payment));
        when(paymentMapper.toResponse(payment))
                .thenReturn(response);

        PaymentResponse result =
                paymentService.getPaymentById(1);

        assertSame(response, result);
    }

    @Test
    void shouldRejectMissingPayment() {
        when(paymentRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.getPaymentById(99)
        );
    }

    @Test
    void shouldGetCustomerPayments() {
        Payment payment = new Payment();

        when(paymentRepository
                .findByInvoiceCustomerUserIdOrderByPaymentDateDesc(1))
                .thenReturn(List.of(payment));
        when(paymentMapper.toResponse(payment))
                .thenReturn(response());

        List<PaymentResponse> result =
                paymentService.getPaymentsByCustomer(1);

        assertEquals(1, result.size());
    }

    @Test
    void shouldRejectBlankPaymentStatus() {
        assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.getPaymentsByStatus(" ")
        );

        verify(paymentRepository, never())
                .findByPaymentStatusIgnoreCaseOrderByPaymentDateAsc(
                        any()
                );
    }

    @Test
    void shouldRejectPaymentForMissingInvoice() {
        PaymentCreateRequest request = createRequest();

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.createPayment(request)
        );
    }

    @Test
    void shouldRejectPaymentForPaidInvoice() {
        Invoice invoice = invoice("PAID");

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        assertThrows(
                BusinessRuleException.class,
                () -> paymentService.createPayment(
                        createRequest()
                )
        );
    }

    @Test
    void shouldRejectDuplicateTransactionReference() {
        Invoice invoice = invoice("ISSUED");

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));
        when(paymentRepository.findByTransactionReference(
                "TEST-REFERENCE"
        )).thenReturn(Optional.of(new Payment()));

        assertThrows(
                BusinessRuleException.class,
                () -> paymentService.createPayment(
                        createRequest()
                )
        );
    }

    @Test
    void shouldRejectPaymentAboveOutstandingAmount() {
        Invoice invoice = invoice("ISSUED");
        PaymentCreateRequest request =
                new PaymentCreateRequest(
                        1,
                        "TEST-REFERENCE",
                        "FULL_PAYMENT",
                        LocalDateTime.now(),
                        new BigDecimal("1100.00"),
                        "BANK_TRANSFER"
                );

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));
        when(paymentRepository.findByTransactionReference(
                "TEST-REFERENCE"
        )).thenReturn(Optional.empty());
        when(paymentRepository
                .calculateApprovedAmountForInvoice(1))
                .thenReturn(BigDecimal.ZERO);

        assertThrows(
                BusinessRuleException.class,
                () -> paymentService.createPayment(request)
        );
    }

    @Test
    void shouldCreatePendingPayment() {
        Invoice invoice = invoice("ISSUED");
        PaymentResponse response = response();

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));
        when(paymentRepository.findByTransactionReference(
                "TEST-REFERENCE"
        )).thenReturn(Optional.empty());
        when(paymentRepository
                .calculateApprovedAmountForInvoice(1))
                .thenReturn(BigDecimal.ZERO);
        when(paymentRepository.saveAndFlush(
                any(Payment.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );
        when(paymentMapper.toResponse(any(Payment.class)))
                .thenReturn(response);

        PaymentResponse result =
                paymentService.createPayment(createRequest());

        assertSame(response, result);
        verify(paymentRepository)
                .saveAndFlush(any(Payment.class));
    }

    @Test
    void shouldRejectVerificationOfProcessedPayment() {
        Payment payment = payment("APPROVED");

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(payment));

        assertThrows(
                BusinessRuleException.class,
                () -> paymentService.verifyPayment(
                        1,
                        verificationRequest("APPROVED")
                )
        );
    }

    @Test
    void shouldRejectInvalidVerificationStatus() {
        Payment payment = payment("PENDING");

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(payment));

        assertThrows(
                BusinessRuleException.class,
                () -> paymentService.verifyPayment(
                        1,
                        verificationRequest("UNKNOWN")
                )
        );
    }

    @Test
    void shouldApprovePaymentAndMarkInvoicePaid() {
        Invoice invoice = invoice("ISSUED");
        Payment payment = payment("PENDING");
        payment.setInvoice(invoice);

        Cashier cashier =
                org.mockito.Mockito.mock(Cashier.class);
        PaymentResponse response = response();

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(payment));
        when(cashierRepository.findById(16))
                .thenReturn(Optional.of(cashier));
        when(paymentRepository
                .calculateApprovedAmountForInvoice(1))
                .thenReturn(BigDecimal.ZERO)
                .thenReturn(new BigDecimal("1000.00"));
        when(paymentRepository.saveAndFlush(payment))
                .thenReturn(payment);
        when(paymentMapper.toResponse(payment))
                .thenReturn(response);

        PaymentResponse result =
                paymentService.verifyPayment(
                        1,
                        verificationRequest("APPROVED")
                );

        assertSame(response, result);
        assertEquals("APPROVED", payment.getPaymentStatus());
        assertEquals("PAID", invoice.getInvoiceStatus());
        verify(invoiceRepository).save(invoice);
    }

    private Invoice invoice(String status) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(1);
        invoice.setTotalAmount(
                new BigDecimal("1000.00")
        );
        invoice.setInvoiceStatus(status);
        return invoice;
    }

    private Payment payment(String status) {
        Payment payment = new Payment();
        payment.setPaymentId(1);
        payment.setAmount(new BigDecimal("1000.00"));
        payment.setPaymentStatus(status);
        return payment;
    }

    private PaymentCreateRequest createRequest() {
        return new PaymentCreateRequest(
                1,
                "TEST-REFERENCE",
                "FULL_PAYMENT",
                LocalDateTime.now(),
                new BigDecimal("1000.00"),
                "BANK_TRANSFER"
        );
    }

    private PaymentVerificationRequest verificationRequest(
            String status
    ) {
        return new PaymentVerificationRequest(
                16,
                status
        );
    }

    private PaymentResponse response() {
        return new PaymentResponse(
                1,
                1,
                1,
                "Amaya Perera",
                null,
                "TEST-REFERENCE",
                "FULL_PAYMENT",
                LocalDateTime.now(),
                new BigDecimal("1000.00"),
                "BANK_TRANSFER",
                "PENDING",
                null
        );
    }
}