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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeTaskServiceTest {

    @Mock
    private EmployeeTaskRepository employeeTaskRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EmployeeTaskMapper employeeTaskMapper;

    private EmployeeTaskService employeeTaskService;

    @BeforeEach
    void setUp() {
        employeeTaskService = new EmployeeTaskService(
                employeeTaskRepository,
                employeeRepository,
                eventRepository,
                employeeTaskMapper
        );
    }

    @Test
    void shouldCreateEventTask() {
        EmployeeTaskCreateRequest request =
                new EmployeeTaskCreateRequest(
                        6,
                        1,
                        "Prepare venue decorations",
                        LocalDate.now().plusDays(5)
                );

        Employee employee = mock(Employee.class);
        Event event = mock(Event.class);
        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));

        when(employeeTaskRepository.save(
                any(EmployeeTask.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );

        when(employeeTaskMapper.toResponse(
                any(EmployeeTask.class)
        )).thenReturn(response);

        assertEquals(
                response,
                employeeTaskService.createTask(request)
        );

        verify(employeeTaskRepository)
                .save(any(EmployeeTask.class));
    }

    @Test
    void shouldCreateGeneralTaskWithoutEvent() {
        EmployeeTaskCreateRequest request =
                new EmployeeTaskCreateRequest(
                        6,
                        null,
                        "Complete general cleaning",
                        LocalDate.now().plusDays(2)
                );

        Employee employee = mock(Employee.class);
        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(employeeTaskRepository.save(
                any(EmployeeTask.class)
        )).thenAnswer(invocation -> {
            EmployeeTask task = invocation.getArgument(0);
            assertNull(task.getEvent());
            return task;
        });

        when(employeeTaskMapper.toResponse(
                any(EmployeeTask.class)
        )).thenReturn(response);

        assertEquals(
                response,
                employeeTaskService.createTask(request)
        );

        verify(eventRepository, never()).findById(any());
    }

    @Test
    void shouldRejectMissingEmployee() {
        EmployeeTaskCreateRequest request =
                validRequest();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeTaskService.createTask(request)
        );

        verify(employeeTaskRepository, never()).save(any());
    }

    @Test
    void shouldRejectMissingEvent() {
        EmployeeTaskCreateRequest request =
                validRequest();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(mock(Employee.class)));

        when(eventRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeTaskService.createTask(request)
        );

        verify(employeeTaskRepository, never()).save(any());
    }

    @Test
    void shouldGetTaskById() {
        EmployeeTask task = new EmployeeTask();
        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeTaskRepository.findById(1))
                .thenReturn(Optional.of(task));

        when(employeeTaskMapper.toResponse(task))
                .thenReturn(response);

        assertEquals(
                response,
                employeeTaskService.getTaskById(1)
        );
    }

    @Test
    void shouldRejectMissingTask() {
        when(employeeTaskRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeTaskService.getTaskById(99)
        );
    }

    @Test
    void shouldGetEmployeeTasks() {
        EmployeeTask task = new EmployeeTask();
        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeTaskRepository
                .findByEmployeeEmployeeIdOrderByDueDateAsc(6))
                .thenReturn(List.of(task));

        when(employeeTaskMapper.toResponse(task))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                employeeTaskService.getEmployeeTasks(6)
        );
    }

    @Test
    void shouldRejectInvalidDueDateRange() {
        assertThrows(
                IllegalArgumentException.class,
                () -> employeeTaskService
                        .getTasksByDueDateRange(
                                LocalDate.of(2026, 12, 31),
                                LocalDate.of(2026, 12, 1)
                        )
        );
    }

    @Test
    void shouldGetOverdueTasks() {
        LocalDate referenceDate =
                LocalDate.of(2026, 12, 20);

        EmployeeTask task = new EmployeeTask();
        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeTaskRepository
                .findOverdueIncompleteTasks(referenceDate))
                .thenReturn(List.of(task));

        when(employeeTaskMapper.toResponse(
                task,
                referenceDate
        )).thenReturn(response);
        assertEquals(
                List.of(response),
                employeeTaskService.getOverdueTasks(
                        referenceDate
                )
        );
    }

    @Test
    void shouldUpdateTaskStatus() {
        EmployeeTask task = new EmployeeTask();
        task.setTaskStatus("PENDING");

        EmployeeTaskResponse response =
                mock(EmployeeTaskResponse.class);

        when(employeeTaskRepository.findById(1))
                .thenReturn(Optional.of(task));

        when(employeeTaskRepository.save(task))
                .thenReturn(task);

        when(employeeTaskMapper.toResponse(task))
                .thenReturn(response);

        EmployeeTaskResponse result =
                employeeTaskService.updateTaskStatus(
                        1,
                        "completed"
                );

        assertEquals("COMPLETED", task.getTaskStatus());
        assertEquals(response, result);
    }

    private EmployeeTaskCreateRequest validRequest() {
        return new EmployeeTaskCreateRequest(
                6,
                1,
                "Prepare venue decorations",
                LocalDate.now().plusDays(5)
        );
    }
}