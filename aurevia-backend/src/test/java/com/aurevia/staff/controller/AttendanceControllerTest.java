package com.aurevia.staff.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.AttendanceCreateRequest;
import com.aurevia.staff.dto.AttendanceResponse;
import com.aurevia.staff.service.AttendanceService;
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
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AttendanceController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AttendanceService attendanceService;

    @Test
    void shouldCreateAttendance() throws Exception {
        AttendanceCreateRequest request =
                new AttendanceCreateRequest(
                        6,
                        1,
                        LocalDate.of(2026, 12, 10),
                        LocalTime.of(9, 0),
                        LocalTime.of(17, 0),
                        "PRESENT"
                );

        when(attendanceService.createAttendance(any()))
                .thenReturn(response());

        mockMvc.perform(post("/api/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.attendanceId").value(1))
                .andExpect(jsonPath("$.employeeId").value(6))
                .andExpect(jsonPath("$.shiftId").value(1))
                .andExpect(jsonPath("$.attendanceStatus")
                        .value("PRESENT"));
    }

    @Test
    void shouldRejectInvalidAttendanceRequest()
            throws Exception {

        AttendanceCreateRequest request =
                new AttendanceCreateRequest(
                        null,
                        null,
                        null,
                        null,
                        null,
                        ""
                );

        mockMvc.perform(post("/api/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.employeeId"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.attendanceDate"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.attendanceStatus"
                ).exists());
    }

    @Test
    void shouldGetAttendanceById() throws Exception {
        when(attendanceService.getAttendanceById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/attendance/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendanceId").value(1))
                .andExpect(jsonPath("$.employeeName")
                        .value("Charuka Perera"));
    }

    @Test
    void shouldReturnNotFoundForMissingAttendance()
            throws Exception {

        when(attendanceService.getAttendanceById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Attendance",
                        "attendanceId",
                        99
                ));

        mockMvc.perform(get("/api/attendance/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Attendance not found with attendanceId: 99"
                ));
    }

    @Test
    void shouldGetEmployeeAttendance() throws Exception {
        when(attendanceService.getEmployeeAttendance(6))
                .thenReturn(List.of(response()));

        mockMvc.perform(get(
                        "/api/attendance/employees/6"
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].attendanceId")
                        .value(1))
                .andExpect(jsonPath("$[0].employeeId")
                        .value(6));
    }

    @Test
    void shouldGetAttendanceByDateRange()
            throws Exception {

        when(attendanceService.getAttendanceByDateRange(
                LocalDate.of(2026, 12, 1),
                LocalDate.of(2026, 12, 31)
        )).thenReturn(List.of(response()));

        mockMvc.perform(get("/api/attendance/date-range")
                        .param("startDate", "2026-12-01")
                        .param("endDate", "2026-12-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].attendanceId")
                        .value(1));
    }

    private AttendanceResponse response() {
        return new AttendanceResponse(
                1,
                6,
                "Charuka Perera",
                1,
                LocalDate.of(2026, 12, 10),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                "PRESENT"
        );
    }
}