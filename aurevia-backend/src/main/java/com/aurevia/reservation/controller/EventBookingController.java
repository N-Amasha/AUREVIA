package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.dto.EventBookingUpdateRequest;
import com.aurevia.reservation.service.EventBookingService;
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

import java.util.List;

@RestController
@RequestMapping("/api/event-bookings")
public class EventBookingController {

    private final EventBookingService eventBookingService;

    public EventBookingController(
            EventBookingService eventBookingService
    ) {
        this.eventBookingService = eventBookingService;
    }

    @PostMapping
    public ResponseEntity<EventBookingResponse> createEventBooking(
            @Valid
            @RequestBody
            EventBookingCreateRequest request
    ) {
        EventBookingResponse response =
                eventBookingService.createEventBooking(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{eventBookingId}")
    public ResponseEntity<EventBookingResponse> updateEventBooking(
            @PathVariable Integer eventBookingId,
            @Valid
            @RequestBody
            EventBookingUpdateRequest request
    ) {
        return ResponseEntity.ok(
                eventBookingService.updateEventBooking(
                        eventBookingId,
                        request
                )
        );
    }

    @DeleteMapping("/{eventBookingId}")
    public ResponseEntity<EventBookingResponse> cancelEventBooking(
            @PathVariable Integer eventBookingId
    ) {
        return ResponseEntity.ok(
                eventBookingService.cancelEventBooking(
                        eventBookingId
                )
        );
    }

    @GetMapping("/{eventBookingId}")
    public ResponseEntity<EventBookingResponse>
    getEventBookingById(
            @PathVariable Integer eventBookingId
    ) {
        return ResponseEntity.ok(
                eventBookingService
                        .getEventBookingById(
                                eventBookingId
                        )
        );
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<List<EventBookingResponse>>
    getCustomerEventBookings(
            @PathVariable Integer customerId
    ) {
        return ResponseEntity.ok(
                eventBookingService
                        .getCustomerEventBookings(
                                customerId
                        )
        );
    }

    @GetMapping("/statuses/{bookingStatus}")
    public ResponseEntity<List<EventBookingResponse>>
    getEventBookingsByStatus(
            @PathVariable String bookingStatus
    ) {
        return ResponseEntity.ok(
                eventBookingService
                        .getEventBookingsByStatus(
                                bookingStatus
                        )
        );
    }
}