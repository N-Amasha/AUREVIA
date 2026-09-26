package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.ReservationCreateRequest;
import com.aurevia.reservation.dto.ReservationResponse;
import com.aurevia.reservation.service.ReservationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@Validated
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationCreateRequest request
    ) {
        ReservationResponse response =
                reservationService.createReservation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable
            @Positive(
                    message = "Reservation ID must be greater than zero."
            )
            Integer reservationId
    ) {
        ReservationResponse response =
                reservationService.getReservationById(reservationId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<List<ReservationResponse>>
    getCustomerReservationHistory(
            @PathVariable
            @Positive(
                    message = "Customer ID must be greater than zero."
            )
            Integer customerId
    ) {
        List<ReservationResponse> responses =
                reservationService
                        .getCustomerReservationHistory(customerId);

        return ResponseEntity.ok(responses);
    }
}