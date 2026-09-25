package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.Venue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class VenueRepositoryTest {

    @Autowired
    private VenueRepository venueRepository;

    @Test
    void shouldReadAllVenues() {
        long count = venueRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldFindVenueByName() {
        Optional<Venue> result =
                venueRepository
                        .findByVenueNameIgnoreCase("grand ballroom");

        assertThat(result).isPresent();

        Venue venue = result.orElseThrow();

        assertThat(venue.getVenueId()).isEqualTo(1);
        assertThat(venue.getAvailabilityStatus())
                .isEqualTo("AVAILABLE");
        assertThat(venue.getCapacity()).isEqualTo(500);
        assertThat(venue.getLocation()).isEqualTo("Ground Floor");
        assertThat(venue.getVenueType()).isEqualTo("BALLROOM");
        assertThat(venue.getBasePrice())
                .isEqualByComparingTo(new BigDecimal("250000.00"));
    }

    @Test
    void shouldFindAvailableVenuesWithRequiredCapacity() {
        List<Venue> venues =
                venueRepository
                        .findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
                                "available",
                                150
                        );

        assertThat(venues)
                .extracting(Venue::getVenueName)
                .containsExactlyInAnyOrder(
                        "Grand Ballroom",
                        "Garden Pavilion",
                        "Rooftop Terrace"
                );
    }

    @Test
    void shouldFindVenueByType() {
        List<Venue> venues =
                venueRepository.findByVenueTypeIgnoreCase("conference");

        assertThat(venues).hasSize(1);
        assertThat(venues.getFirst().getVenueId()).isEqualTo(3);
    }
}