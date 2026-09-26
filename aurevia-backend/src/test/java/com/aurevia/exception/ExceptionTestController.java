package com.aurevia.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-errors")
public class ExceptionTestController {

    @GetMapping("/not-found")
    public void notFound() {
        throw new ResourceNotFoundException(
                "Reservation",
                "reservationId",
                100
        );
    }

    @GetMapping("/business-rule")
    public void businessRule() {
        throw new BusinessRuleException(
                "The selected table is already reserved."
        );
    }

    @GetMapping("/illegal-argument")
    public void illegalArgument() {
        throw new IllegalArgumentException(
                "The supplied value is invalid."
        );
    }

    @PostMapping("/validation")
    public void validation(
            @Valid @RequestBody TestRequest request
    ) {
        // Validation occurs before this method executes.
    }

    @GetMapping("/unexpected")
    public void unexpected() {
        throw new RuntimeException(
                "Sensitive internal implementation detail."
        );
    }

    public record TestRequest(
            @NotBlank(message = "Name is required.")
            String name
    ) {
    }
}