package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.reservation.entity.PricingRule;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.mapper.EventBookingMapper;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.reservation.repository.PricingRuleRepository;
import com.aurevia.reservation.repository.VenueRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.lenient;

import java.math.BigDecimal;
import java.time.LocalDate;
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
class EventBookingServiceTest {

    @Mock
    private EventBookingRepository eventBookingRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private PricingRuleRepository pricingRuleRepository;

    @Mock
    private EventBookingMapper eventBookingMapper;

    private EventBookingService eventBookingService;

    @BeforeEach
    void setUp() {
        eventBookingService = new EventBookingService(
                eventBookingRepository,
                customerRepository,
                venueRepository,
                pricingRuleRepository,
                eventBookingMapper
        );
    }

    @Test
    void shouldCreateBookingUsingVenueBasePrice() {
        Customer customer = mockCustomer();
        Venue venue = mockAvailableVenue();
        EventBookingResponse expectedResponse =
                mockResponse();

        EventBookingCreateRequest request =
                createRequest(200);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(
                eventBookingRepository
                        .findVenueBookingConflicts(
                                1,
                                request.bookingDate()
                        )
        ).thenReturn(List.of());

        when(
                pricingRuleRepository
                        .findApprovedRulesForDate(
                                1,
                                request.bookingDate()
                        )
        ).thenReturn(List.of());

        when(eventBookingRepository.save(any(EventBooking.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(
                eventBookingMapper.toResponse(
                        any(EventBooking.class)
                )
        ).thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService.createEventBooking(request);

        assertSame(expectedResponse, actualResponse);

        ArgumentCaptor<EventBooking> bookingCaptor =
                ArgumentCaptor.forClass(EventBooking.class);

        verify(eventBookingRepository)
                .save(bookingCaptor.capture());

        EventBooking savedBooking =
                bookingCaptor.getValue();

        assertSame(customer, savedBooking.getCustomer());
        assertSame(venue, savedBooking.getVenue());
        assertEquals(
                request.bookingDate(),
                savedBooking.getBookingDate()
        );
        assertEquals(200, savedBooking.getGuestCount());
        assertEquals(
                new BigDecimal("250000.00"),
                savedBooking.getTotalAmount()
        );
        assertEquals(
                "PENDING",
                savedBooking.getBookingStatus()
        );
    }

    @Test
    void shouldCreateBookingUsingApprovedPricingRule() {
        Customer customer = mockCustomer();
        Venue venue = mockAvailableVenue();

        PricingRule pricingRule =
                mock(PricingRule.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        EventBookingCreateRequest request =
                createRequest(300);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(
                eventBookingRepository
                        .findVenueBookingConflicts(
                                1,
                                request.bookingDate()
                        )
        ).thenReturn(List.of());

        when(
                pricingRuleRepository
                        .findApprovedRulesForDate(
                                1,
                                request.bookingDate()
                        )
        ).thenReturn(List.of(pricingRule));

        when(pricingRule.getPrice())
                .thenReturn(new BigDecimal("300000.00"));

        when(pricingRule.getSurcharge())
                .thenReturn(new BigDecimal("50000.00"));

        when(eventBookingRepository.save(any(EventBooking.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(
                eventBookingMapper.toResponse(
                        any(EventBooking.class)
                )
        ).thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService.createEventBooking(request);

        assertSame(expectedResponse, actualResponse);

        ArgumentCaptor<EventBooking> bookingCaptor =
                ArgumentCaptor.forClass(EventBooking.class);

        verify(eventBookingRepository)
                .save(bookingCaptor.capture());

        assertEquals(
                new BigDecimal("350000.00"),
                bookingCaptor
                        .getValue()
                        .getTotalAmount()
        );
    }

    @Test
    void shouldRejectBookingWhenCustomerDoesNotExist() {
        EventBookingCreateRequest request =
                createRequest(100);

        when(customerRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .createEventBooking(request)
        );

        verify(venueRepository, never()).findById(1);
        verify(
                eventBookingRepository,
                never()
        ).save(any(EventBooking.class));
    }

    @Test
    void shouldRejectBookingWhenVenueDoesNotExist() {
        Customer customer = mockCustomer();
        EventBookingCreateRequest request =
                createRequest(100);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .createEventBooking(request)
        );

        verify(
                eventBookingRepository,
                never()
        ).save(any(EventBooking.class));
    }

    @Test
    void shouldRejectUnavailableVenue() {
        Customer customer = mockCustomer();
        Venue venue = mock(Venue.class);
        EventBookingCreateRequest request =
                createRequest(100);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(venue.getAvailabilityStatus())
                .thenReturn("MAINTENANCE");

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(request)
                );

        assertEquals(
                "The selected venue is not available.",
                exception.getMessage()
        );

        verify(
                eventBookingRepository,
                never()
        ).save(any(EventBooking.class));
    }

    @Test
    void shouldRejectGuestCountAboveVenueCapacity() {
        Customer customer = mockCustomer();
        Venue venue = mockAvailableVenue();
        EventBookingCreateRequest request =
                createRequest(501);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(request)
                );

        assertEquals(
                "Guest count exceeds the selected venue capacity.",
                exception.getMessage()
        );

        verify(
                eventBookingRepository,
                never()
        ).save(any(EventBooking.class));
    }

    @Test
    void shouldRejectConflictingVenueBooking() {
        Customer customer = mockCustomer();
        Venue venue = mockAvailableVenue();
        EventBooking existingBooking =
                mock(EventBooking.class);

        EventBookingCreateRequest request =
                createRequest(200);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(
                eventBookingRepository
                        .findVenueBookingConflicts(
                                1,
                                request.bookingDate()
                        )
        ).thenReturn(List.of(existingBooking));

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(request)
                );

        assertEquals(
                "The selected venue is already booked for the requested date.",
                exception.getMessage()
        );

        verify(
                eventBookingRepository,
                never()
        ).save(any(EventBooking.class));
    }

    @Test
    void shouldReturnEventBookingById() {
        EventBooking eventBooking =
                mock(EventBooking.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(eventBookingRepository.findById(1))
                .thenReturn(Optional.of(eventBooking));

        when(eventBookingMapper.toResponse(eventBooking))
                .thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService
                        .getEventBookingById(1);

        assertSame(expectedResponse, actualResponse);
    }

    @Test
    void shouldReturnCustomerEventBookings() {
        EventBooking firstBooking =
                mock(EventBooking.class);

        EventBooking secondBooking =
                mock(EventBooking.class);

        EventBookingResponse firstResponse =
                mockResponse();

        EventBookingResponse secondResponse =
                mockResponse();

        when(customerRepository.existsById(1))
                .thenReturn(true);

        when(
                eventBookingRepository
                        .findByCustomerUserIdOrderByBookingDateDesc(
                                1
                        )
        ).thenReturn(
                List.of(firstBooking, secondBooking)
        );

        when(eventBookingMapper.toResponse(firstBooking))
                .thenReturn(firstResponse);

        when(eventBookingMapper.toResponse(secondBooking))
                .thenReturn(secondResponse);

        List<EventBookingResponse> responses =
                eventBookingService
                        .getCustomerEventBookings(1);

        assertEquals(
                List.of(firstResponse, secondResponse),
                responses
        );
    }

    @Test
    void shouldRejectMissingCustomerWhenLoadingBookings() {
        when(customerRepository.existsById(99))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .getCustomerEventBookings(99)
        );

        verify(
                eventBookingRepository,
                never()
        ).findByCustomerUserIdOrderByBookingDateDesc(99);
    }

    @Test
    void shouldReturnBookingsByTrimmedStatus() {
        EventBooking eventBooking =
                mock(EventBooking.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(
                eventBookingRepository
                        .findByBookingStatusIgnoreCase(
                                "CONFIRMED"
                        )
        ).thenReturn(List.of(eventBooking));

        when(eventBookingMapper.toResponse(eventBooking))
                .thenReturn(expectedResponse);

        List<EventBookingResponse> responses =
                eventBookingService
                        .getEventBookingsByStatus(
                                "  CONFIRMED  "
                        );

        assertEquals(
                List.of(expectedResponse),
                responses
        );

        verify(eventBookingRepository)
                .findByBookingStatusIgnoreCase(
                        "CONFIRMED"
                );
    }

    @Test
    void shouldRejectBlankBookingStatus() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> eventBookingService
                                .getEventBookingsByStatus(
                                        "   "
                                )
                );

        assertEquals(
                "Booking status is required.",
                exception.getMessage()
        );
    }

    private Customer mockCustomer() {
        return mock(Customer.class);
    }

    private Venue mockAvailableVenue() {
    Venue venue = mock(Venue.class);

    lenient().when(venue.getVenueId())
            .thenReturn(1);

    lenient().when(venue.getAvailabilityStatus())
            .thenReturn("AVAILABLE");

    lenient().when(venue.getCapacity())
            .thenReturn(500);

    lenient().when(venue.getBasePrice())
            .thenReturn(
                    new BigDecimal("250000.00")
            );

    return venue;
}

    private EventBookingCreateRequest createRequest(
            Integer guestCount
    ) {
        return new EventBookingCreateRequest(
                1,
                1,
                LocalDate.of(2026, 12, 20),
                guestCount
        );
    }

    private EventBookingResponse mockResponse() {
        return mock(EventBookingResponse.class);
    }
}