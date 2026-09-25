package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.VenueFeature;
import com.aurevia.reservation.entity.VenueFeatureId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueFeatureRepository
        extends JpaRepository<VenueFeature, VenueFeatureId> {

    List<VenueFeature>
    findByVenueVenueIdOrderByIdFeatureNameAsc(Integer venueId);

    List<VenueFeature>
    findByIdFeatureNameContainingIgnoreCase(String featureName);
}