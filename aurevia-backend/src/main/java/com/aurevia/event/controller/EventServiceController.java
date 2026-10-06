package com.aurevia.event.controller;

import com.aurevia.event.dto.EventServiceCreateRequest;
import com.aurevia.event.dto.EventServiceResponse;
import com.aurevia.event.dto.EventServiceUpdateRequest;
import com.aurevia.event.service.EventVendorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/event-services")
public class EventServiceController {

    private final EventVendorService eventVendorService;

    public EventServiceController(
            EventVendorService eventVendorService
    ) {
        this.eventVendorService = eventVendorService;
    }

    @PostMapping
    public ResponseEntity<EventServiceResponse>
    createEventService(
            @Valid @RequestBody
            EventServiceCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        eventVendorService
                                .createEventService(request)
                );
    }

    @PutMapping("/{eventServiceId}")
    public ResponseEntity<EventServiceResponse>
    updateEventService(
            @PathVariable Integer eventServiceId,
            @Valid @RequestBody
            EventServiceUpdateRequest request
    ) {
        return ResponseEntity.ok(
                eventVendorService.updateEventService(
                        eventServiceId,
                        request
                )
        );
    }

    @DeleteMapping("/{eventServiceId}")
    public ResponseEntity<Void> deleteEventService(
            @PathVariable Integer eventServiceId
    ) {
        eventVendorService.deleteEventService(
                eventServiceId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventServiceId}")
    public ResponseEntity<EventServiceResponse>
    getEventServiceById(
            @PathVariable Integer eventServiceId
    ) {
        return ResponseEntity.ok(
                eventVendorService
                        .getEventServiceById(eventServiceId)
        );
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<EventServiceResponse>>
    getServicesByEvent(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(
                eventVendorService.getServicesByEvent(eventId)
        );
    }

    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<List<EventServiceResponse>>
    getServicesByVendor(
            @PathVariable Integer vendorId
    ) {
        return ResponseEntity.ok(
                eventVendorService.getServicesByVendor(vendorId)
        );
    }

    @GetMapping("/statuses/{serviceStatus}")
    public ResponseEntity<List<EventServiceResponse>>
    getServicesByStatus(
            @PathVariable String serviceStatus
    ) {
        return ResponseEntity.ok(
                eventVendorService
                        .getServicesByStatus(serviceStatus)
        );
    }

    @GetMapping("/events/{eventId}/total-cost")
    public ResponseEntity<BigDecimal> getTotalServiceCost(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(
                eventVendorService.getTotalServiceCost(eventId)
        );
    }
}