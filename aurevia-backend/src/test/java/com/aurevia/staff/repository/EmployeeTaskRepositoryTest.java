package com.aurevia.staff.repository;

import com.aurevia.staff.entity.EmployeeTask;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class EmployeeTaskRepositoryTest {

    @Autowired
    private EmployeeTaskRepository employeeTaskRepository;

    @Test
    void shouldLoadAllEmployeeTasks() {
        assertThat(employeeTaskRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindTasksByEmployee() {
        List<EmployeeTask> tasks =
                employeeTaskRepository
                        .findByEmployeeEmployeeIdOrderByDueDateAsc(31);

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(1);
    }

    @Test
    void shouldFindTasksByEvent() {
        List<EmployeeTask> tasks =
                employeeTaskRepository
                        .findByEventEventIdOrderByDueDateAsc(4);

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(4);
    }

    @Test
    void shouldFindGeneralTasksWithoutEvent() {
        List<EmployeeTask> tasks =
                employeeTaskRepository
                        .findByEventIsNullOrderByDueDateAsc();

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(5);

        assertThat(tasks.getFirst().getEvent()).isNull();
    }

    @Test
    void shouldFindCompletedTasks() {
        List<EmployeeTask> tasks =
                employeeTaskRepository
                        .findByTaskStatusIgnoreCaseOrderByDueDateAsc(
                                "completed"
                        );

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(1, 2, 3);
    }

    @Test
    void shouldFindTasksWithinDueDateRange() {
        List<EmployeeTask> tasks =
                employeeTaskRepository
                        .findByDueDateBetweenOrderByDueDateAsc(
                                LocalDate.of(2026, 11, 10),
                                LocalDate.of(2026, 11, 20)
                        );

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(1, 2, 3);
    }

    @Test
    void shouldFindOverdueIncompleteTasks() {
        List<EmployeeTask> tasks =
                employeeTaskRepository.findOverdueIncompleteTasks(
                        LocalDate.of(2026, 9, 26)
                );

        assertThat(tasks)
                .extracting(EmployeeTask::getTaskId)
                .containsExactly(5);

        assertThat(tasks.getFirst().getTaskStatus())
                .isEqualTo("IN_PROGRESS");
    }
}