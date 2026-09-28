package com.aurevia.staff.dto;

import jakarta.validation.constraints.NotBlank;

public record EmployeeTaskStatusUpdateRequest(

        @NotBlank(message = "Task status is required.")
        String taskStatus
) {
}