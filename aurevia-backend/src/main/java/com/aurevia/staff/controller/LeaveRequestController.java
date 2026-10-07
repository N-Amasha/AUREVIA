package com.aurevia.staff.controller;

import com.aurevia.staff.dto.LeaveRequestCreateRequest;
import com.aurevia.staff.dto.LeaveRequestResponse;
import com.aurevia.staff.dto.LeaveRequestReviewRequest;
import com.aurevia.staff.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService
    ) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequestResponse>
    createLeaveRequest(
            @Valid @RequestBody
            LeaveRequestCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        leaveRequestService
                                .createLeaveRequest(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequestResponse>>
    getAllLeaveRequests() {
        return ResponseEntity.ok(
                leaveRequestService.getAllLeaveRequests()
        );
    }

    @GetMapping("/{leaveRequestId}")
    public LeaveRequestResponse getLeaveRequestById(
            @PathVariable Integer leaveRequestId
    ) {
        return leaveRequestService.getLeaveRequestById(
                leaveRequestId
        );
    }

    @GetMapping("/employees/{employeeId}")
    public List<LeaveRequestResponse>
    getEmployeeLeaveRequests(
            @PathVariable Integer employeeId
    ) {
        return leaveRequestService.getEmployeeLeaveRequests(
                employeeId
        );
    }

    @GetMapping("/statuses/{requestStatus}")
    public List<LeaveRequestResponse>
    getLeaveRequestsByStatus(
            @PathVariable String requestStatus
    ) {
        return leaveRequestService.getLeaveRequestsByStatus(
                requestStatus
        );
    }

    @GetMapping("/reviewers/{hrManagerId}")
    public List<LeaveRequestResponse> getReviewedRequests(
            @PathVariable Integer hrManagerId
    ) {
        return leaveRequestService.getReviewedRequests(
                hrManagerId
        );
    }

    @GetMapping("/types/{leaveType}")
    public List<LeaveRequestResponse> getLeaveRequestsByType(
            @PathVariable String leaveType
    ) {
        return leaveRequestService.getLeaveRequestsByType(
                leaveType
        );
    }

    @PatchMapping("/{leaveRequestId}/review")
    public LeaveRequestResponse reviewLeaveRequest(
            @PathVariable Integer leaveRequestId,
            @Valid @RequestBody
            LeaveRequestReviewRequest request
    ) {
        return leaveRequestService.reviewLeaveRequest(
                leaveRequestId,
                request
        );
    }
}
