package com.aurevia.event.repository;

import com.aurevia.event.entity.EventTimeline;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class EventTimelineRepositoryTest {

    @Autowired
    private EventTimelineRepository eventTimelineRepository;

    @Test
    void shouldReadAllTimelineMilestones() {
        assertThat(eventTimelineRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldReadTimelineWithEvent() {
        Optional<EventTimeline> result =
                eventTimelineRepository.findById(1);

        assertThat(result).isPresent();

        EventTimeline timeline = result.orElseThrow();

        assertThat(timeline.getEvent().getEventId()).isEqualTo(1);
        assertThat(timeline.getMilestoneName())
                .isEqualTo("Venue Decoration");
        assertThat(timeline.getDescription())
                .isEqualTo("Complete ballroom decoration");
        assertThat(timeline.getScheduledDate())
                .isEqualTo(LocalDateTime.of(
                        2026,
                        11,
                        10,
                        9,
                        0
                ));
        assertThat(timeline.getStatus()).isEqualTo("COMPLETED");
        assertThat(timeline.getUpdatedDate())
                .isEqualTo(LocalDateTime.of(
                        2026,
                        11,
                        10,
                        16,
                        0
                ));
    }

    @Test
    void shouldFindTimelineForEvent() {
        List<EventTimeline> timeline =
                eventTimelineRepository
                        .findByEventEventIdOrderByScheduledDateAsc(4);

        assertThat(timeline).hasSize(1);
        assertThat(timeline.getFirst().getTimelineId()).isEqualTo(4);
        assertThat(timeline.getFirst().getStatus())
                .isEqualTo("PENDING");
    }

    @Test
    void shouldFindPendingTimelineForEvent() {
        List<EventTimeline> timeline =
                eventTimelineRepository
                        .findByEventEventIdAndStatusIgnoreCaseOrderByScheduledDateAsc(
                                5,
                                "pending"
                        );

        assertThat(timeline).hasSize(1);
        assertThat(timeline.getFirst().getMilestoneName())
                .isEqualTo("Band Sound Check");
    }
}