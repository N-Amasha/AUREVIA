package com.aurevia.staff.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.LeaveRequestCreateRequest;
import com.aurevia.staff.dto.LeaveRequestResponse;
import com.aurevia.staff.dto.LeaveRequestReviewRequest;
import com.aurevia.staff.entity.LeaveRequest;
import com.aurevia.staff.mapper.LeaveRequestMapper;
import com.aurevia.staff.repository.LeaveRequestRepository;
import com.aurevia.user.entity.Employee;
import com.aurevia.user.entity.HrManager;
import com.aurevia.user.repository.EmployeeRepository;
import com.aurevia.user.repository.HrManagerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class LeaveRequestService {

    private static final Set<String> REVIEW_STATUSES =
            Set.of("APPROVED", "REJECTED");

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final HrManagerRepository hrManagerRepository;
    private final LeaveRequestMapper leaveRequestMapper;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository,
            HrManagerRepository hrManagerRepository,
            LeaveRequestMapper leaveRequestMapper
    ) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.hrManagerRepository = hrManagerRepository;
        this.leaveRequestMapper = leaveRequestMapper;
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(
            LeaveRequestCreateRequest request
    ) {
        validateDateRange(request);

        Employee employee = employeeRepository
                .findById(request.employeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee",
                                "employeeId",
                                request.employeeId()
                        )
                );

        boolean hasActiveOverlap =
                leaveRequestRepository
                        .findOverlappingLeaveRequests(
                                request.employeeId(),
                                request.startDate(),
                                request.endDate()
                        )
                        .stream()
                        .anyMatch(existing ->
                                !"REJECTED".equalsIgnoreCase(
                                        existing.getRequestStatus()
                                )
                        );

        if (hasActiveOverlap) {
            throw new BusinessRuleException(
                    "The employee already has an overlapping leave request."
            );
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setRequestDate(LocalDateTime.now());
        leaveRequest.setStartDate(request.startDate());
        leaveRequest.setEndDate(request.endDate());
        leaveRequest.setLeaveType(
                request.leaveType().trim().toUpperCase()
        );
        leaveRequest.setReason(request.reason().trim());
        leaveRequest.setRequestStatus("PENDING");

        return leaveRequestMapper.toResponse(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    public LeaveRequestResponse getLeaveRequestById(
            Integer leaveRequestId
    ) {
        return leaveRequestMapper.toResponse(
                findLeaveRequest(leaveRequestId)
        );
    }

    public List<LeaveRequestResponse> getEmployeeLeaveRequests(
            Integer employeeId
    ) {
        return leaveRequestRepository
                .findByEmployeeEmployeeIdOrderByRequestDateDesc(
                        employeeId
                )
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    public List<LeaveRequestResponse> getLeaveRequestsByStatus(
            String requestStatus
    ) {
        if (requestStatus == null || requestStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Request status is required."
            );
        }

        return leaveRequestRepository
                .findByRequestStatusIgnoreCaseOrderByRequestDateAsc(
                        requestStatus.trim()
                )
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    public List<LeaveRequestResponse> getReviewedRequests(
            Integer hrManagerId
    ) {
        return leaveRequestRepository
                .findByReviewedByHrManagerEmployeeIdOrderByReviewedDateDesc(
                        hrManagerId
                )
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    public List<LeaveRequestResponse> getLeaveRequestsByType(
            String leaveType
    ) {
        if (leaveType == null || leaveType.isBlank()) {
            throw new IllegalArgumentException(
                    "Leave type is required."
            );
        }

        return leaveRequestRepository
                .findByLeaveTypeIgnoreCaseOrderByStartDateAsc(
                        leaveType.trim()
                )
                .stream()
                .map(leaveRequestMapper::toResponse)
                .toList();
    }

    @Transactional
    public LeaveRequestResponse reviewLeaveRequest(
            Integer leaveRequestId,
            LeaveRequestReviewRequest request
    ) {
        String newStatus =
                request.requestStatus()
                        .trim()
                        .toUpperCase();

        if (!REVIEW_STATUSES.contains(newStatus)) {
            throw new BusinessRuleException(
                    "Leave request status must be APPROVED or REJECTED."
            );
        }

        LeaveRequest leaveRequest =
                findLeaveRequest(leaveRequestId);

        if (!"PENDING".equalsIgnoreCase(
                leaveRequest.getRequestStatus()
        )) {
            throw new BusinessRuleException(
                    "Only pending leave requests can be reviewed."
            );
        }

        HrManager hrManager = hrManagerRepository
                .findById(request.hrManagerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "HR manager",
                                "employeeId",
                                request.hrManagerId()
                        )
                );

        leaveRequest.setReviewedByHrManager(hrManager);
        leaveRequest.setRequestStatus(newStatus);
        leaveRequest.setReviewedDate(LocalDateTime.now());

        return leaveRequestMapper.toResponse(
                leaveRequestRepository.save(leaveRequest)
        );
    }

    private LeaveRequest findLeaveRequest(
            Integer leaveRequestId
    ) {
        return leaveRequestRepository
                .findById(leaveRequestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request",
                                "leaveRequestId",
                                leaveRequestId
                        )
                );
    }

    private void validateDateRange(
            LeaveRequestCreateRequest request
    ) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new BusinessRuleException(
                    "Leave end date cannot be before start date."
            );
        }
    }
}