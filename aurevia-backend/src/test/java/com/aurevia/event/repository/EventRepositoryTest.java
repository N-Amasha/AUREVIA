package com.aurevia.event.repository;

import com.aurevia.event.entity.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Test
    void shouldReadAllEvents() {
        assertThat(eventRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldReadEventRelationshipsAndDetails() {
        Optional<Event> result = eventRepository.findById(1);

        assertThat(result).isPresent();

        Event event = result.orElseThrow();

        assertThat(event.getEventBooking().getEventBookingId())
                .isEqualTo(1);
        assertThat(event.getCoordinator().getEmployeeId())
                .isEqualTo(6);
        assertThat(event.getEventName())
                .isEqualTo("Perera Wedding Reception");
        assertThat(event.getEventType()).isEqualTo("WEDDING");
        assertThat(event.getEventDate())
                .isEqualTo(LocalDate.of(2026, 11, 10));
        assertThat(event.getStartTime())
                .isEqualTo(LocalTime.of(17, 0));
        assertThat(event.getEndTime())
                .isEqualTo(LocalTime.of(23, 0));
        assertThat(event.getBudget())
                .isEqualByComparingTo(new BigDecimal("500000.00"));
        assertThat(event.getNumberOfGuests()).isEqualTo(300);
        assertThat(event.getEventStatus()).isEqualTo("COMPLETED");
    }

    @Test
    void shouldFindEventByBooking() {
        Optional<Event> result =
                eventRepository
                        .findByEventBookingEventBookingId(3);

        assertThat(result).isPresent();
        assertThat(result.orElseThrow().getEventId()).isEqualTo(3);
    }

    @Test
    void shouldFindEventsByStatus() {
        List<Event> events =
                eventRepository
                        .findByEventStatusIgnoreCase("completed");

        assertThat(events)
                .extracting(Event::getEventId)
                .containsExactlyInAnyOrder(1, 2, 3);
    }
}