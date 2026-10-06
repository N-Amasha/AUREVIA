package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.PricingRuleRequest;
import com.aurevia.reservation.dto.PricingRuleResponse;
import com.aurevia.reservation.service.PricingRuleService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pricing-rules")
@Validated
public class PricingRuleController {

    private final PricingRuleService pricingRuleService;

    public PricingRuleController(
            PricingRuleService pricingRuleService
    ) {
        this.pricingRuleService = pricingRuleService;
    }

    @GetMapping
    public ResponseEntity<List<PricingRuleResponse>>
    getAllPricingRules() {
        return ResponseEntity.ok(
                pricingRuleService.getAllPricingRules()
        );
    }

    @GetMapping("/{pricingRuleId}")
    public ResponseEntity<PricingRuleResponse>
    getPricingRuleById(
            @PathVariable
            @Positive(
                    message = "Pricing rule ID must be positive."
            )
            Integer pricingRuleId
    ) {
        return ResponseEntity.ok(
                pricingRuleService.getPricingRuleById(
                        pricingRuleId
                )
        );
    }

    @GetMapping("/venues/{venueId}")
    public ResponseEntity<List<PricingRuleResponse>>
    getPricingRulesByVenue(
            @PathVariable
            @Positive(message = "Venue ID must be positive.")
            Integer venueId
    ) {
        return ResponseEntity.ok(
                pricingRuleService.getPricingRulesByVenue(
                        venueId
                )
        );
    }

    @GetMapping("/statuses/{approvalStatus}")
    public ResponseEntity<List<PricingRuleResponse>>
    getPricingRulesByStatus(
            @PathVariable String approvalStatus
    ) {
        return ResponseEntity.ok(
                pricingRuleService.getPricingRulesByStatus(
                        approvalStatus
                )
        );
    }

    @PostMapping
    public ResponseEntity<PricingRuleResponse>
    createPricingRule(
            @Valid
            @RequestBody
            PricingRuleRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        pricingRuleService
                                .createPricingRule(request)
                );
    }

    @PutMapping("/{pricingRuleId}")
    public ResponseEntity<PricingRuleResponse>
    updatePricingRule(
            @PathVariable
            @Positive(
                    message = "Pricing rule ID must be positive."
            )
            Integer pricingRuleId,

            @Valid
            @RequestBody
            PricingRuleRequest request
    ) {
        return ResponseEntity.ok(
                pricingRuleService.updatePricingRule(
                        pricingRuleId,
                        request
                )
        );
    }

    @DeleteMapping("/{pricingRuleId}")
    public ResponseEntity<Void> deletePricingRule(
            @PathVariable
            @Positive(
                    message = "Pricing rule ID must be positive."
            )
            Integer pricingRuleId
    ) {
        pricingRuleService.deletePricingRule(
                pricingRuleId
        );

        return ResponseEntity.noContent().build();
    }
}