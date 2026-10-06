package com.aurevia.reservation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PricingRuleResponse(
        Integer pricingRuleId,
        Integer venueId,
        String venueName,
        String ruleName,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal surcharge,
        BigDecimal price,
        String approvalStatus
) {
}