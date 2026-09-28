package com.aurevia.staff.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.AttendanceCreateRequest;
import com.aurevia.staff.dto.AttendanceResponse;
import com.aurevia.staff.entity.Attendance;
import com.aurevia.staff.entity.Shift;
import com.aurevia.staff.mapper.AttendanceMapper;
import com.aurevia.staff.repository.AttendanceRepository;
import com.aurevia.staff.repository.ShiftRepository;
import com.aurevia.user.entity.Employee;
import com.aurevia.user.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;
    private final AttendanceMapper attendanceMapper;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            ShiftRepository shiftRepository,
            AttendanceMapper attendanceMapper
    ) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.shiftRepository = shiftRepository;
        this.attendanceMapper = attendanceMapper;
    }

    @Transactional
    public AttendanceResponse createAttendance(
            AttendanceCreateRequest request
    ) {
        validateTimes(request);

        Employee employee = employeeRepository
                .findById(request.employeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee",
                                "employeeId",
                                request.employeeId()
                        )
                );

        Shift shift = null;

        if (request.shiftId() != null) {
            shift = shiftRepository
                    .findById(request.shiftId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Shift",
                                    "shiftId",
                                    request.shiftId()
                            )
                    );

            validateShift(request, shift);

            if (attendanceRepository
                    .findByShiftShiftId(request.shiftId())
                    .isPresent()) {
                throw new BusinessRuleException(
                        "Attendance has already been recorded for this shift."
                );
            }
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setShift(shift);
        attendance.setAttendanceDate(
                request.attendanceDate()
        );
        attendance.setCheckInTime(request.checkInTime());
        attendance.setCheckOutTime(request.checkOutTime());
        attendance.setAttendanceStatus(
                request.attendanceStatus()
                        .trim()
                        .toUpperCase()
        );

        return attendanceMapper.toResponse(
                attendanceRepository.save(attendance)
        );
    }

    public AttendanceResponse getAttendanceById(
            Integer attendanceId
    ) {
        return attendanceMapper.toResponse(
                findAttendance(attendanceId)
        );
    }

    public List<AttendanceResponse> getEmployeeAttendance(
            Integer employeeId
    ) {
        return attendanceRepository
                .findByEmployeeEmployeeIdOrderByAttendanceDateDesc(
                        employeeId
                )
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceByDate(
            LocalDate attendanceDate
    ) {
        if (attendanceDate == null) {
            throw new IllegalArgumentException(
                    "Attendance date is required."
            );
        }

        return attendanceRepository
                .findByAttendanceDateOrderByEmployeeEmployeeIdAsc(
                        attendanceDate
                )
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceByStatus(
            String attendanceStatus
    ) {
        if (attendanceStatus == null
                || attendanceStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Attendance status is required."
            );
        }

        return attendanceRepository
                .findByAttendanceStatusIgnoreCaseOrderByAttendanceDateAsc(
                        attendanceStatus.trim()
                )
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getAttendanceByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required."
            );
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        return attendanceRepository
                .findByAttendanceDateBetweenOrderByAttendanceDateAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }

    private Attendance findAttendance(Integer attendanceId) {
        return attendanceRepository
                .findById(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance",
                                "attendanceId",
                                attendanceId
                        )
                );
    }

    private void validateTimes(
            AttendanceCreateRequest request
    ) {
        if (request.checkInTime() != null
                && request.checkOutTime() != null
                && !request.checkOutTime()
                .isAfter(request.checkInTime())) {

            throw new BusinessRuleException(
                    "Check-out time must be after check-in time."
            );
        }
    }

    private void validateShift(
            AttendanceCreateRequest request,
            Shift shift
    ) {
        if (!Objects.equals(
                shift.getEmployee().getEmployeeId(),
                request.employeeId()
        )) {
            throw new BusinessRuleException(
                    "The selected shift does not belong to this employee."
            );
        }

        if (!shift.getShiftDate().equals(
                request.attendanceDate()
        )) {
            throw new BusinessRuleException(
                    "Attendance date must match the selected shift date."
            );
        }
    }
}