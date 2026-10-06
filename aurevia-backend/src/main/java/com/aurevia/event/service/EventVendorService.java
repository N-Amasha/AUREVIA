package com.aurevia.event.service;

import com.aurevia.event.dto.EventServiceCreateRequest;
import com.aurevia.event.dto.EventServiceResponse;
import com.aurevia.event.dto.EventServiceUpdateRequest;
import com.aurevia.event.entity.Event;
import com.aurevia.event.entity.EventService;
import com.aurevia.event.entity.Vendor;
import com.aurevia.event.mapper.EventServiceMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.event.repository.EventServiceRepository;
import com.aurevia.event.repository.VendorRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class EventVendorService {

    private static final Set<String> SERVICE_STATUSES =
            Set.of(
                    "PLANNED",
                    "CONFIRMED",
                    "COMPLETED",
                    "CANCELLED"
            );

    private final EventServiceRepository eventServiceRepository;
    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;
    private final EventServiceMapper eventServiceMapper;

    public EventVendorService(
            EventServiceRepository eventServiceRepository,
            EventRepository eventRepository,
            VendorRepository vendorRepository,
            EventServiceMapper eventServiceMapper
    ) {
        this.eventServiceRepository = eventServiceRepository;
        this.eventRepository = eventRepository;
        this.vendorRepository = vendorRepository;
        this.eventServiceMapper = eventServiceMapper;
    }

    @Transactional
    public EventServiceResponse createEventService(
            EventServiceCreateRequest request
    ) {
        validateTimeRange(
                request.startTime(),
                request.endTime()
        );

        Event event = findEvent(request.eventId());
        Vendor vendor = findVendor(request.vendorId());

        validateServiceDate(
                request.serviceDate(),
                event
        );

        validateCreateBudget(
                request.cost(),
                event
        );

        EventService eventService = new EventService(
                event,
                vendor,
                request.serviceName().trim(),
                request.serviceDate(),
                request.startTime(),
                request.endTime(),
                request.cost(),
                "PLANNED"
        );

        return eventServiceMapper.toResponse(
                eventServiceRepository.save(eventService)
        );
    }

    @Transactional
    public EventServiceResponse updateEventService(
            Integer eventServiceId,
            EventServiceUpdateRequest request
    ) {
        EventService eventService =
                findEventService(eventServiceId);

        if ("COMPLETED".equalsIgnoreCase(
                eventService.getServiceStatus()
        )) {
            throw new BusinessRuleException(
                    "Completed event services cannot be updated."
            );
        }

        validateTimeRange(
                request.startTime(),
                request.endTime()
        );

        Event event = eventService.getEvent();
        Vendor vendor = findVendor(request.vendorId());

        validateServiceDate(
                request.serviceDate(),
                event
        );

        validateUpdateBudget(
                request.cost(),
                eventService,
                event
        );

        String serviceStatus =
                normalizeStatus(request.serviceStatus());

        eventService.setVendor(vendor);
        eventService.setServiceName(
                request.serviceName().trim()
        );
        eventService.setServiceDate(
                request.serviceDate()
        );
        eventService.setStartTime(
                request.startTime()
        );
        eventService.setEndTime(
                request.endTime()
        );
        eventService.setCost(request.cost());
        eventService.setServiceStatus(serviceStatus);

        return eventServiceMapper.toResponse(
                eventServiceRepository.save(eventService)
        );
    }

    @Transactional
    public void deleteEventService(
            Integer eventServiceId
    ) {
        EventService eventService =
                findEventService(eventServiceId);

        if ("COMPLETED".equalsIgnoreCase(
                eventService.getServiceStatus()
        )) {
            throw new BusinessRuleException(
                    "Completed event services cannot be deleted."
            );
        }

        eventServiceRepository.delete(eventService);
    }

    public EventServiceResponse getEventServiceById(
            Integer eventServiceId
    ) {
        return eventServiceMapper.toResponse(
                findEventService(eventServiceId)
        );
    }

    public List<EventServiceResponse> getServicesByEvent(
            Integer eventId
    ) {
        return eventServiceRepository
                .findByEventEventIdOrderByServiceDateAscStartTimeAsc(
                        eventId
                )
                .stream()
                .map(eventServiceMapper::toResponse)
                .toList();
    }

    public List<EventServiceResponse> getServicesByVendor(
            Integer vendorId
    ) {
        return eventServiceRepository
                .findByVendorVendorId(vendorId)
                .stream()
                .map(eventServiceMapper::toResponse)
                .toList();
    }

    public List<EventServiceResponse> getServicesByStatus(
            String serviceStatus
    ) {
        String normalizedStatus =
                normalizeStatus(serviceStatus);

        return eventServiceRepository
                .findByServiceStatusIgnoreCase(
                        normalizedStatus
                )
                .stream()
                .map(eventServiceMapper::toResponse)
                .toList();
    }

    public BigDecimal getTotalServiceCost(Integer eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException(
                    "Event",
                    "eventId",
                    eventId
            );
        }

        return eventServiceRepository
                .calculateEventServiceCost(eventId);
    }

    private Event findEvent(Integer eventId) {
        return eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event",
                                "eventId",
                                eventId
                        )
                );
    }

    private Vendor findVendor(Integer vendorId) {
        return vendorRepository
                .findById(vendorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor",
                                "vendorId",
                                vendorId
                        )
                );
    }

    private EventService findEventService(
            Integer eventServiceId
    ) {
        return eventServiceRepository
                .findById(eventServiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event service",
                                "eventServiceId",
                                eventServiceId
                        )
                );
    }

    private void validateTimeRange(
            java.time.LocalTime startTime,
            java.time.LocalTime endTime
    ) {
        if (!endTime.isAfter(startTime)) {
            throw new BusinessRuleException(
                    "Service end time must be later than start time."
            );
        }
    }

    private void validateServiceDate(
            java.time.LocalDate serviceDate,
            Event event
    ) {
        if (!serviceDate.equals(event.getEventDate())) {
            throw new BusinessRuleException(
                    "Service date must match the event date."
            );
        }
    }

    private void validateCreateBudget(
            BigDecimal requestedCost,
            Event event
    ) {
        BigDecimal currentCost =
                eventServiceRepository
                        .calculateEventServiceCost(
                                event.getEventId()
                        );

        BigDecimal updatedCost =
                currentCost.add(requestedCost);

        if (updatedCost.compareTo(event.getBudget()) > 0) {
            throw new BusinessRuleException(
                    "Event service costs cannot exceed the event budget."
            );
        }
    }

    private void validateUpdateBudget(
            BigDecimal requestedCost,
            EventService eventService,
            Event event
    ) {
        BigDecimal otherServiceCost =
                eventServiceRepository
                        .calculateOtherServiceCost(
                                event.getEventId(),
                                eventService.getEventServiceId()
                        );

        BigDecimal updatedCost =
                otherServiceCost.add(requestedCost);

        if (updatedCost.compareTo(event.getBudget()) > 0) {
            throw new BusinessRuleException(
                    "Event service costs cannot exceed the event budget."
            );
        }
    }

    private String normalizeStatus(String serviceStatus) {
        if (serviceStatus == null
                || serviceStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Service status is required."
            );
        }

        String normalizedStatus =
                serviceStatus
                        .trim()
                        .toUpperCase(Locale.ROOT);

        if (!SERVICE_STATUSES.contains(
                normalizedStatus
        )) {
            throw new BusinessRuleException(
                    "Service status must be PLANNED, "
                            + "CONFIRMED, COMPLETED or CANCELLED."
            );
        }

        return normalizedStatus;
    }
}