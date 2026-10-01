package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.reservation.dto.RestaurantTableResponse;
import com.aurevia.reservation.entity.RestaurantTable;
import com.aurevia.reservation.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RestaurantTableServiceTest {

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    private RestaurantTableService restaurantTableService;

    @BeforeEach
    void setUp() {
        restaurantTableService =
                new RestaurantTableService(
                        restaurantTableRepository
                );
    }

    @Test
    void shouldReturnAvailableTables() {
        LocalDate reservationDate =
                LocalDate.of(2026, 12, 20);

        LocalTime startTime =
                LocalTime.of(18, 0);

        LocalTime endTime =
                LocalTime.of(20, 0);

        RestaurantTable restaurantTable =
                mock(RestaurantTable.class);

        when(restaurantTable.getTableId())
                .thenReturn(2);
        when(restaurantTable.getTableNumber())
                .thenReturn("T02");
        when(restaurantTable.getCapacity())
                .thenReturn(4);
        when(restaurantTable.getLocation())
                .thenReturn("Main Dining Area");
        when(restaurantTable.getTableStatus())
                .thenReturn("AVAILABLE");

        when(restaurantTableRepository.findAvailableTables(
                reservationDate,
                startTime,
                endTime,
                4
        )).thenReturn(List.of(restaurantTable));

        List<RestaurantTableResponse> responses =
                restaurantTableService.getAvailableTables(
                        reservationDate,
                        startTime,
                        endTime,
                        4
                );

        assertEquals(1, responses.size());

        RestaurantTableResponse response =
                responses.getFirst();

        assertEquals(2, response.tableId());
        assertEquals("T02", response.tableNumber());
        assertEquals(4, response.capacity());
        assertEquals(
                "Main Dining Area",
                response.location()
        );
        assertEquals(
                "AVAILABLE",
                response.tableStatus()
        );

        verify(restaurantTableRepository)
                .findAvailableTables(
                        reservationDate,
                        startTime,
                        endTime,
                        4
                );
    }

    @Test
    void shouldReturnEmptyListWhenNoTablesAreAvailable() {
        LocalDate reservationDate =
                LocalDate.of(2026, 12, 20);

        LocalTime startTime =
                LocalTime.of(18, 0);

        LocalTime endTime =
                LocalTime.of(20, 0);

        when(restaurantTableRepository.findAvailableTables(
                reservationDate,
                startTime,
                endTime,
                10
        )).thenReturn(List.of());

        List<RestaurantTableResponse> responses =
                restaurantTableService.getAvailableTables(
                        reservationDate,
                        startTime,
                        endTime,
                        10
                );

        assertEquals(0, responses.size());
    }

    @Test
    void shouldRejectNullReservationDate() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        null,
                                        LocalTime.of(18, 0),
                                        LocalTime.of(20, 0),
                                        4
                                )
                );

        assertEquals(
                "Reservation date is required.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectNullStartTime() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        null,
                                        LocalTime.of(20, 0),
                                        4
                                )
                );

        assertEquals(
                "Start time and end time are required.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectNullEndTime() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        LocalTime.of(18, 0),
                                        null,
                                        4
                                )
                );

        assertEquals(
                "Start time and end time are required.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectEndTimeBeforeStartTime() {
        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        LocalTime.of(20, 0),
                                        LocalTime.of(18, 0),
                                        4
                                )
                );

        assertEquals(
                "Reservation end time must be later than start time.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectEqualStartAndEndTimes() {
        BusinessRuleException exception =
                assertThrows(
                        BusinessRuleException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        LocalTime.of(18, 0),
                                        LocalTime.of(18, 0),
                                        4
                                )
                );

        assertEquals(
                "Reservation end time must be later than start time.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectZeroGuestCount() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        LocalTime.of(18, 0),
                                        LocalTime.of(20, 0),
                                        0
                                )
                );

        assertEquals(
                "Number of guests must be greater than zero.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectNullGuestCount() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> restaurantTableService
                                .getAvailableTables(
                                        LocalDate.of(
                                                2026,
                                                12,
                                                20
                                        ),
                                        LocalTime.of(18, 0),
                                        LocalTime.of(20, 0),
                                        null
                                )
                );

        assertEquals(
                "Number of guests must be greater than zero.",
                exception.getMessage()
        );
    }
}
