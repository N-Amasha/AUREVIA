package com.aurevia.staff.repository;

import com.aurevia.staff.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ShiftRepository
        extends JpaRepository<Shift, Integer> {

    List<Shift> findByEmployeeEmployeeIdOrderByShiftDateAscStartTimeAsc(
            Integer employeeId
    );

    List<Shift> findByShiftDateOrderByStartTimeAsc(
            LocalDate shiftDate
    );

    List<Shift> findByShiftStatusIgnoreCaseOrderByShiftDateAscStartTimeAsc(
            String shiftStatus
    );

    List<Shift> findByShiftDateBetweenOrderByShiftDateAscStartTimeAsc(
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
            SELECT shift
            FROM Shift shift
            WHERE shift.employee.employeeId = :employeeId
              AND shift.shiftDate = :shiftDate
              AND shift.startTime < :endTime
              AND shift.endTime > :startTime
            ORDER BY shift.startTime ASC
            """)
    List<Shift> findOverlappingShifts(
            @Param("employeeId") Integer employeeId,
            @Param("shiftDate") LocalDate shiftDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}