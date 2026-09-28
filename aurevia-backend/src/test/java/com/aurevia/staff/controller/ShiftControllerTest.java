package com.aurevia.staff.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.ShiftCreateRequest;
import com.aurevia.staff.dto.ShiftResponse;
import com.aurevia.staff.service.ShiftService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShiftController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ShiftControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ShiftService shiftService;

    @Test
    void shouldCreateShift() throws Exception {
        LocalDate shiftDate = LocalDate.now().plusDays(5);

        ShiftCreateRequest request =
                new ShiftCreateRequest(
                        6,
                        shiftDate,
                        LocalTime.of(9, 0),
                        LocalTime.of(17, 0)
                );

        ShiftResponse response =
                response(1, shiftDate, "SCHEDULED");

        when(shiftService.createShift(any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/shifts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.shiftId").value(1))
                .andExpect(jsonPath("$.employeeId").value(6))
                .andExpect(jsonPath("$.employeeName")
                        .value("Charuka Perera"))
                .andExpect(jsonPath("$.shiftStatus")
                        .value("SCHEDULED"));
    }

    @Test
    void shouldRejectInvalidCreateRequest() throws Exception {
        ShiftCreateRequest request =
                new ShiftCreateRequest(
                        null,
                        null,
                        null,
                        null
                );

        mockMvc.perform(post("/api/shifts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.employeeId"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.shiftDate"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.startTime"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.endTime"
                ).exists());
    }

    @Test
    void shouldGetShiftById() throws Exception {
        when(shiftService.getShiftById(1))
                .thenReturn(response(
                        1,
                        LocalDate.of(2026, 12, 10),
                        "SCHEDULED"
                ));

        mockMvc.perform(get("/api/shifts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shiftId").value(1))
                .andExpect(jsonPath("$.employeeId").value(6));
    }

    @Test
    void shouldReturnNotFoundForMissingShift()
            throws Exception {

        when(shiftService.getShiftById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Shift",
                        "shiftId",
                        99
                ));

        mockMvc.perform(get("/api/shifts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Shift not found with shiftId: 99"
                ));
    }

    @Test
    void shouldGetEmployeeShifts() throws Exception {
        when(shiftService.getEmployeeShifts(6))
                .thenReturn(List.of(
                        response(
                                1,
                                LocalDate.of(2026, 12, 10),
                                "SCHEDULED"
                        )
                ));

        mockMvc.perform(get("/api/shifts/employees/6"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].shiftId").value(1))
                .andExpect(jsonPath("$[0].employeeId").value(6));
    }

    @Test
    void shouldGetShiftsByDateRange() throws Exception {
        when(shiftService.getShiftsByDateRange(
                LocalDate.of(2026, 12, 1),
                LocalDate.of(2026, 12, 31)
        )).thenReturn(List.of(
                response(
                        1,
                        LocalDate.of(2026, 12, 10),
                        "SCHEDULED"
                )
        ));

        mockMvc.perform(get("/api/shifts/date-range")
                        .param("startDate", "2026-12-01")
                        .param("endDate", "2026-12-31"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].shiftId").value(1));
    }

    @Test
    void shouldUpdateShiftStatus() throws Exception {
        when(shiftService.updateShiftStatus(
                1,
                "COMPLETED"
        )).thenReturn(response(
                1,
                LocalDate.of(2026, 12, 10),
                "COMPLETED"
        ));

        mockMvc.perform(patch("/api/shifts/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "COMPLETED"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shiftStatus")
                        .value("COMPLETED"));
    }

    private ShiftResponse response(
            Integer shiftId,
            LocalDate shiftDate,
            String shiftStatus
    ) {
        return new ShiftResponse(
                shiftId,
                6,
                "Charuka Perera",
                shiftDate,
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                shiftStatus
        );
    }
}