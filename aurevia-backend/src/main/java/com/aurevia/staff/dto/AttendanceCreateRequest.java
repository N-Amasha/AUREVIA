package com.aurevia.staff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceCreateRequest(

        @NotNull(message = "Employee ID is required.")
        @Positive(message = "Employee ID must be positive.")
        Integer employeeId,

        @Positive(message = "Shift ID must be positive.")
        Integer shiftId,

        @NotNull(message = "Attendance date is required.")
        LocalDate attendanceDate,

        LocalTime checkInTime,

        LocalTime checkOutTime,

        @NotBlank(message = "Attendance status is required.")
        String attendanceStatus
) {
}