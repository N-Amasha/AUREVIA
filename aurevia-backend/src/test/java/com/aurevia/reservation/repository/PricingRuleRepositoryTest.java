package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.PricingRule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class PricingRuleRepositoryTest {

    @Autowired
    private PricingRuleRepository pricingRuleRepository;

    @Test
    void shouldReadAllPricingRules() {
        long count = pricingRuleRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadPricingRuleWithVenue() {
        Optional<PricingRule> result =
                pricingRuleRepository.findById(1);

        assertThat(result).isPresent();

        PricingRule rule = result.orElseThrow();

        assertThat(rule.getVenue().getVenueId()).isEqualTo(1);
        assertThat(rule.getRuleName())
                .isEqualTo("Wedding Season Rate");
        assertThat(rule.getStartDate())
                .isEqualTo(LocalDate.of(2026, 11, 1));
        assertThat(rule.getEndDate())
                .isEqualTo(LocalDate.of(2026, 12, 31));
        assertThat(rule.getSurcharge())
                .isEqualByComparingTo(new BigDecimal("50000.00"));
        assertThat(rule.getPrice())
                .isEqualByComparingTo(new BigDecimal("300000.00"));
        assertThat(rule.getApprovalStatus()).isEqualTo("APPROVED");
    }

    @Test
    void shouldFindApprovedRuleForBookingDate() {
        List<PricingRule> rules =
                pricingRuleRepository.findApprovedRulesForDate(
                        1,
                        LocalDate.of(2026, 11, 10)
                );

        assertThat(rules).hasSize(1);
        assertThat(rules.getFirst().getPricingRuleId()).isEqualTo(1);
    }

    @Test
    void shouldIgnorePendingRuleDuringPriceLookup() {
        List<PricingRule> rules =
                pricingRuleRepository.findApprovedRulesForDate(
                        4,
                        LocalDate.of(2026, 12, 15)
                );

        assertThat(rules).isEmpty();
    }

    @Test
    void shouldReturnNoRuleOutsideConfiguredDateRange() {
        List<PricingRule> rules =
                pricingRuleRepository.findApprovedRulesForDate(
                        1,
                        LocalDate.of(2027, 1, 1)
                );

        assertThat(rules).isEmpty();
    }
}