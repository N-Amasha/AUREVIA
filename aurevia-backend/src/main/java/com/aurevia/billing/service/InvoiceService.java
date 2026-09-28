package com.aurevia.billing.service;

import com.aurevia.billing.dto.InvoiceCreateRequest;
import com.aurevia.billing.dto.InvoiceResponse;
import com.aurevia.billing.entity.Invoice;
import com.aurevia.billing.mapper.InvoiceMapper;
import com.aurevia.billing.repository.InvoiceRepository;
import com.aurevia.billing.repository.PaymentRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.repository.CustomerOrderRepository;
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.reservation.entity.Reservation;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.reservation.repository.ReservationRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;
    private final EventBookingRepository eventBookingRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final InvoiceMapper invoiceMapper;

    public InvoiceService(
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            CustomerRepository customerRepository,
            ReservationRepository reservationRepository,
            EventBookingRepository eventBookingRepository,
            CustomerOrderRepository customerOrderRepository,
            InvoiceMapper invoiceMapper
    ) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.customerRepository = customerRepository;
        this.reservationRepository = reservationRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.invoiceMapper = invoiceMapper;
    }

    @Transactional
    public InvoiceResponse createInvoice(
            InvoiceCreateRequest request
    ) {
        validateSourceSelection(request);
        validateAmounts(request);

        Customer customer = customerRepository
                .findById(request.customerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                request.customerId()
                        )
                );

        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);

        if (request.reservationId() != null) {
            Reservation reservation = reservationRepository
                    .findById(request.reservationId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Reservation",
                                    "reservationId",
                                    request.reservationId()
                            )
                    );

            verifyCustomerOwnership(
                    customer.getUserId(),
                    reservation.getCustomer().getUserId()
            );

            if (invoiceRepository
                    .findByReservationReservationId(
                            request.reservationId()
                    )
                    .isPresent()) {
                throw new BusinessRuleException(
                        "An invoice already exists for this reservation."
                );
            }

            invoice.setReservation(reservation);
        }

        if (request.eventBookingId() != null) {
            EventBooking eventBooking = eventBookingRepository
                    .findById(request.eventBookingId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Event booking",
                                    "eventBookingId",
                                    request.eventBookingId()
                            )
                    );

            verifyCustomerOwnership(
                    customer.getUserId(),
                    eventBooking.getCustomer().getUserId()
            );

            if (invoiceRepository
                    .findByEventBookingEventBookingId(
                            request.eventBookingId()
                    )
                    .isPresent()) {
                throw new BusinessRuleException(
                        "An invoice already exists for this event booking."
                );
            }

            invoice.setEventBooking(eventBooking);
        }

        if (request.orderId() != null) {
            CustomerOrder customerOrder = customerOrderRepository
                    .findById(request.orderId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Customer order",
                                    "orderId",
                                    request.orderId()
                            )
                    );

            verifyCustomerOwnership(
                    customer.getUserId(),
                    customerOrder.getCustomer().getUserId()
            );

            if (invoiceRepository
                    .findByCustomerOrderOrderId(request.orderId())
                    .isPresent()) {
                throw new BusinessRuleException(
                        "An invoice already exists for this order."
                );
            }

            invoice.setCustomerOrder(customerOrder);
        }

        BigDecimal totalAmount = request.subtotal()
                .subtract(request.discount())
                .add(request.taxAmount());

        invoice.setSubtotal(request.subtotal());
        invoice.setDiscount(request.discount());
        invoice.setTaxAmount(request.taxAmount());
        invoice.setTotalAmount(totalAmount);
        invoice.setInvoiceStatus("ISSUED");

        Invoice savedInvoice =
                invoiceRepository.saveAndFlush(invoice);

        return invoiceMapper.toResponse(
                savedInvoice,
                BigDecimal.ZERO
        );
    }

    public InvoiceResponse getInvoiceById(Integer invoiceId) {
        return mapInvoice(findInvoice(invoiceId));
    }

    public List<InvoiceResponse> getInvoicesByCustomer(
            Integer customerId
    ) {
        return invoiceRepository
                .findByCustomerUserIdOrderByInvoiceDateDesc(
                        customerId
                )
                .stream()
                .map(this::mapInvoice)
                .toList();
    }

    public List<InvoiceResponse> getInvoicesByStatus(
            String invoiceStatus
    ) {
        if (invoiceStatus == null || invoiceStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Invoice status is required."
            );
        }

        return invoiceRepository
                .findByInvoiceStatusIgnoreCaseOrderByInvoiceDateDesc(
                        invoiceStatus.trim()
                )
                .stream()
                .map(this::mapInvoice)
                .toList();
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

    private InvoiceResponse mapInvoice(Invoice invoice) {
        BigDecimal approvedAmount =
                paymentRepository
                        .calculateApprovedAmountForInvoice(
                                invoice.getInvoiceId()
                        );

        return invoiceMapper.toResponse(
                invoice,
                approvedAmount
        );
    }

    private void validateSourceSelection(
            InvoiceCreateRequest request
    ) {
        int selectedSources = 0;

        if (request.reservationId() != null) {
            selectedSources++;
        }

        if (request.eventBookingId() != null) {
            selectedSources++;
        }

        if (request.orderId() != null) {
            selectedSources++;
        }

        if (selectedSources != 1) {
            throw new BusinessRuleException(
                    "Exactly one invoice source must be selected."
            );
        }
    }

    private void validateAmounts(
            InvoiceCreateRequest request
    ) {
        if (request.discount()
                .compareTo(request.subtotal()) > 0) {
            throw new BusinessRuleException(
                    "Discount cannot exceed the subtotal."
            );
        }

        BigDecimal totalAmount = request.subtotal()
                .subtract(request.discount())
                .add(request.taxAmount());

        if (totalAmount.signum() <= 0) {
            throw new BusinessRuleException(
                    "Invoice total amount must be greater than zero."
            );
        }
    }

    private void verifyCustomerOwnership(
            Integer requestedCustomerId,
            Integer sourceCustomerId
    ) {
        if (!Objects.equals(
                requestedCustomerId,
                sourceCustomerId
        )) {
            throw new BusinessRuleException(
                    "The selected billing source does not belong "
                            + "to the supplied customer."
            );
        }
    }
}