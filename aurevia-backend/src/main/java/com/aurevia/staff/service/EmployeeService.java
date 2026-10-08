package com.aurevia.staff.service;

import com.aurevia.auth.service.UserRoleService;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.EmployeeResponse;
import com.aurevia.user.entity.Employee;
import com.aurevia.user.entity.UserAccount;
import com.aurevia.user.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRoleService userRoleService;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRoleService userRoleService
    ) {
        this.employeeRepository = employeeRepository;
        this.userRoleService = userRoleService;
    }

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository
                .findAllByOrderByEmployeeIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public EmployeeResponse getEmployeeById(
            Integer employeeId
    ) {
        return toResponse(findEmployee(employeeId));
    }

    public EmployeeResponse getCurrentEmployee(
        String email
) {
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException(
                "Authenticated employee email is required."
        );
    }

    Employee employee = employeeRepository
            .findByUserAccountEmailIgnoreCase(
                    email.trim()
            )
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Employee",
                            "email",
                            email
                    )
            );

    return toResponse(employee);
}

    public List<EmployeeResponse> getEmployeesByStatus(
            String employmentStatus
    ) {
        if (
                employmentStatus == null
                        || employmentStatus.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Employment status is required."
            );
        }

        return employeeRepository
                .findByEmploymentStatusIgnoreCaseOrderByEmployeeIdAsc(
                        employmentStatus.trim()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Employee findEmployee(Integer employeeId) {
        return employeeRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee",
                                "employeeId",
                                employeeId
                        )
                );
    }

    private EmployeeResponse toResponse(
            Employee employee
    ) {
        UserAccount userAccount =
                employee.getUserAccount();

        Employee supervisor = employee.getSupervisor();

        String firstName = userAccount.getFirstName();
        String lastName = userAccount.getLastName();

        String fullName =
                (firstName + " " + lastName).trim();

        Integer supervisorId = null;
        String supervisorName = null;

        if (supervisor != null) {
            supervisorId = supervisor.getEmployeeId();

            UserAccount supervisorAccount =
                    supervisor.getUserAccount();

            supervisorName =
                    (
                            supervisorAccount.getFirstName()
                                    + " "
                                    + supervisorAccount.getLastName()
                    ).trim();
        }

        return new EmployeeResponse(
                employee.getEmployeeId(),
                userAccount.getUserId(),
                firstName,
                lastName,
                fullName,
                userAccount.getEmail(),
                employee.getHireDate(),
                employee.getSalary(),
                employee.getEmploymentStatus(),
                supervisorId,
                supervisorName,
                userRoleService.resolveRole(userAccount)
        );
    }
}