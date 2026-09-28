package com.aurevia.staff.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceResponse(
        Integer attendanceId,
        Integer employeeId,
        String employeeName,
        Integer shiftId,
        LocalDate attendanceDate,
        LocalTime checkInTime,
        LocalTime checkOutTime,
        String attendanceStatus
) {
}