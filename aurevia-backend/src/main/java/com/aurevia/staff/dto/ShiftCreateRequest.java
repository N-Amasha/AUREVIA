package com.aurevia.staff.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record ShiftCreateRequest(

        @NotNull(message = "Employee ID is required.")
        @Positive(message = "Employee ID must be positive.")
        Integer employeeId,

        @NotNull(message = "Shift date is required.")
        @FutureOrPresent(
                message = "Shift date cannot be in the past."
        )
        LocalDate shiftDate,

        @NotNull(message = "Start time is required.")
        LocalTime startTime,

        @NotNull(message = "End time is required.")
        LocalTime endTime
) {
}