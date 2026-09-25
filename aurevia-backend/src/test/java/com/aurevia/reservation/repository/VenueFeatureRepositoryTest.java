package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.VenueFeature;
import com.aurevia.reservation.entity.VenueFeatureId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class VenueFeatureRepositoryTest {

    @Autowired
    private VenueFeatureRepository venueFeatureRepository;

    @Test
    void shouldReadAllVenueFeatures() {
        long count = venueFeatureRepository.count();

        assertThat(count).isEqualTo(6);
    }

    @Test
    void shouldReadFeatureUsingCompositeId() {
        VenueFeatureId id = new VenueFeatureId(
                1,
                "Air Conditioning"
        );

        Optional<VenueFeature> result =
                venueFeatureRepository.findById(id);

        assertThat(result).isPresent();

        VenueFeature feature = result.orElseThrow();

        assertThat(feature.getVenue().getVenueId()).isEqualTo(1);
        assertThat(feature.getFeatureName())
                .isEqualTo("Air Conditioning");
    }

    @Test
    void shouldFindAllFeaturesForVenue() {
        List<VenueFeature> features =
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(1);

        assertThat(features)
                .extracting(VenueFeature::getFeatureName)
                .containsExactly(
                        "Air Conditioning",
                        "Professional Sound System"
                );
    }

    @Test
    void shouldFindFeatureByPartialName() {
        List<VenueFeature> features =
                venueFeatureRepository
                        .findByIdFeatureNameContainingIgnoreCase(
                                "projector"
                        );

        assertThat(features).hasSize(1);
        assertThat(features.getFirst().getVenue().getVenueId())
                .isEqualTo(3);
    }
}