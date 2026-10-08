package com.aurevia.staff.controller;

import com.aurevia.staff.dto.EmployeeResponse;
import com.aurevia.staff.service.EmployeeService;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(
            EmployeeService employeeService
    ) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>>
    getAllEmployees() {
        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }

    @GetMapping("/me")
public ResponseEntity<EmployeeResponse>
getCurrentEmployee(
        Principal principal
) {
    return ResponseEntity.ok(
            employeeService.getCurrentEmployee(
                    principal.getName()
            )
    );
}

    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse>
    getEmployeeById(
            @PathVariable
            @Positive(
                    message =
                            "Employee ID must be greater than zero."
            )
            Integer employeeId
    ) {
        return ResponseEntity.ok(
                employeeService.getEmployeeById(employeeId)
        );
    }

    @GetMapping("/statuses/{employmentStatus}")
    public ResponseEntity<List<EmployeeResponse>>
    getEmployeesByStatus(
            @PathVariable String employmentStatus
    ) {
        return ResponseEntity.ok(
                employeeService.getEmployeesByStatus(
                        employmentStatus
                )
        );
    }
}