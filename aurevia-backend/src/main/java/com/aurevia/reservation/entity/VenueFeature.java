package com.aurevia.reservation.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "venue_feature")
public class VenueFeature {

    @EmbeddedId
    private VenueFeatureId id;

    @MapsId("venueId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "venue_id",
            referencedColumnName = "venue_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_venue_feature_venue")
    )
    private Venue venue;

    protected VenueFeature() {
    }

    public VenueFeature(Venue venue, String featureName) {
        this.venue = venue;
        this.id = new VenueFeatureId(
                venue.getVenueId(),
                featureName
        );
    }

    public VenueFeatureId getId() {
        return id;
    }

    public Venue getVenue() {
        return venue;
    }

    public String getFeatureName() {
        return id.getFeatureName();
    }
}