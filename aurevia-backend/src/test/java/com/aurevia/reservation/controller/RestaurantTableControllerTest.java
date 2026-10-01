package com.aurevia.reservation.controller;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.reservation.dto.RestaurantTableResponse;
import com.aurevia.reservation.service.RestaurantTableService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = RestaurantTableController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class RestaurantTableControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RestaurantTableService restaurantTableService;

    @Test
    void shouldGetAvailableTables() throws Exception {
        LocalDate reservationDate =
                LocalDate.now().plusDays(10);

        LocalTime startTime = LocalTime.of(18, 0);
        LocalTime endTime = LocalTime.of(20, 0);

        RestaurantTableResponse response =
                new RestaurantTableResponse(
                        2,
                        "T02",
                        4,
                        "Main Dining Area",
                        "AVAILABLE"
                );

        when(restaurantTableService.getAvailableTables(
                reservationDate,
                startTime,
                endTime,
                4
        )).thenReturn(List.of(response));

        mockMvc.perform(
                        get("/api/restaurant-tables/available")
                                .param(
                                        "reservationDate",
                                        reservationDate.toString()
                                )
                                .param("startTime", "18:00")
                                .param("endTime", "20:00")
                                .param("numberOfGuests", "4")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tableId")
                        .value(2))
                .andExpect(jsonPath("$[0].tableNumber")
                        .value("T02"))
                .andExpect(jsonPath("$[0].capacity")
                        .value(4))
                .andExpect(jsonPath("$[0].location")
                        .value("Main Dining Area"))
                .andExpect(jsonPath("$[0].tableStatus")
                        .value("AVAILABLE"));

        verify(restaurantTableService)
                .getAvailableTables(
                        reservationDate,
                        startTime,
                        endTime,
                        4
                );
    }

    @Test
    void shouldReturnEmptyListWhenNoTablesAreAvailable()
            throws Exception {

        LocalDate reservationDate =
                LocalDate.now().plusDays(10);

        when(restaurantTableService.getAvailableTables(
                reservationDate,
                LocalTime.of(18, 0),
                LocalTime.of(20, 0),
                10
        )).thenReturn(List.of());

        mockMvc.perform(
                        get("/api/restaurant-tables/available")
                                .param(
                                        "reservationDate",
                                        reservationDate.toString()
                                )
                                .param("startTime", "18:00")
                                .param("endTime", "20:00")
                                .param("numberOfGuests", "10")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void shouldRejectMissingRequestParameters()
            throws Exception {

        mockMvc.perform(
                        get("/api/restaurant-tables/available")
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnConflictForInvalidTimeRange()
            throws Exception {

        LocalDate reservationDate =
                LocalDate.now().plusDays(10);

        LocalTime startTime = LocalTime.of(20, 0);
        LocalTime endTime = LocalTime.of(18, 0);

        when(restaurantTableService.getAvailableTables(
                reservationDate,
                startTime,
                endTime,
                4
        )).thenThrow(
                new BusinessRuleException(
                        "Reservation end time must be later than start time."
                )
        );

        mockMvc.perform(
                        get("/api/restaurant-tables/available")
                                .param(
                                        "reservationDate",
                                        reservationDate.toString()
                                )
                                .param("startTime", "20:00")
                                .param("endTime", "18:00")
                                .param("numberOfGuests", "4")
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status")
                        .value(409))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Reservation end time must be later than start time."
                        ))
                .andExpect(jsonPath("$.path")
                        .value(
                                "/api/restaurant-tables/available"
                        ));
    }
}