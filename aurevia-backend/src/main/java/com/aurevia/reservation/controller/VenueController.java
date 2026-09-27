package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<VenueResponse> getVenueById(
            @PathVariable Integer venueId
    ) {
        return ResponseEntity.ok(
                venueService.getVenueById(venueId)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<VenueResponse>> getAvailableVenues(
            @RequestParam(required = false)
            Integer minimumCapacity
    ) {
        return ResponseEntity.ok(
                venueService.getAvailableVenues(minimumCapacity)
        );
    }

    @GetMapping("/types/{venueType}")
    public ResponseEntity<List<VenueResponse>> getVenuesByType(
            @PathVariable String venueType
    ) {
        return ResponseEntity.ok(
                venueService.getVenuesByType(venueType)
        );
    }
}