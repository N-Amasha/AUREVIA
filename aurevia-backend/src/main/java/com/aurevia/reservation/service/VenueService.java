package com.aurevia.reservation.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.entity.VenueFeature;
import com.aurevia.reservation.mapper.VenueMapper;
import com.aurevia.reservation.repository.VenueFeatureRepository;
import com.aurevia.reservation.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VenueService {

    private final VenueRepository venueRepository;
    private final VenueFeatureRepository venueFeatureRepository;
    private final VenueMapper venueMapper;

    public VenueService(
            VenueRepository venueRepository,
            VenueFeatureRepository venueFeatureRepository,
            VenueMapper venueMapper
    ) {
        this.venueRepository = venueRepository;
        this.venueFeatureRepository = venueFeatureRepository;
        this.venueMapper = venueMapper;
    }

    public VenueResponse getVenueById(Integer venueId) {
        Venue venue = findVenue(venueId);
        return mapVenue(venue);
    }

    public List<VenueResponse> getAvailableVenues(
            Integer minimumCapacity
    ) {
        List<Venue> venues;

        if (minimumCapacity == null) {
            venues =
                    venueRepository
                            .findByAvailabilityStatusIgnoreCase(
                                    "AVAILABLE"
                            );
        } else {
            if (minimumCapacity <= 0) {
                throw new IllegalArgumentException(
                        "Minimum capacity must be positive."
                );
            }

            venues =
                    venueRepository
                            .findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
                                    "AVAILABLE",
                                    minimumCapacity
                            );
        }

        return venues.stream()
                .map(this::mapVenue)
                .toList();
    }

    public List<VenueResponse> getVenuesByType(
            String venueType
    ) {
        if (venueType == null || venueType.isBlank()) {
            throw new IllegalArgumentException(
                    "Venue type is required."
            );
        }

        return venueRepository
                .findByVenueTypeIgnoreCase(venueType.trim())
                .stream()
                .map(this::mapVenue)
                .toList();
    }

    private Venue findVenue(Integer venueId) {
        return venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                venueId
                        )
                );
    }

    private VenueResponse mapVenue(Venue venue) {
        List<String> features =
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(
                                venue.getVenueId()
                        )
                        .stream()
                        .map(VenueFeature::getFeatureName)
                        .toList();

        return venueMapper.toResponse(venue, features);
    }
}