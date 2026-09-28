package com.aurevia.staff.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record LeaveRequestCreateRequest(

        @NotNull(message = "Employee ID is required.")
        @Positive(message = "Employee ID must be positive.")
        Integer employeeId,

        @NotNull(message = "Start date is required.")
        @FutureOrPresent(
                message = "Start date cannot be in the past."
        )
        LocalDate startDate,

        @NotNull(message = "End date is required.")
        @FutureOrPresent(
                message = "End date cannot be in the past."
        )
        LocalDate endDate,

        @NotBlank(message = "Leave type is required.")
        String leaveType,

        @NotBlank(message = "Reason is required.")
        String reason
) {
}