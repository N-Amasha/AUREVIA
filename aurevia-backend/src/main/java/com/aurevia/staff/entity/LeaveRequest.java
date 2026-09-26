package com.aurevia.staff.entity;

import com.aurevia.user.entity.Employee;
import com.aurevia.user.entity.HrManager;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_request")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_request_id")
    private Integer leaveRequestId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_hr_manager_id")
    private HrManager reviewedByHrManager;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "leave_type", nullable = false, length = 50)
    private String leaveType;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "request_status", nullable = false, length = 30)
    private String requestStatus;

    @Column(name = "reviewed_date")
    private LocalDateTime reviewedDate;

    public Integer getLeaveRequestId() {
        return leaveRequestId;
    }

    public void setLeaveRequestId(Integer leaveRequestId) {
        this.leaveRequestId = leaveRequestId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public HrManager getReviewedByHrManager() {
        return reviewedByHrManager;
    }

    public void setReviewedByHrManager(
            HrManager reviewedByHrManager
    ) {
        this.reviewedByHrManager = reviewedByHrManager;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public LocalDateTime getReviewedDate() {
        return reviewedDate;
    }

    public void setReviewedDate(LocalDateTime reviewedDate) {
        this.reviewedDate = reviewedDate;
    }
}