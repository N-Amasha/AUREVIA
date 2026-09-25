package com.aurevia.user.repository;

import com.aurevia.user.entity.EventCoordinator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class EventCoordinatorRepositoryTest {

    @Autowired
    private EventCoordinatorRepository eventCoordinatorRepository;

    @Test
    void shouldReadAllEventCoordinators() {
        long count = eventCoordinatorRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadEventCoordinatorUsingSharedEmployeeId() {
        Optional<EventCoordinator> result =
                eventCoordinatorRepository.findById(6);

        assertThat(result).isPresent();

        EventCoordinator coordinator = result.orElseThrow();

        assertThat(coordinator.getEmployeeId()).isEqualTo(6);
        assertThat(coordinator.getCoordinationLevel())
                .isEqualTo("Senior");
        assertThat(coordinator.getEmployee().getEmployeeId())
                .isEqualTo(6);
    }

    @Test
    void shouldFindCoordinatorsByCoordinationLevel() {
        List<EventCoordinator> coordinators =
                eventCoordinatorRepository
                        .findByCoordinationLevelIgnoreCase("senior");

        assertThat(coordinators).hasSize(2);
        assertThat(coordinators)
                .extracting(EventCoordinator::getEmployeeId)
                .containsExactlyInAnyOrder(6, 7);
    }
}