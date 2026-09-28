package com.aurevia.event.controller;

import com.aurevia.event.dto.EventTimelineCreateRequest;
import com.aurevia.event.dto.EventTimelineResponse;
import com.aurevia.event.dto.EventTimelineStatusUpdateRequest;
import com.aurevia.event.service.EventTimelineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/event-timelines")
public class EventTimelineController {

    private final EventTimelineService timelineService;

    public EventTimelineController(
            EventTimelineService timelineService
    ) {
        this.timelineService = timelineService;
    }

    @PostMapping
    public ResponseEntity<EventTimelineResponse>
    createTimelineMilestone(
            @Valid @RequestBody
            EventTimelineCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        timelineService
                                .createTimelineMilestone(request)
                );
    }

    @GetMapping("/{timelineId}")
    public ResponseEntity<EventTimelineResponse>
    getTimelineById(
            @PathVariable Integer timelineId
    ) {
        return ResponseEntity.ok(
                timelineService.getTimelineById(timelineId)
        );
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<EventTimelineResponse>>
    getTimelineByEvent(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(
                timelineService.getTimelineByEvent(eventId)
        );
    }

    @GetMapping("/events/{eventId}/statuses/{status}")
    public ResponseEntity<List<EventTimelineResponse>>
    getTimelineByEventAndStatus(
            @PathVariable Integer eventId,
            @PathVariable String status
    ) {
        return ResponseEntity.ok(
                timelineService.getTimelineByEventAndStatus(
                        eventId,
                        status
                )
        );
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EventTimelineResponse>>
    getTimelineBetween(
            @RequestParam LocalDateTime startDateTime,
            @RequestParam LocalDateTime endDateTime
    ) {
        return ResponseEntity.ok(
                timelineService.getTimelineBetween(
                        startDateTime,
                        endDateTime
                )
        );
    }

    @PatchMapping("/{timelineId}/status")
    public ResponseEntity<EventTimelineResponse>
    updateTimelineStatus(
            @PathVariable Integer timelineId,
            @Valid @RequestBody
            EventTimelineStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(
                timelineService.updateTimelineStatus(
                        timelineId,
                        request
                )
        );
    }
}