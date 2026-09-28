package com.aurevia.staff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record LeaveRequestReviewRequest(

        @NotNull(message = "HR manager ID is required.")
        @Positive(message = "HR manager ID must be positive.")
        Integer hrManagerId,

        @NotBlank(message = "Request status is required.")
        String requestStatus
) {
}