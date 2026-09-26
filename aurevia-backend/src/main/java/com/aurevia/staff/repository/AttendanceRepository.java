package com.aurevia.staff.repository;

import com.aurevia.staff.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Integer> {

    List<Attendance>
    findByEmployeeEmployeeIdOrderByAttendanceDateDesc(
            Integer employeeId
    );

    Optional<Attendance> findByShiftShiftId(Integer shiftId);

    List<Attendance>
    findByAttendanceDateOrderByEmployeeEmployeeIdAsc(
            LocalDate attendanceDate
    );

    List<Attendance>
    findByAttendanceStatusIgnoreCaseOrderByAttendanceDateAsc(
            String attendanceStatus
    );

    List<Attendance>
    findByAttendanceDateBetweenOrderByAttendanceDateAsc(
            LocalDate startDate,
            LocalDate endDate
    );
}