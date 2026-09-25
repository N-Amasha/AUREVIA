package com.aurevia.billing.repository;

import com.aurevia.billing.entity.Payment;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Test
    void shouldLoadAllPayments() {
        assertThat(paymentRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindPaymentByTransactionReference() {
        Optional<Payment> result =
                paymentRepository.findByTransactionReference(
                        "AUR-PAY-2026-002"
                );

        assertThat(result).isPresent();

        Payment payment = result.get();

        assertThat(payment.getPaymentId()).isEqualTo(2);
        assertThat(payment.getInvoice().getInvoiceId()).isEqualTo(2);
        assertThat(payment.getPaymentType())
                .isEqualTo("ADVANCE_PAYMENT");
        assertThat(payment.getAmount())
                .isEqualByComparingTo(new BigDecimal("100000.00"));
        assertThat(payment.getPaymentStatus())
                .isEqualTo("APPROVED");
    }

    @Test
    void shouldFindPaymentsForInvoice() {
        List<Payment> payments =
                paymentRepository
                        .findByInvoiceInvoiceIdOrderByPaymentDateDesc(1);

        assertThat(payments).hasSize(1);
        assertThat(payments.getFirst().getPaymentId()).isEqualTo(1);
        assertThat(payments.getFirst().getAmount())
                .isEqualByComparingTo(new BigDecimal("5000.00"));
    }

    @Test
    void shouldFindCustomerPaymentHistory() {
        List<Payment> payments =
                paymentRepository
                        .findByInvoiceCustomerUserIdOrderByPaymentDateDesc(2);

        assertThat(payments).hasSize(1);
        assertThat(payments.getFirst().getPaymentId()).isEqualTo(2);
    }

    @Test
    void shouldFindPendingPaymentsWithoutVerificationDetails() {
        List<Payment> payments =
                paymentRepository
                        .findByPaymentStatusIgnoreCaseOrderByPaymentDateAsc(
                                "pending"
                        );

        assertThat(payments)
                .extracting(Payment::getPaymentId)
                .containsExactly(4);

        Payment pendingPayment = payments.getFirst();

        assertThat(pendingPayment.getVerifiedByCashier()).isNull();
        assertThat(pendingPayment.getVerifiedAt()).isNull();
    }

    @Test
    void shouldFindRejectedPaymentWithVerificationDetails() {
        List<Payment> payments =
                paymentRepository
                        .findByPaymentStatusIgnoreCaseOrderByPaymentDateAsc(
                                "rejected"
                        );

        assertThat(payments)
                .extracting(Payment::getPaymentId)
                .containsExactly(5);

        Payment rejectedPayment = payments.getFirst();

        assertThat(rejectedPayment.getVerifiedByCashier()).isNotNull();
        assertThat(rejectedPayment.getVerifiedAt()).isNotNull();
    }

    @Test
    void shouldCalculateApprovedAmountForInvoice() {
        BigDecimal approvedAmount =
                paymentRepository
                        .calculateApprovedAmountForInvoice(2);

        assertThat(approvedAmount)
                .isEqualByComparingTo(new BigDecimal("100000.00"));
    }
}