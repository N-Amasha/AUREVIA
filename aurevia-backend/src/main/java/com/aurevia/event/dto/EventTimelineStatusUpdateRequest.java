package com.aurevia.event.dto;

import jakarta.validation.constraints.NotBlank;

public record EventTimelineStatusUpdateRequest(

        @NotBlank(message = "Timeline status is required.")
        String status
) {
}