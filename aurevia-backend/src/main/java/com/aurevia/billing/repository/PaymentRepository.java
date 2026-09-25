package com.aurevia.billing.repository;

import com.aurevia.billing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByTransactionReference(
            String transactionReference
    );

    List<Payment> findByInvoiceInvoiceIdOrderByPaymentDateDesc(
            Integer invoiceId
    );

    List<Payment> findByInvoiceCustomerUserIdOrderByPaymentDateDesc(
            Integer customerId
    );

    List<Payment> findByPaymentStatusIgnoreCaseOrderByPaymentDateAsc(
            String paymentStatus
    );

    @Query("""
            SELECT COALESCE(SUM(payment.amount), 0)
            FROM Payment payment
            WHERE payment.invoice.invoiceId = :invoiceId
              AND UPPER(payment.paymentStatus) = 'APPROVED'
            """)
    BigDecimal calculateApprovedAmountForInvoice(
            @Param("invoiceId") Integer invoiceId
    );
}