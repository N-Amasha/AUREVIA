package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.VenueRequest;
import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.entity.VenueFeature;
import com.aurevia.reservation.mapper.VenueMapper;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.reservation.repository.PricingRuleRepository;
import com.aurevia.reservation.repository.VenueFeatureRepository;
import com.aurevia.reservation.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class VenueService {

    private static final Set<String>
            ALLOWED_AVAILABILITY_STATUSES =
            Set.of("AVAILABLE", "MAINTENANCE");

    private final VenueRepository venueRepository;
    private final VenueFeatureRepository
            venueFeatureRepository;
    private final EventBookingRepository
            eventBookingRepository;
    private final PricingRuleRepository
            pricingRuleRepository;
    private final VenueMapper venueMapper;

    public VenueService(
            VenueRepository venueRepository,
            VenueFeatureRepository venueFeatureRepository,
            EventBookingRepository eventBookingRepository,
            PricingRuleRepository pricingRuleRepository,
            VenueMapper venueMapper
    ) {
        this.venueRepository = venueRepository;
        this.venueFeatureRepository =
                venueFeatureRepository;
        this.eventBookingRepository =
                eventBookingRepository;
        this.pricingRuleRepository =
                pricingRuleRepository;
        this.venueMapper = venueMapper;
    }

    public List<VenueResponse> getAllVenues() {
        return venueRepository
                .findAll()
                .stream()
                .sorted(
                        (first, second) ->
                                first.getVenueName()
                                        .compareToIgnoreCase(
                                                second.getVenueName()
                                        )
                )
                .map(this::mapVenue)
                .toList();
    }

    public VenueResponse getVenueById(
            Integer venueId
    ) {
        return mapVenue(findVenue(venueId));
    }

    @Transactional
    public VenueResponse createVenue(
            VenueRequest request
    ) {
        String venueName =
                request.venueName().trim();

        validateUniqueVenueName(
                venueName,
                null
        );

        Venue venue = new Venue(
                venueName,
                normalizeAvailabilityStatus(
                        request.availabilityStatus()
                ),
                request.capacity(),
                request.location().trim(),
                normalizeVenueType(
                        request.venueType()
                ),
                request.basePrice()
        );

        return mapVenue(
                venueRepository.save(venue)
        );
    }

    @Transactional
    public VenueResponse updateVenue(
            Integer venueId,
            VenueRequest request
    ) {
        Venue venue = findVenue(venueId);
        String venueName =
                request.venueName().trim();

        validateUniqueVenueName(
                venueName,
                venueId
        );

        venue.setVenueName(venueName);
        venue.setAvailabilityStatus(
                normalizeAvailabilityStatus(
                        request.availabilityStatus()
                )
        );
        venue.setCapacity(request.capacity());
        venue.setLocation(
                request.location().trim()
        );
        venue.setVenueType(
                normalizeVenueType(
                        request.venueType()
                )
        );
        venue.setBasePrice(request.basePrice());

        return mapVenue(
                venueRepository.save(venue)
        );
    }

    @Transactional
    public void deleteVenue(Integer venueId) {
        Venue venue = findVenue(venueId);

        boolean hasBookings =
                eventBookingRepository
                        .existsByVenueVenueId(venueId);

        boolean hasPricingRules =
                pricingRuleRepository
                        .existsByVenueVenueId(venueId);

        boolean hasFeatures =
                venueFeatureRepository
                        .existsByVenueVenueId(venueId);

        if (hasBookings
                || hasPricingRules
                || hasFeatures) {
            throw new BusinessRuleException(
                    "A venue with booking, pricing-rule "
                            + "or feature history cannot be deleted."
            );
        }

        venueRepository.delete(venue);
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

        return venues
                .stream()
                .map(this::mapVenue)
                .toList();
    }

    public List<VenueResponse> getVenuesByType(
            String venueType
    ) {
        if (venueType == null
                || venueType.isBlank()) {
            throw new IllegalArgumentException(
                    "Venue type is required."
            );
        }

        return venueRepository
                .findByVenueTypeIgnoreCase(
                        venueType.trim()
                )
                .stream()
                .map(this::mapVenue)
                .toList();
    }

    private Venue findVenue(Integer venueId) {
        return venueRepository
                .findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                venueId
                        )
                );
    }

    private void validateUniqueVenueName(
            String venueName,
            Integer currentVenueId
    ) {
        venueRepository
                .findByVenueNameIgnoreCase(
                        venueName
                )
                .filter(existingVenue ->
                        currentVenueId == null
                                || !existingVenue
                                .getVenueId()
                                .equals(currentVenueId)
                )
                .ifPresent(existingVenue -> {
                    throw new BusinessRuleException(
                            "A venue with this name "
                                    + "already exists."
                    );
                });
    }

    private String normalizeAvailabilityStatus(
            String status
    ) {
        String normalizedStatus =
                status.trim()
                        .toUpperCase(Locale.ROOT);

        if (!ALLOWED_AVAILABILITY_STATUSES
                .contains(normalizedStatus)) {
            throw new BusinessRuleException(
                    "Venue availability status must be "
                            + "AVAILABLE or MAINTENANCE."
            );
        }

        return normalizedStatus;
    }

    private String normalizeVenueType(
            String venueType
    ) {
        return venueType
                .trim()
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);
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

        return venueMapper.toResponse(
                venue,
                features
        );
    }
}