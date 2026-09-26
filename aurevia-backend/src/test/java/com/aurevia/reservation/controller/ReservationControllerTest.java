package com.aurevia.reservation.controller;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.ReservationCreateRequest;
import com.aurevia.reservation.dto.ReservationResponse;
import com.aurevia.reservation.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ReservationController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservationService reservationService;

    @Test
    void shouldCreateReservation() throws Exception {
        ReservationResponse response = createResponse(10);

        when(reservationService.createReservation(
                any(ReservationCreateRequest.class)
        )).thenReturn(response);

        mockMvc.perform(
                        post("/api/reservations")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": 1,
                                          "tableId": 2,
                                          "reservationDate": "2026-10-15",
                                          "startTime": "18:00:00",
                                          "endTime": "20:00:00",
                                          "numberOfGuests": 4
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                ))
                .andExpect(jsonPath("$.reservationId").value(10))
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.customerName")
                        .value("Amaya Perera"))
                .andExpect(jsonPath("$.tableId").value(2))
                .andExpect(jsonPath("$.tableNumber").value("T02"))
                .andExpect(jsonPath("$.numberOfGuests").value(4))
                .andExpect(jsonPath("$.reservationStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldRejectInvalidReservationRequest() throws Exception {
        mockMvc.perform(
                        post("/api/reservations")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": null,
                                          "tableId": 0,
                                          "reservationDate": null,
                                          "startTime": null,
                                          "endTime": null,
                                          "numberOfGuests": 0
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.customerId"
                ).value("Customer ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.tableId"
                ).value("Table ID must be greater than zero."))
                .andExpect(jsonPath(
                        "$.validationErrors.reservationDate"
                ).value("Reservation date is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.startTime"
                ).value("Start time is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.endTime"
                ).value("End time is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.numberOfGuests"
                ).value(
                        "Number of guests must be greater than zero."
                ));
    }

    @Test
    void shouldReturnConflictForBusinessRuleViolation()
            throws Exception {

        when(reservationService.createReservation(
                any(ReservationCreateRequest.class)
        )).thenThrow(new BusinessRuleException(
                "The selected table is already reserved "
                        + "for the requested time period."
        ));

        mockMvc.perform(
                        post("/api/reservations")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": 1,
                                          "tableId": 2,
                                          "reservationDate": "2026-10-15",
                                          "startTime": "18:00:00",
                                          "endTime": "20:00:00",
                                          "numberOfGuests": 4
                                        }
                                        """)
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value(
                        "The selected table is already reserved "
                                + "for the requested time period."
                ));
    }

    @Test
    void shouldGetReservationById() throws Exception {
        when(reservationService.getReservationById(1))
                .thenReturn(createResponse(1));

        mockMvc.perform(get("/api/reservations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservationId").value(1))
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.tableNumber").value("T02"));
    }

    @Test
    void shouldReturnNotFoundForMissingReservation()
            throws Exception {

        when(reservationService.getReservationById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Reservation",
                        "reservationId",
                        99
                ));

        mockMvc.perform(get("/api/reservations/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(
                        "Reservation not found with reservationId: 99"
                ));
    }

    @Test
    void shouldGetCustomerReservationHistory()
            throws Exception {

        when(reservationService.getCustomerReservationHistory(1))
                .thenReturn(List.of(
                        createResponse(2),
                        createResponse(1)
                ));

        mockMvc.perform(
                        get("/api/reservations/customers/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].reservationId").value(2))
                .andExpect(jsonPath("$[1].reservationId").value(1));
    }

    private ReservationResponse createResponse(
            Integer reservationId
    ) {
        return new ReservationResponse(
                reservationId,
                1,
                "Amaya Perera",
                2,
                "T02",
                "Main Dining Area",
                LocalDate.of(2026, 10, 15),
                LocalTime.of(18, 0),
                LocalTime.of(20, 0),
                4,
                "PENDING",
                LocalDateTime.of(
                        2026,
                        9,
                        26,
                        10,
                        0
                )
        );
    }
}