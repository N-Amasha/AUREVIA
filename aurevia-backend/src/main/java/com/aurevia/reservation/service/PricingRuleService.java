package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.PricingRuleRequest;
import com.aurevia.reservation.dto.PricingRuleResponse;
import com.aurevia.reservation.entity.PricingRule;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.repository.PricingRuleRepository;
import com.aurevia.reservation.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class PricingRuleService {

    private static final Set<String> ALLOWED_STATUSES =
            Set.of("PENDING", "APPROVED", "REJECTED");

    private final PricingRuleRepository pricingRuleRepository;
    private final VenueRepository venueRepository;

    public PricingRuleService(
            PricingRuleRepository pricingRuleRepository,
            VenueRepository venueRepository
    ) {
        this.pricingRuleRepository = pricingRuleRepository;
        this.venueRepository = venueRepository;
    }

    public List<PricingRuleResponse> getAllPricingRules() {
        return pricingRuleRepository.findAll()
                .stream()
                .sorted(
                        (first, second) ->
                                first.getStartDate()
                                        .compareTo(second.getStartDate())
                )
                .map(this::toResponse)
                .toList();
    }

    public PricingRuleResponse getPricingRuleById(
            Integer pricingRuleId
    ) {
        return toResponse(findPricingRule(pricingRuleId));
    }

    public List<PricingRuleResponse> getPricingRulesByVenue(
            Integer venueId
    ) {
        if (!venueRepository.existsById(venueId)) {
            throw new ResourceNotFoundException(
                    "Venue",
                    "venueId",
                    venueId
            );
        }

        return pricingRuleRepository
                .findByVenueVenueIdOrderByStartDateAsc(venueId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PricingRuleResponse> getPricingRulesByStatus(
            String approvalStatus
    ) {
        String normalizedStatus =
                normalizeStatus(approvalStatus);

        return pricingRuleRepository
                .findByApprovalStatusIgnoreCase(
                        normalizedStatus
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PricingRuleResponse createPricingRule(
            PricingRuleRequest request
    ) {
        validateRequest(request);

        Venue venue = findVenue(request.venueId());

        PricingRule pricingRule = new PricingRule(
                venue,
                request.ruleName().trim(),
                request.startDate(),
                request.endDate(),
                request.surcharge(),
                request.price(),
                normalizeStatus(request.approvalStatus())
        );

        return toResponse(
                pricingRuleRepository.save(pricingRule)
        );
    }

    @Transactional
    public PricingRuleResponse updatePricingRule(
            Integer pricingRuleId,
            PricingRuleRequest request
    ) {
        validateRequest(request);

        PricingRule pricingRule =
                findPricingRule(pricingRuleId);

        Venue venue = findVenue(request.venueId());

        pricingRule.setVenue(venue);
        pricingRule.setRuleName(
                request.ruleName().trim()
        );
        pricingRule.setStartDate(request.startDate());
        pricingRule.setEndDate(request.endDate());
        pricingRule.setSurcharge(request.surcharge());
        pricingRule.setPrice(request.price());
        pricingRule.setApprovalStatus(
                normalizeStatus(request.approvalStatus())
        );

        return toResponse(
                pricingRuleRepository.save(pricingRule)
        );
    }

    @Transactional
    public void deletePricingRule(Integer pricingRuleId) {
        PricingRule pricingRule =
                findPricingRule(pricingRuleId);

        pricingRuleRepository.delete(pricingRule);
    }

    private PricingRule findPricingRule(
            Integer pricingRuleId
    ) {
        return pricingRuleRepository
                .findById(pricingRuleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Pricing rule",
                                "pricingRuleId",
                                pricingRuleId
                        )
                );
    }

    private Venue findVenue(Integer venueId) {
        return venueRepository
                .findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                venueId
                        )
                );
    }

    private void validateRequest(
            PricingRuleRequest request
    ) {
        if (request.endDate()
                .isBefore(request.startDate())) {
            throw new BusinessRuleException(
                    "Pricing rule end date cannot be before start date."
            );
        }

        normalizeStatus(request.approvalStatus());
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Approval status is required."
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        if (!ALLOWED_STATUSES.contains(
                normalizedStatus
        )) {
            throw new BusinessRuleException(
                    "Approval status must be PENDING, APPROVED or REJECTED."
            );
        }

        return normalizedStatus;
    }

    private PricingRuleResponse toResponse(
            PricingRule pricingRule
    ) {
        Venue venue = pricingRule.getVenue();

        return new PricingRuleResponse(
                pricingRule.getPricingRuleId(),
                venue.getVenueId(),
                venue.getVenueName(),
                pricingRule.getRuleName(),
                pricingRule.getStartDate(),
                pricingRule.getEndDate(),
                pricingRule.getSurcharge(),
                pricingRule.getPrice(),
                pricingRule.getApprovalStatus()
        );
    }
}