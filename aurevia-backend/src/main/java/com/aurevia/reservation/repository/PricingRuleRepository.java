package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PricingRuleRepository
        extends JpaRepository<PricingRule, Integer> {

    List<PricingRule> findByVenueVenueIdOrderByStartDateAsc(
            Integer venueId
    );

    List<PricingRule> findByApprovalStatusIgnoreCase(
            String approvalStatus
    );

    @Query("""
            SELECT pr
            FROM PricingRule pr
            WHERE pr.venue.venueId = :venueId
              AND pr.startDate <= :bookingDate
              AND pr.endDate >= :bookingDate
              AND UPPER(pr.approvalStatus) = 'APPROVED'
            ORDER BY pr.startDate DESC
            """)
    List<PricingRule> findApprovedRulesForDate(
            @Param("venueId") Integer venueId,
            @Param("bookingDate") LocalDate bookingDate
    );
}