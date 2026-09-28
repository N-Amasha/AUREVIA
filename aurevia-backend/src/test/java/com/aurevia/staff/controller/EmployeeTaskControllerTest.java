package com.aurevia.staff.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.EmployeeTaskCreateRequest;
import com.aurevia.staff.dto.EmployeeTaskResponse;
import com.aurevia.staff.service.EmployeeTaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeTaskController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class EmployeeTaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmployeeTaskService employeeTaskService;

    @Test
    void shouldCreateTask() throws Exception {
        EmployeeTaskCreateRequest request =
                new EmployeeTaskCreateRequest(
                        6,
                        1,
                        "Prepare venue decorations",
                        LocalDate.now().plusDays(5)
                );

        when(employeeTaskService.createTask(any()))
                .thenReturn(response("PENDING", false));

        mockMvc.perform(post("/api/employee-tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taskId").value(1))
                .andExpect(jsonPath("$.employeeId").value(6))
                .andExpect(jsonPath("$.eventId").value(1))
                .andExpect(jsonPath("$.taskStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldRejectInvalidTaskRequest()
            throws Exception {

        EmployeeTaskCreateRequest request =
                new EmployeeTaskCreateRequest(
                        null,
                        null,
                        "",
                        null
                );

        mockMvc.perform(post("/api/employee-tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.employeeId"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.taskDescription"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.dueDate"
                ).exists());
    }

    @Test
    void shouldGetTaskById() throws Exception {
        when(employeeTaskService.getTaskById(1))
                .thenReturn(response("PENDING", false));

        mockMvc.perform(get("/api/employee-tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(1))
                .andExpect(jsonPath("$.employeeName")
                        .value("Charuka Perera"));
    }

    @Test
    void shouldReturnNotFoundForMissingTask()
            throws Exception {

        when(employeeTaskService.getTaskById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Employee task",
                        "taskId",
                        99
                ));

        mockMvc.perform(get("/api/employee-tasks/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Employee task not found with taskId: 99"
                ));
    }

    @Test
    void shouldGetEmployeeTasks() throws Exception {
        when(employeeTaskService.getEmployeeTasks(6))
                .thenReturn(List.of(
                        response("PENDING", false)
                ));

        mockMvc.perform(get(
                        "/api/employee-tasks/employees/6"
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].taskId").value(1))
                .andExpect(jsonPath("$[0].employeeId")
                        .value(6));
    }

    @Test
    void shouldGetEventTasks() throws Exception {
        when(employeeTaskService.getEventTasks(1))
                .thenReturn(List.of(
                        response("PENDING", false)
                ));

        mockMvc.perform(get(
                        "/api/employee-tasks/events/1"
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(1))
                .andExpect(jsonPath("$[0].eventName")
                        .value("Perera Wedding Reception"));
    }

    @Test
    void shouldGetOverdueTasks() throws Exception {
        LocalDate referenceDate =
                LocalDate.of(2026, 12, 20);

        when(employeeTaskService.getOverdueTasks(
                referenceDate
        )).thenReturn(List.of(
                response("IN_PROGRESS", true)
        ));

        mockMvc.perform(get(
                        "/api/employee-tasks/overdue"
                )
                        .param(
                                "referenceDate",
                                "2026-12-20"
                        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].overdue")
                        .value(true));
    }

    @Test
    void shouldUpdateTaskStatus() throws Exception {
        when(employeeTaskService.updateTaskStatus(
                1,
                "COMPLETED"
        )).thenReturn(response("COMPLETED", false));

        mockMvc.perform(patch(
                        "/api/employee-tasks/1/status"
                )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "taskStatus": "COMPLETED"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskStatus")
                        .value("COMPLETED"))
                .andExpect(jsonPath("$.overdue")
                        .value(false));
    }

    private EmployeeTaskResponse response(
            String taskStatus,
            boolean overdue
    ) {
        return new EmployeeTaskResponse(
                1,
                6,
                "Charuka Perera",
                1,
                "Perera Wedding Reception",
                "Prepare venue decorations",
                LocalDate.of(2026, 9, 28),
                LocalDate.of(2026, 12, 10),
                taskStatus,
                overdue
        );
    }
}