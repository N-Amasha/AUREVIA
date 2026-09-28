package com.aurevia.staff.controller;

import com.aurevia.staff.dto.ShiftCreateRequest;
import com.aurevia.staff.dto.ShiftResponse;
import com.aurevia.staff.dto.ShiftStatusUpdateRequest;
import com.aurevia.staff.service.ShiftService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @PostMapping
    public ResponseEntity<ShiftResponse> createShift(
            @Valid @RequestBody ShiftCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(shiftService.createShift(request));
    }

    @GetMapping("/{shiftId}")
    public ShiftResponse getShiftById(
            @PathVariable Integer shiftId
    ) {
        return shiftService.getShiftById(shiftId);
    }

    @GetMapping("/employees/{employeeId}")
    public List<ShiftResponse> getEmployeeShifts(
            @PathVariable Integer employeeId
    ) {
        return shiftService.getEmployeeShifts(employeeId);
    }

    @GetMapping("/date")
    public List<ShiftResponse> getShiftsByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate shiftDate
    ) {
        return shiftService.getShiftsByDate(shiftDate);
    }

    @GetMapping("/statuses/{shiftStatus}")
    public List<ShiftResponse> getShiftsByStatus(
            @PathVariable String shiftStatus
    ) {
        return shiftService.getShiftsByStatus(shiftStatus);
    }

    @GetMapping("/date-range")
    public List<ShiftResponse> getShiftsByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return shiftService.getShiftsByDateRange(
                startDate,
                endDate
        );
    }

    @PatchMapping("/{shiftId}/status")
    public ShiftResponse updateShiftStatus(
            @PathVariable Integer shiftId,
            @Valid @RequestBody
            ShiftStatusUpdateRequest request
    ) {
        return shiftService.updateShiftStatus(
                shiftId,
                request.status()
        );
    }
}