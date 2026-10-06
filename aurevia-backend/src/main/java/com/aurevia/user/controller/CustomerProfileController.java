package com.aurevia.user.controller;

import com.aurevia.user.dto.CustomerProfileResponse;
import com.aurevia.user.dto.CustomerProfileUpdateRequest;
import com.aurevia.user.service.CustomerProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
@Validated
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    public CustomerProfileController(
            CustomerProfileService customerProfileService
    ) {
        this.customerProfileService =
                customerProfileService;
    }

    @GetMapping("/{customerId}/profile")
    public ResponseEntity<CustomerProfileResponse>
    getCustomerProfile(
            @PathVariable
            @Positive(
                    message = "Customer ID must be positive."
            )
            Integer customerId
    ) {
        return ResponseEntity.ok(
                customerProfileService
                        .getCustomerProfile(customerId)
        );
    }

    @PutMapping("/{customerId}/profile")
    public ResponseEntity<CustomerProfileResponse>
    updateCustomerProfile(
            @PathVariable
            @Positive(
                    message = "Customer ID must be positive."
            )
            Integer customerId,

            @Valid
            @RequestBody
            CustomerProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(
                customerProfileService
                        .updateCustomerProfile(
                                customerId,
                                request
                        )
        );
    }
}