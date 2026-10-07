package com.aurevia.staff.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeResponse(
        Integer employeeId,
        Integer userId,
        String firstName,
        String lastName,
        String fullName,
        String email,
        LocalDate hireDate,
        BigDecimal salary,
        String employmentStatus,
        Integer supervisorId,
        String supervisorName,
        String role
) {
}