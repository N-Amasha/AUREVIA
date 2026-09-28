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
class ShiftServiceTest {

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ShiftMapper shiftMapper;

    private ShiftService shiftService;

    @BeforeEach
    void setUp() {
        shiftService = new ShiftService(
                shiftRepository,
                employeeRepository,
                shiftMapper
        );
    }

    @Test
    void shouldCreateShift() {
        ShiftCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        ShiftResponse response = mock(ShiftResponse.class);

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findOverlappingShifts(
                6,
                request.shiftDate(),
                request.startTime(),
                request.endTime()
        )).thenReturn(List.of());

        when(shiftRepository.save(any(Shift.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(shiftMapper.toResponse(any(Shift.class)))
                .thenReturn(response);

        ShiftResponse result =
                shiftService.createShift(request);

        assertEquals(response, result);
        verify(shiftRepository).save(any(Shift.class));
    }

    @Test
    void shouldRejectInvalidTimeRange() {
        ShiftCreateRequest request =
                new ShiftCreateRequest(
                        6,
                        LocalDate.now().plusDays(1),
                        LocalTime.of(18, 0),
                        LocalTime.of(9, 0)
                );

        assertThrows(
                BusinessRuleException.class,
                () -> shiftService.createShift(request)
        );

        verify(employeeRepository, never()).findById(any());
        verify(shiftRepository, never()).save(any());
    }

    @Test
    void shouldRejectMissingEmployee() {
        ShiftCreateRequest request = validRequest();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> shiftService.createShift(request)
        );

        verify(shiftRepository, never()).save(any());
    }

    @Test
    void shouldRejectOverlappingShift() {
        ShiftCreateRequest request = validRequest();
        Employee employee = mock(Employee.class);
        Shift existingShift = new Shift();

        when(employeeRepository.findById(6))
                .thenReturn(Optional.of(employee));

        when(shiftRepository.findOverlappingShifts(
                6,
                request.shiftDate(),
                request.startTime(),
                request.endTime()
        )).thenReturn(List.of(existingShift));

        assertThrows(
                BusinessRuleException.class,
                () -> shiftService.createShift(request)
        );

        verify(shiftRepository, never()).save(any());
    }

    @Test
    void shouldGetShiftById() {
        Shift shift = new Shift();
        ShiftResponse response = mock(ShiftResponse.class);

        when(shiftRepository.findById(1))
                .thenReturn(Optional.of(shift));

        when(shiftMapper.toResponse(shift))
                .thenReturn(response);

        assertEquals(
                response,
                shiftService.getShiftById(1)
        );
    }

    @Test
    void shouldRejectMissingShift() {
        when(shiftRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> shiftService.getShiftById(99)
        );
    }

    @Test
    void shouldGetEmployeeShifts() {
        Shift firstShift = new Shift();
        Shift secondShift = new Shift();

        ShiftResponse firstResponse =
                mock(ShiftResponse.class);

        ShiftResponse secondResponse =
                mock(ShiftResponse.class);

        when(shiftRepository
                .findByEmployeeEmployeeIdOrderByShiftDateAscStartTimeAsc(
                        6
                ))
                .thenReturn(List.of(firstShift, secondShift));

        when(shiftMapper.toResponse(firstShift))
                .thenReturn(firstResponse);

        when(shiftMapper.toResponse(secondShift))
                .thenReturn(secondResponse);

        List<ShiftResponse> result =
                shiftService.getEmployeeShifts(6);

        assertEquals(
                List.of(firstResponse, secondResponse),
                result
        );
    }

    @Test
    void shouldRejectInvalidDateRange() {
        LocalDate startDate = LocalDate.of(2026, 12, 10);
        LocalDate endDate = LocalDate.of(2026, 12, 1);

        assertThrows(
                IllegalArgumentException.class,
                () -> shiftService.getShiftsByDateRange(
                        startDate,
                        endDate
                )
        );
    }

    @Test
    void shouldUpdateShiftStatus() {
        Shift shift = new Shift();
        ShiftResponse response = mock(ShiftResponse.class);

        when(shiftRepository.findById(1))
                .thenReturn(Optional.of(shift));

        when(shiftRepository.save(shift))
                .thenReturn(shift);

        when(shiftMapper.toResponse(shift))
                .thenReturn(response);

        ShiftResponse result =
                shiftService.updateShiftStatus(
                        1,
                        "completed"
                );

        assertEquals("COMPLETED", shift.getShiftStatus());
        assertEquals(response, result);
    }

    private ShiftCreateRequest validRequest() {
        return new ShiftCreateRequest(
                6,
                LocalDate.now().plusDays(1),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0)
        );
    }
}