package com.aurevia.billing.repository;

import com.aurevia.billing.entity.Invoice;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

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
class InvoiceRepositoryTest {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Test
    void shouldLoadAllInvoices() {
        assertThat(invoiceRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindCustomerInvoices() {
        List<Invoice> invoices =
                invoiceRepository
                        .findByCustomerUserIdOrderByInvoiceDateDesc(2);

        assertThat(invoices).hasSize(1);

        Invoice invoice = invoices.getFirst();

        assertThat(invoice.getInvoiceId()).isEqualTo(2);
        assertThat(invoice.getInvoiceStatus())
                .isEqualTo("PARTIALLY_PAID");
        assertThat(invoice.getTotalAmount())
                .isEqualByComparingTo(new BigDecimal("216800.00"));
    }

    @Test
    void shouldFindInvoiceByReservation() {
        Optional<Invoice> result =
                invoiceRepository
                        .findByReservationReservationId(1);

        assertThat(result).isPresent();
        assertThat(result.get().getInvoiceId()).isEqualTo(1);
        assertThat(result.get().getCustomer().getUserId())
                .isEqualTo(1);
        assertThat(result.get().getEventBooking()).isNull();
        assertThat(result.get().getCustomerOrder()).isNull();
    }

    @Test
    void shouldFindInvoiceByEventBooking() {
        Optional<Invoice> result =
                invoiceRepository
                        .findByEventBookingEventBookingId(2);

        assertThat(result).isPresent();
        assertThat(result.get().getInvoiceId()).isEqualTo(2);
        assertThat(result.get().getEventBooking()
                .getEventBookingId()).isEqualTo(2);
        assertThat(result.get().getReservation()).isNull();
        assertThat(result.get().getCustomerOrder()).isNull();
    }

    @Test
    void shouldFindInvoiceByCustomerOrder() {
        Optional<Invoice> result =
                invoiceRepository
                        .findByCustomerOrderOrderId(3);

        assertThat(result).isPresent();
        assertThat(result.get().getInvoiceId()).isEqualTo(3);
        assertThat(result.get().getCustomerOrder().getOrderId())
                .isEqualTo(3);
        assertThat(result.get().getReservation()).isNull();
        assertThat(result.get().getEventBooking()).isNull();
    }

    @Test
    void shouldFindIssuedInvoices() {
        List<Invoice> invoices =
                invoiceRepository
                        .findByInvoiceStatusIgnoreCaseOrderByInvoiceDateDesc(
                                "issued"
                        );

        assertThat(invoices)
                .extracting(Invoice::getInvoiceId)
                .containsExactly(5, 4);
    }
}