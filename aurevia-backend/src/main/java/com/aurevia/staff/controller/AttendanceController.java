package com.aurevia.staff.controller;

import com.aurevia.staff.dto.AttendanceCreateRequest;
import com.aurevia.staff.dto.AttendanceResponse;
import com.aurevia.staff.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService
    ) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceResponse> createAttendance(
            @Valid @RequestBody
            AttendanceCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        attendanceService.createAttendance(
                                request
                        )
                );
    }

    @GetMapping("/{attendanceId}")
    public AttendanceResponse getAttendanceById(
            @PathVariable Integer attendanceId
    ) {
        return attendanceService.getAttendanceById(
                attendanceId
        );
    }

    @GetMapping("/employees/{employeeId}")
    public List<AttendanceResponse> getEmployeeAttendance(
            @PathVariable Integer employeeId
    ) {
        return attendanceService.getEmployeeAttendance(
                employeeId
        );
    }

    @GetMapping("/date")
    public List<AttendanceResponse> getAttendanceByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate attendanceDate
    ) {
        return attendanceService.getAttendanceByDate(
                attendanceDate
        );
    }

    @GetMapping("/statuses/{attendanceStatus}")
    public List<AttendanceResponse> getAttendanceByStatus(
            @PathVariable String attendanceStatus
    ) {
        return attendanceService.getAttendanceByStatus(
                attendanceStatus
        );
    }

    @GetMapping("/date-range")
    public List<AttendanceResponse> getAttendanceByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return attendanceService.getAttendanceByDateRange(
                startDate,
                endDate
        );
    }
}