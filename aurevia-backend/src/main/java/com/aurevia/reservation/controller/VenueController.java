package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.VenueRequest;
import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.service.VenueService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@Validated
public class VenueController {

    private final VenueService venueService;

    public VenueController(
            VenueService venueService
    ) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<List<VenueResponse>>
    getAllVenues() {
        return ResponseEntity.ok(
                venueService.getAllVenues()
        );
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<VenueResponse>
    getVenueById(
            @PathVariable
            @Positive(
                    message =
                            "Venue ID must be greater than zero."
            )
            Integer venueId
    ) {
        return ResponseEntity.ok(
                venueService.getVenueById(venueId)
        );
    }

    @PostMapping
    public ResponseEntity<VenueResponse>
    createVenue(
            @Valid
            @RequestBody
            VenueRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        venueService
                                .createVenue(request)
                );
    }

    @PutMapping("/{venueId}")
    public ResponseEntity<VenueResponse>
    updateVenue(
            @PathVariable
            @Positive(
                    message =
                            "Venue ID must be greater than zero."
            )
            Integer venueId,

            @Valid
            @RequestBody
            VenueRequest request
    ) {
        return ResponseEntity.ok(
                venueService.updateVenue(
                        venueId,
                        request
                )
        );
    }

    @DeleteMapping("/{venueId}")
    public ResponseEntity<Void> deleteVenue(
            @PathVariable
            @Positive(
                    message =
                            "Venue ID must be greater than zero."
            )
            Integer venueId
    ) {
        venueService.deleteVenue(venueId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<VenueResponse>>
    getAvailableVenues(
            @RequestParam(required = false)
            Integer minimumCapacity
    ) {
        return ResponseEntity.ok(
                venueService.getAvailableVenues(
                        minimumCapacity
                )
        );
    }

    @GetMapping("/types/{venueType}")
    public ResponseEntity<List<VenueResponse>>
    getVenuesByType(
            @PathVariable String venueType
    ) {
        return ResponseEntity.ok(
                venueService.getVenuesByType(
                        venueType
                )
        );
    }
}