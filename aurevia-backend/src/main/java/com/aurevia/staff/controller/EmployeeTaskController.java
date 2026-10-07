package com.aurevia.staff.controller;

import com.aurevia.staff.dto.EmployeeTaskCreateRequest;
import com.aurevia.staff.dto.EmployeeTaskResponse;
import com.aurevia.staff.dto.EmployeeTaskStatusUpdateRequest;
import com.aurevia.staff.service.EmployeeTaskService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee-tasks")
public class EmployeeTaskController {

    private final EmployeeTaskService employeeTaskService;

    public EmployeeTaskController(
            EmployeeTaskService employeeTaskService
    ) {
        this.employeeTaskService = employeeTaskService;
    }

    @PostMapping
    public ResponseEntity<EmployeeTaskResponse> createTask(
            @Valid @RequestBody
            EmployeeTaskCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        employeeTaskService.createTask(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<EmployeeTaskResponse>> getAllTasks() {
        return ResponseEntity.ok(
                employeeTaskService.getAllTasks()
        );
    }

    @GetMapping("/{taskId}")
    public EmployeeTaskResponse getTaskById(
            @PathVariable Integer taskId
    ) {
        return employeeTaskService.getTaskById(taskId);
    }

    @GetMapping("/employees/{employeeId}")
    public List<EmployeeTaskResponse> getEmployeeTasks(
            @PathVariable Integer employeeId
    ) {
        return employeeTaskService.getEmployeeTasks(
                employeeId
        );
    }

    @GetMapping("/events/{eventId}")
    public List<EmployeeTaskResponse> getEventTasks(
            @PathVariable Integer eventId
    ) {
        return employeeTaskService.getEventTasks(eventId);
    }

    @GetMapping("/general")
    public List<EmployeeTaskResponse> getGeneralTasks() {
        return employeeTaskService.getGeneralTasks();
    }

    @GetMapping("/statuses/{taskStatus}")
    public List<EmployeeTaskResponse> getTasksByStatus(
            @PathVariable String taskStatus
    ) {
        return employeeTaskService.getTasksByStatus(
                taskStatus
        );
    }

    @GetMapping("/due-date-range")
    public List<EmployeeTaskResponse> getTasksByDueDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return employeeTaskService.getTasksByDueDateRange(
                startDate,
                endDate
        );
    }

    @GetMapping("/overdue")
    public List<EmployeeTaskResponse> getOverdueTasks(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate referenceDate
    ) {
        return employeeTaskService.getOverdueTasks(
                referenceDate
        );
    }

    @PatchMapping("/{taskId}/status")
    public EmployeeTaskResponse updateTaskStatus(
            @PathVariable Integer taskId,
            @Valid @RequestBody
            EmployeeTaskStatusUpdateRequest request
    ) {
        return employeeTaskService.updateTaskStatus(
                taskId,
                request.taskStatus()
        );
    }
}
