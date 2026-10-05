package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.dto.EventBookingUpdateRequest;
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
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
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
        Customer customer = mock(Customer.class);
        Venue venue = mockAvailableVenue();
        EventBookingResponse expectedResponse =
                mockResponse();

        EventBookingCreateRequest request =
                createRequest(200);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(eventBookingRepository
                .findVenueBookingConflicts(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of());

        when(pricingRuleRepository
                .findApprovedRulesForDate(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of());

        when(eventBookingRepository
                .save(any(EventBooking.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(eventBookingMapper.toResponse(
                any(EventBooking.class)
        )).thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService
                        .createEventBooking(request);

        assertSame(expectedResponse, actualResponse);

        verify(eventBookingRepository)
                .save(any(EventBooking.class));
    }

    @Test
    void shouldCreateBookingUsingApprovedPricingRule() {
        Customer customer = mock(Customer.class);
        Venue venue = mockAvailableVenue();
        PricingRule pricingRule =
                mock(PricingRule.class);

        EventBookingCreateRequest request =
                createRequest(300);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(eventBookingRepository
                .findVenueBookingConflicts(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of());

        when(pricingRuleRepository
                .findApprovedRulesForDate(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of(pricingRule));

        when(pricingRule.getPrice())
                .thenReturn(
                        new BigDecimal("300000.00")
                );

        when(pricingRule.getSurcharge())
                .thenReturn(
                        new BigDecimal("50000.00")
                );

        when(eventBookingRepository
                .save(any(EventBooking.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        when(eventBookingMapper.toResponse(
                any(EventBooking.class)
        )).thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService
                        .createEventBooking(request);

        assertSame(expectedResponse, actualResponse);

        verify(eventBookingRepository)
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectBookingWhenCustomerDoesNotExist() {
        when(customerRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .createEventBooking(
                                createRequest(100)
                        )
        );

        verify(venueRepository, never())
                .findById(1);

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectBookingWhenVenueDoesNotExist() {
        when(customerRepository.findById(1))
                .thenReturn(Optional.of(
                        mock(Customer.class)
                ));

        when(venueRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .createEventBooking(
                                createRequest(100)
                        )
        );

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectUnavailableVenue() {
        Venue venue = mock(Venue.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(
                        mock(Customer.class)
                ));

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(venue.getAvailabilityStatus())
                .thenReturn("MAINTENANCE");

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(
                                        createRequest(100)
                                )
                );

        assertEquals(
                "The selected venue is not available.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectGuestCountAboveVenueCapacity() {
        when(customerRepository.findById(1))
                .thenReturn(Optional.of(
                        mock(Customer.class)
                ));

        Venue venue = mockAvailableVenue();

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(
                                        createRequest(501)
                                )
                );

        assertEquals(
                "Guest count exceeds the selected venue capacity.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectConflictingVenueBooking() {
        EventBookingCreateRequest request =
                createRequest(200);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(
                        mock(Customer.class)
                ));

        Venue venue = mockAvailableVenue();

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(eventBookingRepository
                .findVenueBookingConflicts(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of(
                        mock(EventBooking.class)
                ));

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventBookingService
                                .createEventBooking(request)
                );

        assertEquals(
                "The selected venue is already booked "
                        + "for the requested date.",
                exception.getMessage()
        );

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldUpdatePendingEventBooking() {
        EventBooking booking =
                mock(EventBooking.class);

        Venue venue = mockAvailableVenue();

        EventBookingUpdateRequest request =
                updateRequest();

        EventBookingResponse expectedResponse =
                mockResponse();

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("PENDING");

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(eventBookingRepository
                .findVenueBookingConflictsExcludingBooking(
                        1,
                        request.bookingDate(),
                        6
                ))
                .thenReturn(List.of());

        when(pricingRuleRepository
                .findApprovedRulesForDate(
                        1,
                        request.bookingDate()
                ))
                .thenReturn(List.of());

        when(eventBookingRepository.save(booking))
                .thenReturn(booking);

        when(eventBookingMapper.toResponse(booking))
                .thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService.updateEventBooking(
                        6,
                        request
                );

        assertSame(expectedResponse, actualResponse);

        verify(booking).setVenue(venue);

        verify(booking).setBookingDate(
                request.bookingDate()
        );

        verify(booking).setGuestCount(
                request.guestCount()
        );

        verify(booking).setTotalAmount(
                new BigDecimal("250000.00")
        );

        verify(eventBookingRepository)
                .save(booking);
    }

    @Test
    void shouldRejectUpdateForConfirmedBooking() {
        EventBooking booking =
                mock(EventBooking.class);

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("CONFIRMED");

        assertThrows(
                BusinessRuleException.class,
                () -> eventBookingService
                        .updateEventBooking(
                                6,
                                updateRequest()
                        )
        );

        verify(venueRepository, never())
                .findById(any());

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectConflictingEventBookingUpdate() {
        EventBooking booking =
                mock(EventBooking.class);

        EventBookingUpdateRequest request =
                updateRequest();

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("PENDING");

        Venue venue = mockAvailableVenue();

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(eventBookingRepository
                .findVenueBookingConflictsExcludingBooking(
                        1,
                        request.bookingDate(),
                        6
                ))
                .thenReturn(List.of(
                        mock(EventBooking.class)
                ));

        assertThrows(
                BusinessRuleException.class,
                () -> eventBookingService
                        .updateEventBooking(
                                6,
                                request
                        )
        );

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldCancelPendingEventBooking() {
        EventBooking booking =
                mock(EventBooking.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("PENDING");

        when(eventBookingRepository.save(booking))
                .thenReturn(booking);

        when(eventBookingMapper.toResponse(booking))
                .thenReturn(expectedResponse);

        EventBookingResponse actualResponse =
                eventBookingService
                        .cancelEventBooking(6);

        assertSame(expectedResponse, actualResponse);

        verify(booking)
                .setBookingStatus("CANCELLED");

        verify(eventBookingRepository)
                .save(booking);
    }

    @Test
    void shouldRejectCancellationForConfirmedBooking() {
        EventBooking booking =
                mock(EventBooking.class);

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("CONFIRMED");

        assertThrows(
                BusinessRuleException.class,
                () -> eventBookingService
                        .cancelEventBooking(6)
        );

        verify(booking, never())
                .setBookingStatus("CANCELLED");

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectUpdateForMissingBooking() {
        when(eventBookingRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .updateEventBooking(
                                99,
                                updateRequest()
                        )
        );
    }

    @Test
    void shouldRejectCancellationForMissingBooking() {
        when(eventBookingRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventBookingService
                        .cancelEventBooking(99)
        );
    }

    @Test
    void shouldReturnEventBookingById() {
        EventBooking booking =
                mock(EventBooking.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(eventBookingRepository.findById(1))
                .thenReturn(Optional.of(booking));

        when(eventBookingMapper.toResponse(booking))
                .thenReturn(expectedResponse);

        assertSame(
                expectedResponse,
                eventBookingService
                        .getEventBookingById(1)
        );
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

        when(eventBookingRepository
                .findByCustomerUserIdOrderByBookingDateDesc(
                        1
                ))
                .thenReturn(List.of(
                        firstBooking,
                        secondBooking
                ));

        when(eventBookingMapper
                .toResponse(firstBooking))
                .thenReturn(firstResponse);

        when(eventBookingMapper
                .toResponse(secondBooking))
                .thenReturn(secondResponse);

        assertEquals(
                List.of(
                        firstResponse,
                        secondResponse
                ),
                eventBookingService
                        .getCustomerEventBookings(1)
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

        verify(eventBookingRepository, never())
                .findByCustomerUserIdOrderByBookingDateDesc(
                        99
                );
    }

    @Test
    void shouldReturnBookingsByTrimmedStatus() {
        EventBooking booking =
                mock(EventBooking.class);

        EventBookingResponse expectedResponse =
                mockResponse();

        when(eventBookingRepository
                .findByBookingStatusIgnoreCase(
                        "CONFIRMED"
                ))
                .thenReturn(List.of(booking));

        when(eventBookingMapper.toResponse(booking))
                .thenReturn(expectedResponse);

        assertEquals(
                List.of(expectedResponse),
                eventBookingService
                        .getEventBookingsByStatus(
                                " CONFIRMED "
                        )
        );
    }

    @Test
    void shouldRejectBlankBookingStatus() {
        assertThrows(
                IllegalArgumentException.class,
                () -> eventBookingService
                        .getEventBookingsByStatus(" ")
        );
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

    private EventBookingUpdateRequest updateRequest() {
        return new EventBookingUpdateRequest(
                1,
                LocalDate.of(2026, 12, 21),
                150
        );
    }

    private EventBookingResponse mockResponse() {
        return mock(EventBookingResponse.class);
    }
}
