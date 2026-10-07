package com.aurevia.staff.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.staff.dto.ShiftCreateRequest;
import com.aurevia.staff.dto.ShiftResponse;
import com.aurevia.staff.entity.Shift;
import com.aurevia.staff.mapper.ShiftMapper;
import com.aurevia.staff.repository.ShiftRepository;
import com.aurevia.user.entity.Employee;
import com.aurevia.user.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;
    private final ShiftMapper shiftMapper;

    public ShiftService(
            ShiftRepository shiftRepository,
            EmployeeRepository employeeRepository,
            ShiftMapper shiftMapper
    ) {
        this.shiftRepository = shiftRepository;
        this.employeeRepository = employeeRepository;
        this.shiftMapper = shiftMapper;
    }

    @Transactional
    public ShiftResponse createShift(ShiftCreateRequest request) {
        validateTimeRange(request);

        Employee employee = employeeRepository
                .findById(request.employeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee",
                                "employeeId",
                                request.employeeId()
                        )
                );

        boolean overlaps = !shiftRepository
                .findOverlappingShifts(
                        request.employeeId(),
                        request.shiftDate(),
                        request.startTime(),
                        request.endTime()
                )
                .isEmpty();

        if (overlaps) {
            throw new BusinessRuleException(
                    "The employee already has an overlapping shift."
            );
        }

        Shift shift = new Shift();
        shift.setEmployee(employee);
        shift.setShiftDate(request.shiftDate());
        shift.setStartTime(request.startTime());
        shift.setEndTime(request.endTime());
        shift.setShiftStatus("SCHEDULED");

        return shiftMapper.toResponse(
                shiftRepository.save(shift)
        );
    }

    public List<ShiftResponse> getAllShifts() {
        return shiftRepository
                .findAllByOrderByShiftDateAscStartTimeAsc()
                .stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    public ShiftResponse getShiftById(Integer shiftId) {
        return shiftMapper.toResponse(findShift(shiftId));
    }

    public List<ShiftResponse> getEmployeeShifts(
            Integer employeeId
    ) {
        return shiftRepository
                .findByEmployeeEmployeeIdOrderByShiftDateAscStartTimeAsc(
                        employeeId
                )
                .stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    public List<ShiftResponse> getShiftsByDate(
            LocalDate shiftDate
    ) {
        if (shiftDate == null) {
            throw new IllegalArgumentException(
                    "Shift date is required."
            );
        }

        return shiftRepository
                .findByShiftDateOrderByStartTimeAsc(shiftDate)
                .stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    public List<ShiftResponse> getShiftsByStatus(
            String shiftStatus
    ) {
        if (shiftStatus == null || shiftStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Shift status is required."
            );
        }

        return shiftRepository
                .findByShiftStatusIgnoreCaseOrderByShiftDateAscStartTimeAsc(
                        shiftStatus.trim()
                )
                .stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    public List<ShiftResponse> getShiftsByDateRange(
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

        return shiftRepository
                .findByShiftDateBetweenOrderByShiftDateAscStartTimeAsc(
                        startDate,
                        endDate
                )
                .stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    @Transactional
    public ShiftResponse updateShiftStatus(
            Integer shiftId,
            String shiftStatus
    ) {
        if (shiftStatus == null || shiftStatus.isBlank()) {
            throw new IllegalArgumentException(
                    "Shift status is required."
            );
        }

        Shift shift = findShift(shiftId);
        shift.setShiftStatus(
                shiftStatus.trim().toUpperCase()
        );

        return shiftMapper.toResponse(
                shiftRepository.save(shift)
        );
    }

    private Shift findShift(Integer shiftId) {
        return shiftRepository.findById(shiftId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shift",
                                "shiftId",
                                shiftId
                        )
                );
    }

    private void validateTimeRange(
            ShiftCreateRequest request
    ) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessRuleException(
                    "Shift end time must be after start time."
            );
        }
    }
}
