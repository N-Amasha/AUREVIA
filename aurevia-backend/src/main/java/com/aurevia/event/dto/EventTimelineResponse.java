package com.aurevia.event.dto;

import java.time.LocalDateTime;

public record EventTimelineResponse(
        Integer timelineId,
        Integer eventId,
        String eventName,
        String milestoneName,
        String description,
        LocalDateTime scheduledDate,
        String status,
        LocalDateTime updatedDate
) {
}