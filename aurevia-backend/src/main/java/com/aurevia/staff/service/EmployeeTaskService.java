package com.aurevia.staff.service;

import com.aurevia.event.entity.Event;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.EmployeeTaskCreateRequest;
import com.aurevia.staff.dto.EmployeeTaskResponse;
import com.aurevia.staff.entity.EmployeeTask;
import com.aurevia.staff.mapper.EmployeeTaskMapper;
import com.aurevia.staff.repository.EmployeeTaskRepository;
import com.aurevia.user.entity.Employee;
import com.aurevia.user.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EmployeeTaskService {

    private final EmployeeTaskRepository employeeTaskRepository;
    private final EmployeeRepository employeeRepository;
    private final EventRepository eventRepository;
    private final EmployeeTaskMapper employeeTaskMapper;

    public EmployeeTaskService(
            EmployeeTaskRepository employeeTaskRepository,
            EmployeeRepository employeeRepository,
            EventRepository eventRepository,
            EmployeeTaskMapper employeeTaskMapper
    ) {
        this.employeeTaskRepository = employeeTaskRepository;
        this.employeeRepository = employeeRepository;
        this.eventRepository = eventRepository;
        this.employeeTaskMapper = employeeTaskMapper;
    }

    @Transactional
    public EmployeeTaskResponse createTask(
            EmployeeTaskCreateRequest request
    ) {
        Employee employee = employeeRepository
                .findById(request.employeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee",
                                "employeeId",
                                request.employeeId()
                        )
                );

        Event event = null;

        if (request.eventId() != null) {
            event = eventRepository
                    .findById(request.eventId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Event",
                                    "eventId",
                                    request.eventId()
                            )
                    );
        }

        EmployeeTask task = new EmployeeTask();
        task.setEmployee(employee);
        task.setEvent(event);
        task.setTaskDescription(
                request.taskDescription().trim()
        );
        task.setAssignedDate(LocalDate.now());
        task.setDueDate(request.dueDate());
        task.setTaskStatus("PENDING");

        return employeeTaskMapper.toResponse(
                employeeTaskRepository.save(task)
        );
    }

    public List<EmployeeTaskResponse> getAllTasks() {
        return employeeTaskRepository
                .findAllByOrderByDueDateAsc()
                .stream()
                .map(employeeTaskMapper::toResponse)
                .toList();
    }

    public EmployeeTaskResponse getTaskById(
            Integer taskId
    ) {
        return employeeTaskMapper.toResponse(
                findTask(taskId)
        );
    }

    public List<EmployeeTaskResponse> getEmployeeTasks(
        Integer employeeId
) {
    return employeeTaskRepository
            .findByEmployeeEmployeeIdOrderByDueDateAsc(
                    employeeId
            )
            .stream()
            .map(employeeTaskMapper::toResponse)
            .toList();
}

    public List<EmployeeTaskResponse> getEventTasks(
            Integer eventId
    ) {
        return employeeTaskRepository
                .findByEventEventIdOrderByDueDateAsc(eventId)
                .stream()
                .map(employeeTaskMapper::toResponse)
                .toList();
    }

    public List<EmployeeTaskResponse> getGeneralTasks() {
        return employeeTaskRepository
                .findByEventIsNullOrderByDueDateAsc()
                .stream()
                .map(employeeTaskMapper::toResponse)
                .toList();
    }

    public List<EmployeeTaskResponse> getTasksByStatus(
            String taskStatus
    ) {
        if (taskStatus == null || taskStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Task status is required."
            );
        }

        return employeeTaskRepository
                .findByTaskStatusIgnoreCaseOrderByDueDateAsc(
                        taskStatus.trim()
                )
                .stream()
                .map(employeeTaskMapper::toResponse)
                .toList();
    }

    public List<EmployeeTaskResponse> getTasksByDueDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required."
            );
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        return employeeTaskRepository
                .findByDueDateBetweenOrderByDueDateAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(employeeTaskMapper::toResponse)
                .toList();
    }

    public List<EmployeeTaskResponse> getOverdueTasks(
        LocalDate referenceDate
) {
    if (referenceDate == null) {
        throw new IllegalArgumentException(
                "Reference date is required."
        );
    }

    return employeeTaskRepository
            .findOverdueIncompleteTasks(referenceDate)
            .stream()
            .map(task ->
                    employeeTaskMapper.toResponse(
                            task,
                            referenceDate
                    )
            )
            .toList();
}

    @Transactional
    public EmployeeTaskResponse updateTaskStatus(
            Integer taskId,
            String taskStatus
    ) {
        if (taskStatus == null || taskStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Task status is required."
            );
        }

        EmployeeTask task = findTask(taskId);
        task.setTaskStatus(
                taskStatus.trim().toUpperCase()
        );

        return employeeTaskMapper.toResponse(
                employeeTaskRepository.save(task)
        );
    }

    private EmployeeTask findTask(Integer taskId) {
        return employeeTaskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee task",
                                "taskId",
                                taskId
                        )
                );
    }
}
