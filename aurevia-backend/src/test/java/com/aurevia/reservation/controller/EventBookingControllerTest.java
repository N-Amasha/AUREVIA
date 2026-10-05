package com.aurevia.reservation.controller;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.dto.EventBookingUpdateRequest;
import com.aurevia.reservation.service.EventBookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EventBookingController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class EventBookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EventBookingService eventBookingService;

    @Test
    void shouldCreateEventBooking() throws Exception {
        EventBookingCreateRequest request =
                createValidRequest();

        EventBookingResponse response =
                createResponse("PENDING");

        when(eventBookingService
                .createEventBooking(request))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/event-bookings")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(content()
                        .contentTypeCompatibleWith(
                                MediaType.APPLICATION_JSON
                        ))
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.customerId")
                        .value(1))
                .andExpect(jsonPath("$.customerName")
                        .value("Amaya Perera"))
                .andExpect(jsonPath("$.venueId")
                        .value(1))
                .andExpect(jsonPath("$.venueName")
                        .value("Grand Ballroom"))
                .andExpect(jsonPath("$.bookingDate")
                        .value("2026-12-20"))
                .andExpect(jsonPath("$.guestCount")
                        .value(200))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("PENDING"));

        verify(eventBookingService)
                .createEventBooking(request);
    }

    @Test
    void shouldUpdatePendingEventBooking()
            throws Exception {

        EventBookingUpdateRequest request =
                createUpdateRequest();

        EventBookingResponse response =
                createUpdatedResponse();

        when(eventBookingService
                .updateEventBooking(
                        eq(6),
                        eq(request)
                ))
                .thenReturn(response);

        mockMvc.perform(
                        put("/api/event-bookings/6")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.bookingDate")
                        .value("2026-12-21"))
                .andExpect(jsonPath("$.guestCount")
                        .value(150))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("PENDING"));

        verify(eventBookingService)
                .updateEventBooking(6, request);
    }

    @Test
    void shouldCancelPendingEventBooking()
            throws Exception {

        when(eventBookingService
                .cancelEventBooking(6))
                .thenReturn(
                        createResponse("CANCELLED")
                );

        mockMvc.perform(
                        delete("/api/event-bookings/6")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("CANCELLED"));

        verify(eventBookingService)
                .cancelEventBooking(6);
    }

    @Test
    void shouldRejectInvalidUpdateRequest()
            throws Exception {

        mockMvc.perform(
                        put("/api/event-bookings/6")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "venueId": null,
                                          "bookingDate": null,
                                          "guestCount": 0
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.venueId"
                ).value("Venue ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.bookingDate"
                ).value("Booking date is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.guestCount"
                ).value("Guest count must be positive."));
    }

    @Test
    void shouldReturnConflictWhenConfirmedBookingIsUpdated()
            throws Exception {

        EventBookingUpdateRequest request =
                createUpdateRequest();

        when(eventBookingService
                .updateEventBooking(6, request))
                .thenThrow(
                        new BusinessRuleException(
                                "Only pending event bookings "
                                        + "can be updated."
                        )
                );

        mockMvc.perform(
                        put("/api/event-bookings/6")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error")
                        .value("Conflict"));
    }

    @Test
    void shouldReturnConflictWhenConfirmedBookingIsCancelled()
            throws Exception {

        when(eventBookingService
                .cancelEventBooking(6))
                .thenThrow(
                        new BusinessRuleException(
                                "Only pending event bookings "
                                        + "can be cancelled."
                        )
                );

        mockMvc.perform(
                        delete("/api/event-bookings/6")
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error")
                        .value("Conflict"));
    }

    @Test
    void shouldReturnEventBookingById()
            throws Exception {

        when(eventBookingService
                .getEventBookingById(1))
                .thenReturn(
                        createResponse("PENDING")
                );

        mockMvc.perform(
                        get("/api/event-bookings/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.venueName")
                        .value("Grand Ballroom"))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("PENDING"));
    }

    @Test
    void shouldReturnCustomerEventBookings()
            throws Exception {

        when(eventBookingService
                .getCustomerEventBookings(1))
                .thenReturn(List.of(
                        createResponse("PENDING")
                ));

        mockMvc.perform(
                        get(
                                "/api/event-bookings/customers/1"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(1))
                .andExpect(jsonPath("$[0].customerId")
                        .value(1))
                .andExpect(jsonPath("$[0].customerName")
                        .value("Amaya Perera"));
    }

    @Test
    void shouldReturnEventBookingsByStatus()
            throws Exception {

        when(eventBookingService
                .getEventBookingsByStatus(
                        "CONFIRMED"
                ))
                .thenReturn(List.of(
                        createResponse("CONFIRMED")
                ));

        mockMvc.perform(
                        get(
                                "/api/event-bookings/statuses/CONFIRMED"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(1))
                .andExpect(jsonPath(
                        "$[0].bookingStatus"
                ).value("CONFIRMED"));
    }

    @Test
    void shouldReturnValidationErrorsForEmptyRequest()
            throws Exception {

        mockMvc.perform(
                        post("/api/event-bookings")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("{}")
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status")
                        .value(400))
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.customerId"
                ).value("Customer ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.venueId"
                ).value("Venue ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.bookingDate"
                ).value("Booking date is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.guestCount"
                ).value("Guest count is required."));
    }

    @Test
    void shouldRejectPastBookingDate()
            throws Exception {

        EventBookingCreateRequest request =
                new EventBookingCreateRequest(
                        1,
                        1,
                        LocalDate.of(2020, 1, 1),
                        100
                );

        mockMvc.perform(
                        post("/api/event-bookings")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.bookingDate"
                ).value(
                        "Booking date cannot be in the past."
                ));
    }

    @Test
    void shouldReturnNotFoundWhenBookingDoesNotExist()
            throws Exception {

        when(eventBookingService
                .getEventBookingById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Event booking",
                                "eventBookingId",
                                99
                        )
                );

        mockMvc.perform(
                        get("/api/event-bookings/99")
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status")
                        .value(404))
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Event booking not found "
                                        + "with eventBookingId: 99"
                        ));
    }

    private EventBookingCreateRequest createValidRequest() {
        return new EventBookingCreateRequest(
                1,
                1,
                LocalDate.of(2026, 12, 20),
                200
        );
    }

    private EventBookingUpdateRequest createUpdateRequest() {
        return new EventBookingUpdateRequest(
                1,
                LocalDate.of(2026, 12, 21),
                150
        );
    }

    private EventBookingResponse createResponse(
            String bookingStatus
    ) {
        return new EventBookingResponse(
                6,
                1,
                "Amaya Perera",
                1,
                "Grand Ballroom",
                "Ground Floor",
                LocalDate.of(2026, 12, 20),
                200,
                new BigDecimal("350000.00"),
                bookingStatus,
                LocalDateTime.of(
                        2026,
                        9,
                        27,
                        16,
                        0
                )
        );
    }

    private EventBookingResponse createUpdatedResponse() {
        return new EventBookingResponse(
                6,
                1,
                "Amaya Perera",
                1,
                "Grand Ballroom",
                "Ground Floor",
                LocalDate.of(2026, 12, 21),
                150,
                new BigDecimal("250000.00"),
                "PENDING",
                LocalDateTime.of(
                        2026,
                        9,
                        27,
                        16,
                        0
                )
        );
    }
}