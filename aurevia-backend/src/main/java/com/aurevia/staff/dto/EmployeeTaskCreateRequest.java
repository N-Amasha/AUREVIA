package com.aurevia.staff.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record EmployeeTaskCreateRequest(

        @NotNull(message = "Employee ID is required.")
        @Positive(message = "Employee ID must be positive.")
        Integer employeeId,

        @Positive(message = "Event ID must be positive.")
        Integer eventId,

        @NotBlank(message = "Task description is required.")
        String taskDescription,

        @NotNull(message = "Due date is required.")
        @FutureOrPresent(
                message = "Due date cannot be in the past."
        )
        LocalDate dueDate
) {
}