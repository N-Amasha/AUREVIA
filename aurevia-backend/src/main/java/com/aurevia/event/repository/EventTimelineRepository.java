package com.aurevia.event.repository;

import com.aurevia.event.entity.EventTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventTimelineRepository
        extends JpaRepository<EventTimeline, Integer> {

    List<EventTimeline>
    findByEventEventIdOrderByScheduledDateAsc(Integer eventId);

    List<EventTimeline>
    findByEventEventIdAndStatusIgnoreCaseOrderByScheduledDateAsc(
            Integer eventId,
            String status
    );

    List<EventTimeline>
    findByScheduledDateBetweenOrderByScheduledDateAsc(
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );
}