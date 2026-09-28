package com.aurevia.staff.dto;

import jakarta.validation.constraints.NotBlank;

public record ShiftStatusUpdateRequest(

        @NotBlank(message = "Shift status is required.")
        String status
) {
}