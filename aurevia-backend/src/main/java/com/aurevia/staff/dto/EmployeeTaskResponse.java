package com.aurevia.staff.dto;

import java.time.LocalDate;

public record EmployeeTaskResponse(
        Integer taskId,
        Integer employeeId,
        String employeeName,
        Integer eventId,
        String eventName,
        String taskDescription,
        LocalDate assignedDate,
        LocalDate dueDate,
        String taskStatus,
        boolean overdue
) {
}