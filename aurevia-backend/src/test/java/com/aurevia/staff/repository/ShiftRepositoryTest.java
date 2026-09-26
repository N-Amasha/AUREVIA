package com.aurevia.staff.repository;

import com.aurevia.staff.entity.Shift;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.time.LocalTime;
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
class ShiftRepositoryTest {

    @Autowired
    private ShiftRepository shiftRepository;

    @Test
    void shouldLoadAllShifts() {
        assertThat(shiftRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindShiftsByEmployee() {
        List<Shift> shifts =
                shiftRepository
                        .findByEmployeeEmployeeIdOrderByShiftDateAscStartTimeAsc(
                                31
                        );

        assertThat(shifts)
                .extracting(Shift::getShiftId)
                .containsExactly(1);
    }

    @Test
    void shouldFindShiftsByDateOrderedByStartTime() {
        List<Shift> shifts =
                shiftRepository.findByShiftDateOrderByStartTimeAsc(
                        LocalDate.of(2026, 10, 1)
                );

        assertThat(shifts)
                .extracting(Shift::getShiftId)
                .containsExactly(1, 2);
    }

    @Test
    void shouldFindScheduledShifts() {
        List<Shift> shifts =
                shiftRepository
                        .findByShiftStatusIgnoreCaseOrderByShiftDateAscStartTimeAsc(
                                "scheduled"
                        );

        assertThat(shifts)
                .extracting(Shift::getShiftId)
                .containsExactly(3, 4, 5);
    }

    @Test
    void shouldFindShiftsWithinDateRange() {
        List<Shift> shifts =
                shiftRepository
                        .findByShiftDateBetweenOrderByShiftDateAscStartTimeAsc(
                                LocalDate.of(2026, 10, 1),
                                LocalDate.of(2026, 10, 2)
                        );

        assertThat(shifts)
                .extracting(Shift::getShiftId)
                .containsExactly(1, 2, 3, 4);
    }

    @Test
    void shouldFindOverlappingShift() {
        List<Shift> shifts =
                shiftRepository.findOverlappingShifts(
                        31,
                        LocalDate.of(2026, 10, 1),
                        LocalTime.of(12, 0),
                        LocalTime.of(14, 0)
                );

        assertThat(shifts)
                .extracting(Shift::getShiftId)
                .containsExactly(1);
    }

    @Test
    void shouldNotTreatAdjacentShiftAsOverlapping() {
        List<Shift> shifts =
                shiftRepository.findOverlappingShifts(
                        31,
                        LocalDate.of(2026, 10, 1),
                        LocalTime.of(16, 0),
                        LocalTime.of(18, 0)
                );

        assertThat(shifts).isEmpty();
    }
}