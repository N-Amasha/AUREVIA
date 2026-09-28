package com.aurevia.event.service;

import com.aurevia.event.dto.EventTimelineCreateRequest;
import com.aurevia.event.dto.EventTimelineResponse;
import com.aurevia.event.dto.EventTimelineStatusUpdateRequest;
import com.aurevia.event.entity.Event;
import com.aurevia.event.entity.EventTimeline;
import com.aurevia.event.mapper.EventTimelineMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.event.repository.EventTimelineRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventTimelineServiceTest {

    @Mock
    private EventTimelineRepository timelineRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventTimelineMapper timelineMapper;

    private EventTimelineService timelineService;

    @BeforeEach
    void setUp() {
        timelineService = new EventTimelineService(
                timelineRepository,
                eventRepository,
                timelineMapper
        );
    }

    @Test
    void shouldCreateTimelineMilestone() {
        Event event = mock(Event.class);
        EventTimeline savedTimeline =
                mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(timelineRepository
                .saveAndFlush(any(EventTimeline.class)))
                .thenReturn(savedTimeline);
        when(timelineMapper.toResponse(savedTimeline))
                .thenReturn(response);

        assertEquals(
                response,
                timelineService.createTimelineMilestone(
                        createRequest()
                )
        );
    }

    @Test
    void shouldRejectMissingEventDuringCreation() {
        when(eventRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> timelineService.createTimelineMilestone(
                        createRequest()
                )
        );
    }

    @Test
    void shouldReturnTimelineById() {
        EventTimeline timeline = mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(timelineRepository.findById(1))
                .thenReturn(Optional.of(timeline));
        when(timelineMapper.toResponse(timeline))
                .thenReturn(response);

        assertEquals(
                response,
                timelineService.getTimelineById(1)
        );
    }

    @Test
    void shouldReturnTimelineByEvent() {
        EventTimeline timeline = mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(timelineRepository
                .findByEventEventIdOrderByScheduledDateAsc(1))
                .thenReturn(List.of(timeline));
        when(timelineMapper.toResponse(timeline))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                timelineService.getTimelineByEvent(1)
        );
    }

    @Test
    void shouldReturnTimelineByEventAndStatus() {
        EventTimeline timeline = mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(timelineRepository
                .findByEventEventIdAndStatusIgnoreCaseOrderByScheduledDateAsc(
                        1,
                        "PENDING"
                ))
                .thenReturn(List.of(timeline));
        when(timelineMapper.toResponse(timeline))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                timelineService.getTimelineByEventAndStatus(
                        1,
                        " pending "
                )
        );
    }

    @Test
    void shouldReturnTimelineBetweenDates() {
        LocalDateTime start =
                LocalDateTime.of(2026, 11, 1, 0, 0);
        LocalDateTime end =
                LocalDateTime.of(2026, 11, 30, 23, 59);
        EventTimeline timeline = mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(timelineRepository
                .findByScheduledDateBetweenOrderByScheduledDateAsc(
                        start,
                        end
                ))
                .thenReturn(List.of(timeline));
        when(timelineMapper.toResponse(timeline))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                timelineService.getTimelineBetween(start, end)
        );
    }

    @Test
    void shouldUpdateTimelineStatus() {
        EventTimeline timeline = mock(EventTimeline.class);
        EventTimelineResponse response = response();

        when(timelineRepository.findById(1))
                .thenReturn(Optional.of(timeline));
        when(timelineRepository.saveAndFlush(timeline))
                .thenReturn(timeline);
        when(timelineMapper.toResponse(timeline))
                .thenReturn(response);

        assertEquals(
                response,
                timelineService.updateTimelineStatus(
                        1,
                        new EventTimelineStatusUpdateRequest(
                                " completed "
                        )
                )
        );

        verify(timeline).setStatus("COMPLETED");
    }

    @Test
    void shouldRejectUnsupportedTimelineStatus() {
        EventTimeline timeline = mock(EventTimeline.class);

        when(timelineRepository.findById(1))
                .thenReturn(Optional.of(timeline));

        assertThrows(
                BusinessRuleException.class,
                () -> timelineService.updateTimelineStatus(
                        1,
                        new EventTimelineStatusUpdateRequest(
                                "UNKNOWN"
                        )
                )
        );
    }

    private EventTimelineCreateRequest createRequest() {
        return new EventTimelineCreateRequest(
                1,
                "Venue Decoration",
                "Complete ballroom decoration",
                LocalDateTime.of(2026, 11, 10, 9, 0)
        );
    }

    private EventTimelineResponse response() {
        return new EventTimelineResponse(
                1,
                1,
                "Perera Wedding Reception",
                "Venue Decoration",
                "Complete ballroom decoration",
                LocalDateTime.of(2026, 11, 10, 9, 0),
                "PENDING",
                LocalDateTime.of(2026, 9, 28, 8, 0)
        );
    }
}