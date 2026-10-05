package com.aurevia.event.controller;

import com.aurevia.event.dto.EventCreateRequest;
import com.aurevia.event.dto.EventResponse;
import com.aurevia.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.aurevia.event.dto.CoordinatorEventCreateRequest;
import java.security.Principal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(eventService.createEvent(request));
    }

    @PostMapping("/from-booking")
    public ResponseEntity<EventResponse>
    createEventFromBooking(
            @Valid
            @RequestBody
            CoordinatorEventCreateRequest request,
            Principal principal
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        eventService
                                .createEventForCoordinator(
                                        request,
                                        principal.getName()
                                )
                );
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(
                eventService.getEventById(eventId)
        );
    }

    @GetMapping("/coordinators/{coordinatorId}")
    public ResponseEntity<List<EventResponse>>
    getEventsByCoordinator(
            @PathVariable Integer coordinatorId
    ) {
        return ResponseEntity.ok(
                eventService.getEventsByCoordinator(coordinatorId)
        );
    }

    @GetMapping("/statuses/{eventStatus}")
    public ResponseEntity<List<EventResponse>> getEventsByStatus(
            @PathVariable String eventStatus
    ) {
        return ResponseEntity.ok(
                eventService.getEventsByStatus(eventStatus)
        );
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EventResponse>>
    getEventsBetweenDates(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return ResponseEntity.ok(
                eventService.getEventsBetweenDates(
                        startDate,
                        endDate
                )
        );
    }
}