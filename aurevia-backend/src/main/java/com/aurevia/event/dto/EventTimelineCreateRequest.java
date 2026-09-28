package com.aurevia.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record EventTimelineCreateRequest(

        @NotNull(message = "Event ID is required.")
        @Positive(message = "Event ID must be positive.")
        Integer eventId,

        @NotBlank(message = "Milestone name is required.")
        String milestoneName,

        String description,

        @NotNull(message = "Scheduled date is required.")
        LocalDateTime scheduledDate
) {
}