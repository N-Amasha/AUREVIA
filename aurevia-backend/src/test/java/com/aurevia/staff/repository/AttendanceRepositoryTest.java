package com.aurevia.staff.repository;

import com.aurevia.staff.entity.Attendance;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class AttendanceRepositoryTest {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Test
    void shouldLoadAllAttendanceRecords() {
        assertThat(attendanceRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindAttendanceByEmployee() {
        List<Attendance> records =
                attendanceRepository
                        .findByEmployeeEmployeeIdOrderByAttendanceDateDesc(
                                31
                        );

        assertThat(records)
                .extracting(Attendance::getAttendanceId)
                .containsExactly(1);
    }

    @Test
    void shouldFindAttendanceByShift() {
        Optional<Attendance> result =
                attendanceRepository.findByShiftShiftId(2);

        assertThat(result).isPresent();
        assertThat(result.get().getAttendanceId()).isEqualTo(2);
        assertThat(result.get().getAttendanceStatus())
                .isEqualTo("LATE");
    }

    @Test
    void shouldFindAttendanceByDate() {
        List<Attendance> records =
                attendanceRepository
                        .findByAttendanceDateOrderByEmployeeEmployeeIdAsc(
                                LocalDate.of(2026, 10, 1)
                        );

        assertThat(records)
                .extracting(Attendance::getAttendanceId)
                .containsExactly(1, 2);
    }

    @Test
    void shouldFindPresentAttendanceRecords() {
        List<Attendance> records =
                attendanceRepository
                        .findByAttendanceStatusIgnoreCaseOrderByAttendanceDateAsc(
                                "present"
                        );

        assertThat(records)
                .extracting(Attendance::getAttendanceId)
                .containsExactly(1, 3, 5);
    }

    @Test
    void shouldLoadAbsentRecordWithNullTimes() {
        List<Attendance> records =
                attendanceRepository
                        .findByAttendanceStatusIgnoreCaseOrderByAttendanceDateAsc(
                                "absent"
                        );

        assertThat(records)
                .extracting(Attendance::getAttendanceId)
                .containsExactly(4);

        Attendance absentRecord = records.getFirst();

        assertThat(absentRecord.getCheckInTime()).isNull();
        assertThat(absentRecord.getCheckOutTime()).isNull();
    }

    @Test
    void shouldFindAttendanceWithinDateRange() {
        List<Attendance> records =
                attendanceRepository
                        .findByAttendanceDateBetweenOrderByAttendanceDateAsc(
                                LocalDate.of(2026, 10, 1),
                                LocalDate.of(2026, 10, 2)
                        );

        assertThat(records)
                .extracting(Attendance::getAttendanceId)
                .containsExactly(1, 2, 3, 4);
    }
}