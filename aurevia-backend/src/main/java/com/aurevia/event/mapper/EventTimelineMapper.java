package com.aurevia.event.mapper;

import com.aurevia.event.dto.EventTimelineResponse;
import com.aurevia.event.entity.EventTimeline;
import org.springframework.stereotype.Component;

@Component
public class EventTimelineMapper {

    public EventTimelineResponse toResponse(
            EventTimeline timeline
    ) {
        return new EventTimelineResponse(
                timeline.getTimelineId(),
                timeline.getEvent().getEventId(),
                timeline.getEvent().getEventName(),
                timeline.getMilestoneName(),
                timeline.getDescription(),
                timeline.getScheduledDate(),
                timeline.getStatus(),
                timeline.getUpdatedDate()
        );
    }
}