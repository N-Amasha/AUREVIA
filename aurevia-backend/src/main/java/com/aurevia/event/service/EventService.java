package com.aurevia.event.service;

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
import org.springframework.stereotype.Service;
import com.aurevia.event.dto.CoordinatorEventCreateRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final EventBookingRepository eventBookingRepository;
    private final EventCoordinatorRepository coordinatorRepository;
    private final EventMapper eventMapper;

    public EventService(
            EventRepository eventRepository,
            EventBookingRepository eventBookingRepository,
            EventCoordinatorRepository coordinatorRepository,
            EventMapper eventMapper
    ) {
        this.eventRepository = eventRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.coordinatorRepository = coordinatorRepository;
        this.eventMapper = eventMapper;
    }

    @Transactional
    public EventResponse createEvent(EventCreateRequest request) {
        validateTimeRange(request);
        validateUnusedBooking(request.eventBookingId());

        EventBooking eventBooking =
                eventBookingRepository
                        .findById(request.eventBookingId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event booking",
                                        "eventBookingId",
                                        request.eventBookingId()
                                )
                        );

        EventCoordinator coordinator =
                coordinatorRepository
                        .findById(request.coordinatorId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event coordinator",
                                        "coordinatorId",
                                        request.coordinatorId()
                                )
                        );

        validateBookingDetails(request, eventBooking);

        Event event = new Event(
                eventBooking,
                coordinator,
                request.eventName().trim(),
                request.eventType().trim(),
                request.eventDate(),
                request.startTime(),
                request.endTime(),
                request.budget(),
                request.numberOfGuests(),
                "PLANNED"
        );

        return eventMapper.toResponse(
                eventRepository.save(event)
        );
    }


    @Transactional
    public EventResponse createEventForCoordinator(
            CoordinatorEventCreateRequest request,
            String coordinatorEmail
    ) {
        if (
                coordinatorEmail == null
                        || coordinatorEmail.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Authenticated coordinator email is required."
            );
        }

        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessRuleException(
                    "Event end time must be later than start time."
            );
        }

        validateUnusedBooking(request.eventBookingId());

        EventBooking eventBooking =
                eventBookingRepository
                        .findById(request.eventBookingId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event booking",
                                        "eventBookingId",
                                        request.eventBookingId()
                                )
                        );

        if (!"PENDING".equalsIgnoreCase(
                eventBooking.getBookingStatus()
        )) {
            throw new BusinessRuleException(
                    "Only pending event bookings can be accepted."
            );
        }

        EventCoordinator coordinator =
                coordinatorRepository
                        .findByEmployeeUserAccountEmailIgnoreCase(
                                coordinatorEmail
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event coordinator",
                                        "email",
                                        coordinatorEmail
                                )
                        );

        Event event = new Event(
                eventBooking,
                coordinator,
                request.eventName().trim(),
                request.eventType().trim(),
                eventBooking.getBookingDate(),
                request.startTime(),
                request.endTime(),
                request.budget(),
                eventBooking.getGuestCount(),
                "PLANNED"
        );

        Event savedEvent = eventRepository.save(event);

        eventBooking.setBookingStatus("CONFIRMED");
        eventBookingRepository.save(eventBooking);

        return eventMapper.toResponse(savedEvent);
    }


    public EventResponse getEventById(Integer eventId) {
        return eventMapper.toResponse(findEvent(eventId));
    }

    public List<EventResponse> getEventsByCoordinator(
            Integer coordinatorId
    ) {
        return eventRepository
                .findByCoordinatorEmployeeIdOrderByEventDateAsc(
                        coordinatorId
                )
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    public List<EventResponse> getEventsByStatus(
            String eventStatus
    ) {
        if (eventStatus == null || eventStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Event status is required."
            );
        }

        return eventRepository
                .findByEventStatusIgnoreCase(eventStatus.trim())
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    public List<EventResponse> getEventsBetweenDates(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required."
            );
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        return eventRepository
                .findByEventDateBetweenOrderByEventDateAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    private Event findEvent(Integer eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event",
                                "eventId",
                                eventId
                        )
                );
    }

    private void validateUnusedBooking(Integer eventBookingId) {
        if (eventRepository
                .findByEventBookingEventBookingId(eventBookingId)
                .isPresent()) {
            throw new BusinessRuleException(
                    "An event already exists for this event booking."
            );
        }
    }

    private void validateTimeRange(EventCreateRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessRuleException(
                    "Event end time must be later than start time."
            );
        }
    }

    private void validateBookingDetails(
            EventCreateRequest request,
            EventBooking eventBooking
    ) {
        if (!request.eventDate().equals(
                eventBooking.getBookingDate()
        )) {
            throw new BusinessRuleException(
                    "Event date must match the event booking date."
            );
        }

        if (request.numberOfGuests()
                > eventBooking.getGuestCount()) {
            throw new BusinessRuleException(
                    "Event guest count cannot exceed the booked guest count."
            );
        }
    }
}