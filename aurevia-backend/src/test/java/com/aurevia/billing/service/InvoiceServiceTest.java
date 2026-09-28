package com.aurevia.billing.service;

import com.aurevia.billing.dto.InvoiceCreateRequest;
import com.aurevia.billing.dto.InvoiceResponse;
import com.aurevia.billing.entity.Invoice;
import com.aurevia.billing.mapper.InvoiceMapper;
import com.aurevia.billing.repository.InvoiceRepository;
import com.aurevia.billing.repository.PaymentRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.repository.CustomerOrderRepository;
import com.aurevia.reservation.entity.Reservation;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.reservation.repository.ReservationRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
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
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private EventBookingRepository eventBookingRepository;

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private InvoiceMapper invoiceMapper;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void shouldGetInvoiceById() {
        Invoice invoice = new Invoice();
        InvoiceResponse response = response();

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));
        when(paymentRepository
                .calculateApprovedAmountForInvoice(null))
                .thenReturn(new BigDecimal("100.00"));
        when(invoiceMapper.toResponse(
                invoice,
                new BigDecimal("100.00")
        )).thenReturn(response);

        InvoiceResponse result =
                invoiceService.getInvoiceById(1);

        assertSame(response, result);
    }

    @Test
    void shouldRejectMissingInvoice() {
        when(invoiceRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> invoiceService.getInvoiceById(99)
        );
    }

    @Test
    void shouldGetInvoicesByCustomer() {
        Invoice invoice = new Invoice();
        InvoiceResponse response = response();

        when(invoiceRepository
                .findByCustomerUserIdOrderByInvoiceDateDesc(1))
                .thenReturn(List.of(invoice));
        when(paymentRepository
                .calculateApprovedAmountForInvoice(null))
                .thenReturn(BigDecimal.ZERO);
        when(invoiceMapper.toResponse(
                invoice,
                BigDecimal.ZERO
        )).thenReturn(response);

        List<InvoiceResponse> result =
                invoiceService.getInvoicesByCustomer(1);

        assertEquals(1, result.size());
        assertSame(response, result.getFirst());
    }

    @Test
    void shouldRejectBlankInvoiceStatus() {
        assertThrows(
                IllegalArgumentException.class,
                () -> invoiceService.getInvoicesByStatus(" ")
        );

        verify(invoiceRepository, never())
                .findByInvoiceStatusIgnoreCaseOrderByInvoiceDateDesc(
                        any()
                );
    }

    @Test
    void shouldRejectInvoiceWithoutSource() {
        InvoiceCreateRequest request = new InvoiceCreateRequest(
                1,
                null,
                null,
                null,
                new BigDecimal("1000.00"),
                BigDecimal.ZERO,
                new BigDecimal("100.00")
        );

        assertThrows(
                BusinessRuleException.class,
                () -> invoiceService.createInvoice(request)
        );

        verify(invoiceRepository, never())
                .saveAndFlush(any());
    }

    @Test
    void shouldRejectInvoiceWithMultipleSources() {
        InvoiceCreateRequest request = new InvoiceCreateRequest(
                1,
                1,
                1,
                null,
                new BigDecimal("1000.00"),
                BigDecimal.ZERO,
                new BigDecimal("100.00")
        );

        assertThrows(
                BusinessRuleException.class,
                () -> invoiceService.createInvoice(request)
        );
    }

    @Test
    void shouldRejectDiscountAboveSubtotal() {
        InvoiceCreateRequest request = new InvoiceCreateRequest(
                1,
                1,
                null,
                null,
                new BigDecimal("1000.00"),
                new BigDecimal("1200.00"),
                BigDecimal.ZERO
        );

        assertThrows(
                BusinessRuleException.class,
                () -> invoiceService.createInvoice(request)
        );
    }

    @Test
    void shouldRejectSourceOwnedByAnotherCustomer() {
        Customer requestedCustomer =
                org.mockito.Mockito.mock(Customer.class);
        Customer sourceCustomer =
                org.mockito.Mockito.mock(Customer.class);
        Reservation reservation =
                org.mockito.Mockito.mock(Reservation.class);

        InvoiceCreateRequest request = validRequest();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(requestedCustomer));
        when(requestedCustomer.getUserId()).thenReturn(1);
        when(reservationRepository.findById(10))
                .thenReturn(Optional.of(reservation));
        when(reservation.getCustomer())
                .thenReturn(sourceCustomer);
        when(sourceCustomer.getUserId()).thenReturn(2);

        assertThrows(
                BusinessRuleException.class,
                () -> invoiceService.createInvoice(request)
        );

        verify(invoiceRepository, never())
                .saveAndFlush(any());
    }

    @Test
    void shouldRejectDuplicateReservationInvoice() {
        Customer customer =
                org.mockito.Mockito.mock(Customer.class);
        Reservation reservation =
                org.mockito.Mockito.mock(Reservation.class);

        InvoiceCreateRequest request = validRequest();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));
        when(customer.getUserId()).thenReturn(1);
        when(reservationRepository.findById(10))
                .thenReturn(Optional.of(reservation));
        when(reservation.getCustomer())
                .thenReturn(customer);
        when(invoiceRepository
                .findByReservationReservationId(10))
                .thenReturn(Optional.of(new Invoice()));

        assertThrows(
                BusinessRuleException.class,
                () -> invoiceService.createInvoice(request)
        );
    }

    @Test
    void shouldCreateReservationInvoice() {
        Customer customer =
                org.mockito.Mockito.mock(Customer.class);
        Reservation reservation =
                org.mockito.Mockito.mock(Reservation.class);
        InvoiceResponse response = response();

        InvoiceCreateRequest request = validRequest();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));
        when(customer.getUserId()).thenReturn(1);
        when(reservationRepository.findById(10))
                .thenReturn(Optional.of(reservation));
        when(reservation.getCustomer())
                .thenReturn(customer);
        when(invoiceRepository
                .findByReservationReservationId(10))
                .thenReturn(Optional.empty());
        when(invoiceRepository.saveAndFlush(any(Invoice.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );
        when(invoiceMapper.toResponse(
                any(Invoice.class),
                org.mockito.ArgumentMatchers.eq(
                        BigDecimal.ZERO
                )
        )).thenReturn(response);

        InvoiceResponse result =
                invoiceService.createInvoice(request);

        assertSame(response, result);
        verify(invoiceRepository)
                .saveAndFlush(any(Invoice.class));
    }

    private InvoiceCreateRequest validRequest() {
        return new InvoiceCreateRequest(
                1,
                10,
                null,
                null,
                new BigDecimal("1000.00"),
                new BigDecimal("100.00"),
                new BigDecimal("90.00")
        );
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