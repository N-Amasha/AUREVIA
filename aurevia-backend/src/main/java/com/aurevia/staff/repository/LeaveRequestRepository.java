package com.aurevia.staff.repository;

import com.aurevia.staff.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Integer> {

    List<LeaveRequest>
    findByEmployeeEmployeeIdOrderByRequestDateDesc(
            Integer employeeId
    );

    List<LeaveRequest>
    findByRequestStatusIgnoreCaseOrderByRequestDateAsc(
            String requestStatus
    );

    List<LeaveRequest>
    findByReviewedByHrManagerEmployeeIdOrderByReviewedDateDesc(
            Integer hrManagerId
    );

    List<LeaveRequest>
    findByLeaveTypeIgnoreCaseOrderByStartDateAsc(
            String leaveType
    );

    @Query("""
            SELECT request
            FROM LeaveRequest request
            WHERE request.employee.employeeId = :employeeId
              AND request.startDate <= :endDate
              AND request.endDate >= :startDate
            ORDER BY request.startDate ASC
            """)
    List<LeaveRequest> findOverlappingLeaveRequests(
            @Param("employeeId") Integer employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}