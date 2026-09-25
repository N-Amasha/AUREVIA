package com.aurevia.event.repository;

import com.aurevia.event.entity.EventService;
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
class EventServiceRepositoryTest {

    @Autowired
    private EventServiceRepository eventServiceRepository;

    @Test
    void shouldReadAllEventServices() {
        assertThat(eventServiceRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldReadEventServiceRelationships() {
        Optional<EventService> result =
                eventServiceRepository.findById(1);

        assertThat(result).isPresent();

        EventService service = result.orElseThrow();

        assertThat(service.getEvent().getEventId()).isEqualTo(1);
        assertThat(service.getVendor().getVendorId()).isEqualTo(1);
        assertThat(service.getServiceName())
                .isEqualTo("Wedding Floral Decoration");
        assertThat(service.getServiceDate())
                .isEqualTo(LocalDate.of(2026, 11, 10));
        assertThat(service.getStartTime())
                .isEqualTo(LocalTime.of(9, 0));
        assertThat(service.getEndTime())
                .isEqualTo(LocalTime.of(16, 0));
        assertThat(service.getCost())
                .isEqualByComparingTo(new BigDecimal("75000.00"));
        assertThat(service.getServiceStatus())
                .isEqualTo("COMPLETED");
    }

    @Test
    void shouldFindServicesForEvent() {
        List<EventService> services =
                eventServiceRepository
                        .findByEventEventIdOrderByServiceDateAscStartTimeAsc(
                                1
                        );

        assertThat(services)
                .extracting(EventService::getEventServiceId)
                .containsExactly(1, 2);
    }

    @Test
    void shouldCalculateTotalServiceCostForEvent() {
        BigDecimal total =
                eventServiceRepository
                        .calculateEventServiceCost(1);

        assertThat(total)
                .isEqualByComparingTo(new BigDecimal("160000.00"));
    }
}