package com.aurevia.reservation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pricing_rule")
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pricing_rule_id", nullable = false)
    private Integer pricingRuleId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "venue_id",
            referencedColumnName = "venue_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_pricing_rule_venue"
            )
    )
    private Venue venue;

    @Column(name = "rule_name", nullable = false, length = 100)
    private String ruleName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(
            name = "surcharge",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal surcharge;

    @Column(
            name = "price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal price;

    @Column(
            name = "approval_status",
            nullable = false,
            length = 30
    )
    private String approvalStatus;

    protected PricingRule() {
    }

    public PricingRule(
            Venue venue,
            String ruleName,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal surcharge,
            BigDecimal price,
            String approvalStatus
    ) {
        this.venue = venue;
        this.ruleName = ruleName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.surcharge = surcharge;
        this.price = price;
        this.approvalStatus = approvalStatus;
    }

    public Integer getPricingRuleId() {
        return pricingRuleId;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getSurcharge() {
        return surcharge;
    }

    public void setSurcharge(BigDecimal surcharge) {
        this.surcharge = surcharge;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}