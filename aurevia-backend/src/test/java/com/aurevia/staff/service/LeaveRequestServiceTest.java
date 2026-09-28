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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeaveRequestServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private HrManagerRepository hrManagerRepository;

    @Mock
    private LeaveRequestMapper leaveRequestMapper;

    private LeaveRequestService leaveRequestService;

    @BeforeEach
    void setUp() {
        leaveRequestService = new LeaveRequestService(
                leaveRequestRepository,
                employeeRepository,
                hrManagerRepository,
                leaveRequestMapper
        );
    }

    @Test
    void shouldCreateLeaveRequest() {
        LeaveRequestCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        LeaveRequestResponse response =
                mock(LeaveRequestResponse.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(leaveRequestRepository
                .findOverlappingLeaveRequests(
                        6,
                        request.startDate(),
                        request.endDate()
                ))
                .thenReturn(List.of());

        when(leaveRequestRepository.save(
                any(LeaveRequest.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );

        when(leaveRequestMapper.toResponse(
                any(LeaveRequest.class)
        )).thenReturn(response);

        assertEquals(
                response,
                leaveRequestService.createLeaveRequest(request)
        );

        verify(leaveRequestRepository)
                .save(any(LeaveRequest.class));
    }

    @Test
    void shouldRejectInvalidDateRange() {
        LeaveRequestCreateRequest request =
                new LeaveRequestCreateRequest(
                        6,
                        LocalDate.of(2026, 12, 10),
                        LocalDate.of(2026, 12, 5),
                        "ANNUAL",
                        "Personal leave"
                );

        assertThrows(
                BusinessRuleException.class,
                () -> leaveRequestService
                        .createLeaveRequest(request)
        );

        verify(employeeRepository, never()).findById(any());
    }

    @Test
    void shouldRejectMissingEmployee() {
        LeaveRequestCreateRequest request = validRequest();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> leaveRequestService
                        .createLeaveRequest(request)
        );

        verify(leaveRequestRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectOverlappingActiveLeave() {
        LeaveRequestCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        LeaveRequest existing = new LeaveRequest();
        existing.setRequestStatus("PENDING");

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(leaveRequestRepository
                .findOverlappingLeaveRequests(
                        6,
                        request.startDate(),
                        request.endDate()
                ))
                .thenReturn(List.of(existing));

        assertThrows(
                BusinessRuleException.class,
                () -> leaveRequestService
                        .createLeaveRequest(request)
        );

        verify(leaveRequestRepository, never())
                .save(any());
    }

    @Test
    void shouldGetLeaveRequestById() {
        LeaveRequest leaveRequest = new LeaveRequest();
        LeaveRequestResponse response =
                mock(LeaveRequestResponse.class);

        when(leaveRequestRepository.findById(1))
                .thenReturn(Optional.of(leaveRequest));

        when(leaveRequestMapper.toResponse(leaveRequest))
                .thenReturn(response);

        assertEquals(
                response,
                leaveRequestService.getLeaveRequestById(1)
        );
    }

    @Test
    void shouldRejectMissingLeaveRequest() {
        when(leaveRequestRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> leaveRequestService
                        .getLeaveRequestById(99)
        );
    }

    @Test
    void shouldGetEmployeeLeaveRequests() {
        LeaveRequest leaveRequest = new LeaveRequest();
        LeaveRequestResponse response =
                mock(LeaveRequestResponse.class);

        when(leaveRequestRepository
                .findByEmployeeEmployeeIdOrderByRequestDateDesc(
                        6
                ))
                .thenReturn(List.of(leaveRequest));

        when(leaveRequestMapper.toResponse(leaveRequest))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                leaveRequestService
                        .getEmployeeLeaveRequests(6)
        );
    }

    @Test
    void shouldRejectInvalidReviewStatus() {
        LeaveRequestReviewRequest request =
                new LeaveRequestReviewRequest(
                        31,
                        "UNKNOWN"
                );

        assertThrows(
                BusinessRuleException.class,
                () -> leaveRequestService.reviewLeaveRequest(
                        1,
                        request
                )
        );

        verify(leaveRequestRepository, never())
                .findById(any());
    }

    @Test
    void shouldRejectAlreadyReviewedRequest() {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setRequestStatus("APPROVED");

        when(leaveRequestRepository.findById(1))
                .thenReturn(Optional.of(leaveRequest));

        LeaveRequestReviewRequest request =
                new LeaveRequestReviewRequest(
                        31,
                        "REJECTED"
                );

        assertThrows(
                BusinessRuleException.class,
                () -> leaveRequestService.reviewLeaveRequest(
                        1,
                        request
                )
        );

        verify(hrManagerRepository, never())
                .findById(any());
    }

    @Test
    void shouldRejectMissingHrManager() {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setRequestStatus("PENDING");

        when(leaveRequestRepository.findById(1))
                .thenReturn(Optional.of(leaveRequest));

        when(hrManagerRepository.findById(31))
                .thenReturn(Optional.empty());

        LeaveRequestReviewRequest request =
                new LeaveRequestReviewRequest(
                        31,
                        "APPROVED"
                );

        assertThrows(
                ResourceNotFoundException.class,
                () -> leaveRequestService.reviewLeaveRequest(
                        1,
                        request
                )
        );

        verify(leaveRequestRepository, never())
                .save(any());
    }

    @Test
    void shouldApproveLeaveRequest() {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setRequestStatus("PENDING");

        HrManager hrManager = mock(HrManager.class);
        LeaveRequestResponse response =
                mock(LeaveRequestResponse.class);

        when(leaveRequestRepository.findById(1))
                .thenReturn(Optional.of(leaveRequest));

        when(hrManagerRepository.findById(31))
                .thenReturn(Optional.of(hrManager));

        when(leaveRequestRepository.save(leaveRequest))
                .thenReturn(leaveRequest);

        when(leaveRequestMapper.toResponse(leaveRequest))
                .thenReturn(response);

        LeaveRequestResponse result =
                leaveRequestService.reviewLeaveRequest(
                        1,
                        new LeaveRequestReviewRequest(
                                31,
                                "approved"
                        )
                );

        assertEquals(
                "APPROVED",
                leaveRequest.getRequestStatus()
        );
        assertEquals(hrManager,
                leaveRequest.getReviewedByHrManager());
        assertEquals(response, result);
    }

    private LeaveRequestCreateRequest validRequest() {
        return new LeaveRequestCreateRequest(
                6,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(12),
                "ANNUAL",
                "Personal leave"
        );
    }
}