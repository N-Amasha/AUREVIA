package com.aurevia.event.service;

import com.aurevia.event.dto.CoordinatorEventCreateRequest;
import com.aurevia.event.dto.EventCreateRequest;
import com.aurevia.event.dto.EventResponse;
import com.aurevia.event.entity.Event;
import com.aurevia.event.mapper.EventMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.user.entity.EventCoordinator;
import com.aurevia.user.repository.EventCoordinatorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventBookingRepository eventBookingRepository;

    @Mock
    private EventCoordinatorRepository coordinatorRepository;

    @Mock
    private EventMapper eventMapper;

    private EventService eventService;

    @BeforeEach
    void setUp() {
        eventService = new EventService(
                eventRepository,
                eventBookingRepository,
                coordinatorRepository,
                eventMapper
        );
    }

    @Test
    void shouldCreateEvent() {
        EventCreateRequest request = request();
        EventBooking booking = mock(EventBooking.class);
        EventCoordinator coordinator =
                mock(EventCoordinator.class);
        Event savedEvent = mock(Event.class);
        EventResponse response = response();

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(coordinatorRepository.findById(6))
                .thenReturn(Optional.of(coordinator));

        when(booking.getBookingDate())
                .thenReturn(request.eventDate());

        when(booking.getGuestCount())
                .thenReturn(200);

        when(eventRepository.save(any(Event.class)))
                .thenReturn(savedEvent);

        when(eventMapper.toResponse(savedEvent))
                .thenReturn(response);

        assertEquals(
                response,
                eventService.createEvent(request)
        );
    }

    @Test
    void shouldRejectInvalidTimeRange() {
        EventCreateRequest request = new EventCreateRequest(
                6,
                6,
                "Test Event",
                "CORPORATE",
                LocalDate.of(2026, 12, 20),
                LocalTime.of(20, 0),
                LocalTime.of(18, 0),
                new BigDecimal("100000.00"),
                100
        );

        assertThrows(
                BusinessRuleException.class,
                () -> eventService.createEvent(request)
        );
    }

    @Test
    void shouldRejectBookingAlreadyLinkedToEvent() {
        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.of(mock(Event.class)));

        assertThrows(
                BusinessRuleException.class,
                () -> eventService.createEvent(request())
        );
    }

    @Test
    void shouldRejectMissingEventBooking() {
        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventService.createEvent(request())
        );
    }

    @Test
    void shouldRejectMismatchedEventDate() {
        EventBooking booking = mock(EventBooking.class);

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(coordinatorRepository.findById(6))
                .thenReturn(Optional.of(
                        mock(EventCoordinator.class)
                ));

        when(booking.getBookingDate())
                .thenReturn(LocalDate.of(2026, 12, 21));

        assertThrows(
                BusinessRuleException.class,
                () -> eventService.createEvent(request())
        );
    }

    @Test
    void shouldRejectGuestCountAboveBookedCount() {
        EventBooking booking = mock(EventBooking.class);

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(coordinatorRepository.findById(6))
                .thenReturn(Optional.of(
                        mock(EventCoordinator.class)
                ));

        when(booking.getBookingDate())
                .thenReturn(LocalDate.of(2026, 12, 20));

        when(booking.getGuestCount())
                .thenReturn(50);

        assertThrows(
                BusinessRuleException.class,
                () -> eventService.createEvent(request())
        );
    }

    @Test
    void shouldCreateEventFromPendingBookingForAuthenticatedCoordinator() {
        CoordinatorEventCreateRequest request =
                coordinatorRequest();

        EventBooking booking = mock(EventBooking.class);
        EventCoordinator coordinator =
                mock(EventCoordinator.class);
        Event savedEvent = mock(Event.class);
        EventResponse expectedResponse = response();

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("PENDING");

        when(booking.getBookingDate())
                .thenReturn(LocalDate.of(2026, 12, 20));

        when(booking.getGuestCount())
                .thenReturn(100);

        when(coordinatorRepository
                .findByEmployeeUserAccountEmailIgnoreCase(
                        "coordinator1@aurevia.test"
                ))
                .thenReturn(Optional.of(coordinator));

        when(eventRepository.save(any(Event.class)))
                .thenReturn(savedEvent);

        when(eventMapper.toResponse(savedEvent))
                .thenReturn(expectedResponse);

        EventResponse actualResponse =
                eventService.createEventForCoordinator(
                        request,
                        "coordinator1@aurevia.test"
                );

        assertEquals(expectedResponse, actualResponse);

        verify(eventRepository)
                .save(any(Event.class));

        verify(booking)
                .setBookingStatus("CONFIRMED");

        verify(eventBookingRepository)
                .save(booking);
    }

    @Test
    void shouldRejectCoordinatorEventWhenBookingIsNotPending() {
        EventBooking booking = mock(EventBooking.class);

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("CANCELLED");

        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> eventService
                                .createEventForCoordinator(
                                        coordinatorRequest(),
                                        "coordinator1@aurevia.test"
                                )
                );

        assertEquals(
                "Only pending event bookings can be accepted.",
                exception.getMessage()
        );

        verify(
                coordinatorRepository,
                never()
        ).findByEmployeeUserAccountEmailIgnoreCase(any());

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectCoordinatorEventWhenCoordinatorDoesNotExist() {
        EventBooking booking = mock(EventBooking.class);

        when(eventRepository
                .findByEventBookingEventBookingId(6))
                .thenReturn(Optional.empty());

        when(eventBookingRepository.findById(6))
                .thenReturn(Optional.of(booking));

        when(booking.getBookingStatus())
                .thenReturn("PENDING");

        when(coordinatorRepository
                .findByEmployeeUserAccountEmailIgnoreCase(
                        "missing@aurevia.test"
                ))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventService.createEventForCoordinator(
                        coordinatorRequest(),
                        "missing@aurevia.test"
                )
        );

        verify(eventRepository, never())
                .save(any(Event.class));

        verify(eventBookingRepository, never())
                .save(any(EventBooking.class));
    }

    @Test
    void shouldRejectCoordinatorEventWithoutAuthenticatedEmail() {
        assertThrows(
                IllegalArgumentException.class,
                () -> eventService.createEventForCoordinator(
                        coordinatorRequest(),
                        " "
                )
        );

        verify(eventRepository, never())
                .save(any(Event.class));
    }

    @Test
    void shouldRejectCoordinatorEventWithInvalidTimeRange() {
        CoordinatorEventCreateRequest request =
                new CoordinatorEventCreateRequest(
                        6,
                        "Invalid Event",
                        "BIRTHDAY",
                        LocalTime.of(20, 0),
                        LocalTime.of(18, 0),
                        new BigDecimal("300000.00")
                );

        assertThrows(
                BusinessRuleException.class,
                () -> eventService.createEventForCoordinator(
                        request,
                        "coordinator1@aurevia.test"
                )
        );

        verify(eventRepository, never())
                .save(any(Event.class));
    }

    @Test
    void shouldReturnEventById() {
        Event event = mock(Event.class);
        EventResponse response = response();

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));

        when(eventMapper.toResponse(event))
                .thenReturn(response);

        assertEquals(
                response,
                eventService.getEventById(1)
        );
    }

    @Test
    void shouldReturnEventsByCoordinator() {
        Event event = mock(Event.class);
        EventResponse response = response();

        when(eventRepository
                .findByCoordinatorEmployeeIdOrderByEventDateAsc(6))
                .thenReturn(List.of(event));

        when(eventMapper.toResponse(event))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                eventService.getEventsByCoordinator(6)
        );
    }

    @Test
    void shouldReturnEventsByStatus() {
        Event event = mock(Event.class);
        EventResponse response = response();

        when(eventRepository
                .findByEventStatusIgnoreCase("PLANNED"))
                .thenReturn(List.of(event));

        when(eventMapper.toResponse(event))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                eventService.getEventsByStatus(" PLANNED ")
        );
    }

    @Test
    void shouldReturnEventsBetweenDates() {
        LocalDate start =
                LocalDate.of(2026, 12, 1);

        LocalDate end =
                LocalDate.of(2026, 12, 31);

        Event event = mock(Event.class);
        EventResponse response = response();

        when(eventRepository
                .findByEventDateBetweenOrderByEventDateAsc(
                        start,
                        end
                ))
                .thenReturn(List.of(event));

        when(eventMapper.toResponse(event))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                eventService.getEventsBetweenDates(start, end)
        );

        verify(eventRepository)
                .findByEventDateBetweenOrderByEventDateAsc(
                        start,
                        end
                );
    }

    @Test
    void shouldRejectInvalidDateRange() {
        assertThrows(
                IllegalArgumentException.class,
                () -> eventService.getEventsBetweenDates(
                        LocalDate.of(2026, 12, 31),
                        LocalDate.of(2026, 12, 1)
                )
        );
    }

    private EventCreateRequest request() {
        return new EventCreateRequest(
                6,
                6,
                "Test Corporate Event",
                "CORPORATE",
                LocalDate.of(2026, 12, 20),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                new BigDecimal("100000.00"),
                100
        );
    }

    private CoordinatorEventCreateRequest coordinatorRequest() {
        return new CoordinatorEventCreateRequest(
                6,
                "Test Corporate Event",
                "CORPORATE",
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                new BigDecimal("100000.00")
        );
    }

    private EventResponse response() {
        return new EventResponse(
                6,
                6,
                6,
                "Event Coordinator",
                "Test Corporate Event",
                "CORPORATE",
                LocalDate.of(2026, 12, 20),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                new BigDecimal("100000.00"),
                100,
                "PLANNED"
        );
    }
}