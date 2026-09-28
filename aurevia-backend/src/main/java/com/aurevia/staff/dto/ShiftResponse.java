package com.aurevia.staff.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ShiftResponse(
        Integer shiftId,
        Integer employeeId,
        String employeeName,
        LocalDate shiftDate,
        LocalTime startTime,
        LocalTime endTime,
        String shiftStatus
) {
}