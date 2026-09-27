package com.aurevia.reservation.mapper;

import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.entity.Venue;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VenueMapper {

    public VenueResponse toResponse(
            Venue venue,
            List<String> features
    ) {
        return new VenueResponse(
                venue.getVenueId(),
                venue.getVenueName(),
                venue.getAvailabilityStatus(),
                venue.getCapacity(),
                venue.getLocation(),
                venue.getVenueType(),
                venue.getBasePrice(),
                List.copyOf(features)
        );
    }
}