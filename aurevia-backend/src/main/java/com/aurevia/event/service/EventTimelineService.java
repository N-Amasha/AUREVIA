package com.aurevia.event.service;

import com.aurevia.event.dto.EventTimelineCreateRequest;
import com.aurevia.event.dto.EventTimelineResponse;
import com.aurevia.event.dto.EventTimelineStatusUpdateRequest;
import com.aurevia.event.entity.Event;
import com.aurevia.event.entity.EventTimeline;
import com.aurevia.event.mapper.EventTimelineMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.event.repository.EventTimelineRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class EventTimelineService {

    private static final Set<String> ALLOWED_STATUSES =
            Set.of(
                    "PENDING",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELLED"
            );

    private final EventTimelineRepository timelineRepository;
    private final EventRepository eventRepository;
    private final EventTimelineMapper timelineMapper;

    public EventTimelineService(
            EventTimelineRepository timelineRepository,
            EventRepository eventRepository,
            EventTimelineMapper timelineMapper
    ) {
        this.timelineRepository = timelineRepository;
        this.eventRepository = eventRepository;
        this.timelineMapper = timelineMapper;
    }

    @Transactional
    public EventTimelineResponse createTimelineMilestone(
            EventTimelineCreateRequest request
    ) {
        Event event = eventRepository
                .findById(request.eventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event",
                                "eventId",
                                request.eventId()
                        )
                );

        EventTimeline timeline = new EventTimeline(
                event,
                request.milestoneName().trim(),
                normalizeDescription(request.description()),
                request.scheduledDate(),
                "PENDING"
        );

        return timelineMapper.toResponse(
                timelineRepository.saveAndFlush(timeline)
        );
    }

    public EventTimelineResponse getTimelineById(
            Integer timelineId
    ) {
        return timelineMapper.toResponse(
                findTimeline(timelineId)
        );
    }

    public List<EventTimelineResponse> getTimelineByEvent(
            Integer eventId
    ) {
        return timelineRepository
                .findByEventEventIdOrderByScheduledDateAsc(eventId)
                .stream()
                .map(timelineMapper::toResponse)
                .toList();
    }

    public List<EventTimelineResponse>
    getTimelineByEventAndStatus(
            Integer eventId,
            String status
    ) {
        String normalizedStatus = normalizeStatus(status);

        return timelineRepository
                .findByEventEventIdAndStatusIgnoreCaseOrderByScheduledDateAsc(
                        eventId,
                        normalizedStatus
                )
                .stream()
                .map(timelineMapper::toResponse)
                .toList();
    }

    public List<EventTimelineResponse> getTimelineBetween(
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    ) {
        if (startDateTime == null || endDateTime == null) {
            throw new IllegalArgumentException(
                    "Start and end date-times are required."
            );
        }

        if (endDateTime.isBefore(startDateTime)) {
            throw new IllegalArgumentException(
                    "End date-time cannot be before start date-time."
            );
        }

        return timelineRepository
                .findByScheduledDateBetweenOrderByScheduledDateAsc(
                        startDateTime,
                        endDateTime
                )
                .stream()
                .map(timelineMapper::toResponse)
                .toList();
    }

    @Transactional
    public EventTimelineResponse updateTimelineStatus(
            Integer timelineId,
            EventTimelineStatusUpdateRequest request
    ) {
        EventTimeline timeline = findTimeline(timelineId);
        String normalizedStatus =
                normalizeStatus(request.status());

        timeline.setStatus(normalizedStatus);

        return timelineMapper.toResponse(
                timelineRepository.saveAndFlush(timeline)
        );
    }

    private EventTimeline findTimeline(Integer timelineId) {
        return timelineRepository.findById(timelineId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event timeline",
                                "timelineId",
                                timelineId
                        )
                );
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Timeline status is required."
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new BusinessRuleException(
                    "Unsupported timeline status: "
                            + normalizedStatus
            );
        }

        return normalizedStatus;
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }
}