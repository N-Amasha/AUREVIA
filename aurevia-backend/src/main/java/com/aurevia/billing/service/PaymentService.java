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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class PaymentService {

    private static final Set<String> PAYMENT_TYPES =
            Set.of("FULL_PAYMENT", "ADVANCE_PAYMENT");

    private static final Set<String> VERIFICATION_STATUSES =
            Set.of("APPROVED", "REJECTED");

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final CashierRepository cashierRepository;
    private final PaymentMapper paymentMapper;

    public PaymentService(
            PaymentRepository paymentRepository,
            InvoiceRepository invoiceRepository,
            CashierRepository cashierRepository,
            PaymentMapper paymentMapper
    ) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.cashierRepository = cashierRepository;
        this.paymentMapper = paymentMapper;
    }

    @Transactional
    public PaymentResponse createPayment(
            PaymentCreateRequest request
    ) {
        Invoice invoice = findInvoice(request.invoiceId());

        if ("PAID".equalsIgnoreCase(
                invoice.getInvoiceStatus()
        )) {
            throw new BusinessRuleException(
                    "The selected invoice is already fully paid."
            );
        }

        String transactionReference =
                request.transactionReference().trim();

        if (paymentRepository
                .findByTransactionReference(transactionReference)
                .isPresent()) {
            throw new BusinessRuleException(
                    "The transaction reference already exists."
            );
        }

        String paymentType = normalize(
                request.paymentType()
        );

        if (!PAYMENT_TYPES.contains(paymentType)) {
            throw new BusinessRuleException(
                    "Payment type must be FULL_PAYMENT "
                            + "or ADVANCE_PAYMENT."
            );
        }

        BigDecimal approvedAmount =
                approvedAmount(invoice.getInvoiceId());

        BigDecimal outstandingAmount =
                invoice.getTotalAmount()
                        .subtract(approvedAmount);

        if (request.amount()
                .compareTo(outstandingAmount) > 0) {
            throw new BusinessRuleException(
                    "Payment amount exceeds the outstanding "
                            + "invoice amount."
            );
        }

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setTransactionReference(
                transactionReference
        );
        payment.setPaymentType(paymentType);
        payment.setPaymentDate(request.paymentDate());
        payment.setAmount(request.amount());
        payment.setPaymentMethod(
                normalize(request.paymentMethod())
        );
        payment.setPaymentStatus("PENDING");

        Payment savedPayment =
                paymentRepository.saveAndFlush(payment);

        return paymentMapper.toResponse(savedPayment);
    }

    @Transactional
    public PaymentResponse verifyPayment(
            Integer paymentId,
            PaymentVerificationRequest request
    ) {
        Payment payment = findPayment(paymentId);

        if (!"PENDING".equalsIgnoreCase(
                payment.getPaymentStatus()
        )) {
            throw new BusinessRuleException(
                    "Only pending payments can be verified."
            );
        }

        String paymentStatus =
                normalize(request.paymentStatus());

        if (!VERIFICATION_STATUSES.contains(paymentStatus)) {
            throw new BusinessRuleException(
                    "Payment status must be APPROVED or REJECTED."
            );
        }

        Cashier cashier = cashierRepository
                .findById(request.cashierId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cashier",
                                "cashierId",
                                request.cashierId()
                        )
                );

        if ("APPROVED".equals(paymentStatus)) {
            BigDecimal approvedAfterVerification =
                    approvedAmount(
                            payment.getInvoice().getInvoiceId()
                    ).add(payment.getAmount());

            if (approvedAfterVerification.compareTo(
                    payment.getInvoice().getTotalAmount()
            ) > 0) {
                throw new BusinessRuleException(
                        "Approving this payment would exceed "
                                + "the invoice total."
                );
            }
        }

        payment.setVerifiedByCashier(cashier);
        payment.setPaymentStatus(paymentStatus);
        payment.setVerifiedAt(LocalDateTime.now());

        Payment savedPayment =
                paymentRepository.saveAndFlush(payment);

        updateInvoiceStatus(savedPayment);

        return paymentMapper.toResponse(savedPayment);
    }

    public PaymentResponse getPaymentById(Integer paymentId) {
        return paymentMapper.toResponse(
                findPayment(paymentId)
        );
    }

    public List<PaymentResponse> getPaymentsByInvoice(
            Integer invoiceId
    ) {
        return paymentRepository
                .findByInvoiceInvoiceIdOrderByPaymentDateDesc(
                        invoiceId
                )
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByCustomer(
            Integer customerId
    ) {
        return paymentRepository
                .findByInvoiceCustomerUserIdOrderByPaymentDateDesc(
                        customerId
                )
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByStatus(
            String paymentStatus
    ) {
        if (paymentStatus == null || paymentStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment status is required."
            );
        }

        return paymentRepository
                .findByPaymentStatusIgnoreCaseOrderByPaymentDateAsc(
                        paymentStatus.trim()
                )
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    private void updateInvoiceStatus(Payment payment) {
        Invoice invoice = payment.getInvoice();

        BigDecimal approvedAmount =
                approvedAmount(invoice.getInvoiceId());

        if (approvedAmount.compareTo(
                invoice.getTotalAmount()
        ) >= 0) {
            invoice.setInvoiceStatus("PAID");
        } else if (approvedAmount.signum() > 0) {
            invoice.setInvoiceStatus("PARTIALLY_PAID");
        } else {
            invoice.setInvoiceStatus("ISSUED");
        }

        invoiceRepository.save(invoice);
    }

    private Invoice findInvoice(Integer invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice",
                                "invoiceId",
                                invoiceId
                        )
                );
    }

    private Payment findPayment(Integer paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment",
                                "paymentId",
                                paymentId
                        )
                );
    }

    private BigDecimal approvedAmount(Integer invoiceId) {
        BigDecimal amount =
                paymentRepository
                        .calculateApprovedAmountForInvoice(
                                invoiceId
                        );

        return amount == null
                ? BigDecimal.ZERO
                : amount;
    }

    private String normalize(String value) {
        return value.trim().toUpperCase(Locale.ROOT);
    }
}