package com.aurevia.user.repository;

import com.aurevia.user.entity.HrManager;
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
class HrManagerRepositoryTest {

    @Autowired
    private HrManagerRepository hrManagerRepository;

    @Test
    void shouldReadAllHrManagers() {
        long count = hrManagerRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadHrManagerUsingSharedEmployeeId() {
        Optional<HrManager> result =
                hrManagerRepository.findById(26);

        assertThat(result).isPresent();

        HrManager manager = result.orElseThrow();

        assertThat(manager.getEmployeeId()).isEqualTo(26);
        assertThat(manager.getHrLevel()).isEqualTo("Senior");
        assertThat(manager.getEmployee().getEmployeeId())
                .isEqualTo(26);
    }

    @Test
    void shouldFindHrManagersByLevel() {
        List<HrManager> managers =
                hrManagerRepository.findByHrLevelIgnoreCase("senior");

        assertThat(managers).hasSize(2);
        assertThat(managers)
                .extracting(HrManager::getEmployeeId)
                .containsExactlyInAnyOrder(26, 27);
    }
}