package com.aurevia.staff.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LeaveRequestResponse(
        Integer leaveRequestId,
        Integer employeeId,
        String employeeName,
        Integer reviewedByHrManagerId,
        String reviewedByHrManagerName,
        LocalDateTime requestDate,
        LocalDate startDate,
        LocalDate endDate,
        String leaveType,
        String reason,
        String requestStatus,
        LocalDateTime reviewedDate
) {
}