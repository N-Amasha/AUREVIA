package com.aurevia.reservation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class VenueFeatureId implements Serializable {

    @Column(name = "venue_id", nullable = false)
    private Integer venueId;

    @Column(name = "feature_name", nullable = false, length = 100)
    private String featureName;

    protected VenueFeatureId() {
    }

    public VenueFeatureId(Integer venueId, String featureName) {
        this.venueId = venueId;
        this.featureName = featureName;
    }

    public Integer getVenueId() {
        return venueId;
    }

    public String getFeatureName() {
        return featureName;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof VenueFeatureId that)) {
            return false;
        }

        return Objects.equals(venueId, that.venueId)
                && Objects.equals(featureName, that.featureName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(venueId, featureName);
    }
}