package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;

@Entity
@Table(
        name = "catering_package",
        uniqueConstraints = @UniqueConstraint(
                name = "package_name",
                columnNames = "package_name"
        )
)
public class CateringPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id", nullable = false)
    private Integer packageId;

    @Column(name = "package_name", nullable = false, length = 100)
    private String packageName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "package_type", nullable = false, length = 50)
    private String packageType;

    @Column(
            name = "base_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal basePrice;

    @Column(name = "minimum_guests", nullable = false)
    private Integer minimumGuests;

    @Column(name = "maximum_guests", nullable = false)
    private Integer maximumGuests;

    protected CateringPackage() {
    }

    public CateringPackage(
            String packageName,
            String description,
            String packageType,
            BigDecimal basePrice,
            Integer minimumGuests,
            Integer maximumGuests
    ) {
        this.packageName = packageName;
        this.description = description;
        this.packageType = packageType;
        this.basePrice = basePrice;
        this.minimumGuests = minimumGuests;
        this.maximumGuests = maximumGuests;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPackageType() {
        return packageType;
    }

    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getMinimumGuests() {
        return minimumGuests;
    }

    public void setMinimumGuests(Integer minimumGuests) {
        this.minimumGuests = minimumGuests;
    }

    public Integer getMaximumGuests() {
        return maximumGuests;
    }

    public void setMaximumGuests(Integer maximumGuests) {
        this.maximumGuests = maximumGuests;
    }
}