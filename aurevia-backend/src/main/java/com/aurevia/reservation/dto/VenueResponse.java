package com.aurevia.reservation.dto;

import java.math.BigDecimal;
import java.util.List;

public record VenueResponse(
        Integer venueId,
        String venueName,
        String availabilityStatus,
        Integer capacity,
        String location,
        String venueType,
        BigDecimal basePrice,
        List<String> features
) {
}