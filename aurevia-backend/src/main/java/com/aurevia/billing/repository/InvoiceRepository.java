package com.aurevia.billing.repository;

import com.aurevia.billing.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    List<Invoice> findByCustomerUserIdOrderByInvoiceDateDesc(
            Integer customerId
    );

    List<Invoice> findByInvoiceStatusIgnoreCaseOrderByInvoiceDateDesc(
            String invoiceStatus
    );

    Optional<Invoice> findByReservationReservationId(
            Integer reservationId
    );

    Optional<Invoice> findByEventBookingEventBookingId(
            Integer eventBookingId
    );

    Optional<Invoice> findByCustomerOrderOrderId(
            Integer orderId
    );
}