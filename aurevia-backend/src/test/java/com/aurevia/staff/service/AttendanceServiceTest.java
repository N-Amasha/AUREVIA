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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
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
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private AttendanceMapper attendanceMapper;

    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        attendanceService = new AttendanceService(
                attendanceRepository,
                employeeRepository,
                shiftRepository,
                attendanceMapper
        );
    }

    @Test
    void shouldCreateAttendanceForShift() {
        AttendanceCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        Shift shift = mock(Shift.class);
        AttendanceResponse response =
                mock(AttendanceResponse.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findById(1))
                .thenReturn(Optional.of(shift));

        when(shift.getEmployee()).thenReturn(employee);
        when(employee.getEmployeeId()).thenReturn(6);
        when(shift.getShiftDate())
                .thenReturn(request.attendanceDate());

        when(attendanceRepository.findByShiftShiftId(1))
                .thenReturn(Optional.empty());

        when(attendanceRepository.save(any(Attendance.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(attendanceMapper.toResponse(any(Attendance.class)))
                .thenReturn(response);

        assertEquals(
                response,
                attendanceService.createAttendance(request)
        );

        verify(attendanceRepository)
                .save(any(Attendance.class));
    }

    @Test
    void shouldRejectInvalidAttendanceTimes() {
        AttendanceCreateRequest request =
                new AttendanceCreateRequest(
                        6,
                        1,
                        LocalDate.of(2026, 12, 10),
                        LocalTime.of(17, 0),
                        LocalTime.of(9, 0),
                        "PRESENT"
                );

        assertThrows(
                BusinessRuleException.class,
                () -> attendanceService.createAttendance(request)
        );

        verify(employeeRepository, never()).findById(any());
    }

    @Test
    void shouldRejectMissingEmployee() {
        AttendanceCreateRequest request = validRequest();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> attendanceService.createAttendance(request)
        );

        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void shouldRejectMissingShift() {
        AttendanceCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> attendanceService.createAttendance(request)
        );

        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void shouldRejectShiftBelongingToAnotherEmployee() {
        AttendanceCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        Employee otherEmployee = mock(Employee.class);
        Shift shift = mock(Shift.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findById(1))
                .thenReturn(Optional.of(shift));

        when(shift.getEmployee())
                .thenReturn(otherEmployee);

        when(otherEmployee.getEmployeeId())
                .thenReturn(7);

        assertThrows(
                BusinessRuleException.class,
                () -> attendanceService.createAttendance(request)
        );

        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void shouldRejectDuplicateShiftAttendance() {
        AttendanceCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        Shift shift = mock(Shift.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findById(1))
                .thenReturn(Optional.of(shift));

        when(shift.getEmployee()).thenReturn(employee);
        when(employee.getEmployeeId()).thenReturn(6);
        when(shift.getShiftDate())
                .thenReturn(request.attendanceDate());

        when(attendanceRepository.findByShiftShiftId(1))
                .thenReturn(Optional.of(new Attendance()));

        assertThrows(
                BusinessRuleException.class,
                () -> attendanceService.createAttendance(request)
        );

        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void shouldRejectMissingAttendance() {
        when(attendanceRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> attendanceService.getAttendanceById(99)
        );
    }

    @Test
    void shouldGetEmployeeAttendance() {
        Attendance attendance = new Attendance();
        AttendanceResponse response =
                mock(AttendanceResponse.class);

        when(attendanceRepository
                .findByEmployeeEmployeeIdOrderByAttendanceDateDesc(
                        6
                ))
                .thenReturn(List.of(attendance));

        when(attendanceMapper.toResponse(attendance))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                attendanceService.getEmployeeAttendance(6)
        );
    }

    @Test
    void shouldRejectInvalidDateRange() {
        assertThrows(
                IllegalArgumentException.class,
                () -> attendanceService.getAttendanceByDateRange(
                        LocalDate.of(2026, 12, 31),
                        LocalDate.of(2026, 12, 1)
                )
        );
    }

    private AttendanceCreateRequest validRequest() {
        return new AttendanceCreateRequest(
                6,
                1,
                LocalDate.of(2026, 12, 10),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                "PRESENT"
        );
    }
}