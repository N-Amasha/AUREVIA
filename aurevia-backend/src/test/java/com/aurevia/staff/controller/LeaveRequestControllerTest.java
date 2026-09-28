package com.aurevia.staff.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.LeaveRequestCreateRequest;
import com.aurevia.staff.dto.LeaveRequestResponse;
import com.aurevia.staff.dto.LeaveRequestReviewRequest;
import com.aurevia.staff.service.LeaveRequestService;
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
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LeaveRequestController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class LeaveRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LeaveRequestService leaveRequestService;

    @Test
    void shouldCreateLeaveRequest() throws Exception {
        LeaveRequestCreateRequest request =
                new LeaveRequestCreateRequest(
                        6,
                        LocalDate.now().plusDays(10),
                        LocalDate.now().plusDays(12),
                        "ANNUAL",
                        "Personal leave"
                );

        when(leaveRequestService.createLeaveRequest(any()))
                .thenReturn(pendingResponse());

        mockMvc.perform(post("/api/leave-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.leaveRequestId").value(1))
                .andExpect(jsonPath("$.employeeId").value(6))
                .andExpect(jsonPath("$.leaveType")
                        .value("ANNUAL"))
                .andExpect(jsonPath("$.requestStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldRejectInvalidCreateRequest()
            throws Exception {

        LeaveRequestCreateRequest request =
                new LeaveRequestCreateRequest(
                        null,
                        null,
                        null,
                        "",
                        ""
                );

        mockMvc.perform(post("/api/leave-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.employeeId"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.startDate"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.endDate"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.leaveType"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.reason"
                ).exists());
    }

    @Test
    void shouldGetLeaveRequestById() throws Exception {
        when(leaveRequestService.getLeaveRequestById(1))
                .thenReturn(pendingResponse());

        mockMvc.perform(get("/api/leave-requests/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.leaveRequestId")
                        .value(1))
                .andExpect(jsonPath("$.employeeName")
                        .value("Charuka Perera"));
    }

    @Test
    void shouldReturnNotFoundForMissingRequest()
            throws Exception {

        when(leaveRequestService.getLeaveRequestById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Leave request",
                        "leaveRequestId",
                        99
                ));

        mockMvc.perform(get("/api/leave-requests/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Leave request not found with leaveRequestId: 99"
                ));
    }

    @Test
    void shouldGetEmployeeLeaveRequests()
            throws Exception {

        when(leaveRequestService
                .getEmployeeLeaveRequests(6))
                .thenReturn(List.of(pendingResponse()));

        mockMvc.perform(get(
                        "/api/leave-requests/employees/6"
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].leaveRequestId")
                        .value(1))
                .andExpect(jsonPath("$[0].employeeId")
                        .value(6));
    }

    @Test
    void shouldGetPendingLeaveRequests()
            throws Exception {

        when(leaveRequestService
                .getLeaveRequestsByStatus("PENDING"))
                .thenReturn(List.of(pendingResponse()));

        mockMvc.perform(get(
                        "/api/leave-requests/statuses/PENDING"
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].requestStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldReviewLeaveRequest() throws Exception {
        LeaveRequestReviewRequest request =
                new LeaveRequestReviewRequest(
                        31,
                        "APPROVED"
                );

        when(leaveRequestService.reviewLeaveRequest(
                any(),
                any()
        )).thenReturn(approvedResponse());

        mockMvc.perform(patch(
                        "/api/leave-requests/1/review"
                )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestStatus")
                        .value("APPROVED"))
                .andExpect(jsonPath(
                        "$.reviewedByHrManagerId"
                ).value(31));
    }

    private LeaveRequestResponse pendingResponse() {
        return new LeaveRequestResponse(
                1,
                6,
                "Charuka Perera",
                null,
                null,
                LocalDateTime.of(
                        2026, 9, 28, 11, 20
                ),
                LocalDate.of(2026, 12, 10),
                LocalDate.of(2026, 12, 12),
                "ANNUAL",
                "Personal leave",
                "PENDING",
                null
        );
    }

    private LeaveRequestResponse approvedResponse() {
        return new LeaveRequestResponse(
                1,
                6,
                "Charuka Perera",
                31,
                "Nadeesha Fernando",
                LocalDateTime.of(
                        2026, 9, 28, 11, 20
                ),
                LocalDate.of(2026, 12, 10),
                LocalDate.of(2026, 12, 12),
                "ANNUAL",
                "Personal leave",
                "APPROVED",
                LocalDateTime.of(
                        2026, 9, 28, 11, 25
                )
        );
    }
}