package com.aurevia.event.service;

import com.aurevia.event.dto.EventServiceCreateRequest;
import com.aurevia.event.dto.EventServiceResponse;
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

@Service
@Transactional(readOnly = true)
public class EventVendorService {

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
        validateTimeRange(request);

        Event event = eventRepository
                .findById(request.eventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event",
                                "eventId",
                                request.eventId()
                        )
                );

        Vendor vendor = vendorRepository
                .findById(request.vendorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor",
                                "vendorId",
                                request.vendorId()
                        )
                );

        validateServiceDate(request, event);
        validateBudget(request, event);

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

    public EventServiceResponse getEventServiceById(
            Integer eventServiceId
    ) {
        EventService eventService =
                eventServiceRepository
                        .findById(eventServiceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Event service",
                                        "eventServiceId",
                                        eventServiceId
                                )
                        );

        return eventServiceMapper.toResponse(eventService);
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
        if (serviceStatus == null || serviceStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Service status is required."
            );
        }

        return eventServiceRepository
                .findByServiceStatusIgnoreCase(
                        serviceStatus.trim()
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

    private void validateTimeRange(
            EventServiceCreateRequest request
    ) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessRuleException(
                    "Service end time must be later than start time."
            );
        }
    }

    private void validateServiceDate(
            EventServiceCreateRequest request,
            Event event
    ) {
        if (!request.serviceDate().equals(event.getEventDate())) {
            throw new BusinessRuleException(
                    "Service date must match the event date."
            );
        }
    }

    private void validateBudget(
            EventServiceCreateRequest request,
            Event event
    ) {
        BigDecimal currentCost =
                eventServiceRepository
                        .calculateEventServiceCost(
                                event.getEventId()
                        );

        if (currentCost.add(request.cost())
                .compareTo(event.getBudget()) > 0) {
            throw new BusinessRuleException(
                    "Event service costs cannot exceed the event budget."
            );
        }
    }
}