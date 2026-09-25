package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VenueRepository extends JpaRepository<Venue, Integer> {

    Optional<Venue> findByVenueNameIgnoreCase(String venueName);

    List<Venue> findByAvailabilityStatusIgnoreCase(
            String availabilityStatus
    );

    List<Venue>
    findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
            String availabilityStatus,
            Integer capacity
    );

    List<Venue> findByVenueTypeIgnoreCase(String venueType);
}