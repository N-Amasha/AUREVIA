package com.aurevia.reservation.controller;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
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

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
                createResponse();

        when(
                eventBookingService
                        .createEventBooking(request)
        ).thenReturn(response);

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
                .andExpect(content().contentTypeCompatibleWith(
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
                .andExpect(jsonPath("$.venueLocation")
                        .value("Ground Floor"))
                .andExpect(jsonPath("$.bookingDate")
                        .value("2026-12-20"))
                .andExpect(jsonPath("$.guestCount")
                        .value(200))
                .andExpect(jsonPath("$.totalAmount")
                        .value(350000.00))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("PENDING"))
                .andExpect(jsonPath("$.createdAt")
                        .value("2026-09-27T16:00:00"));

        verify(eventBookingService)
                .createEventBooking(request);
    }

    @Test
    void shouldReturnEventBookingById() throws Exception {
        when(
                eventBookingService
                        .getEventBookingById(1)
        ).thenReturn(createResponse());

        mockMvc.perform(get("/api/event-bookings/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.venueName")
                        .value("Grand Ballroom"))
                .andExpect(jsonPath("$.bookingStatus")
                        .value("PENDING"));

        verify(eventBookingService)
                .getEventBookingById(1);
    }

    @Test
    void shouldReturnCustomerEventBookings()
            throws Exception {

        when(
                eventBookingService
                        .getCustomerEventBookings(1)
        ).thenReturn(List.of(createResponse()));

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

        verify(eventBookingService)
                .getCustomerEventBookings(1);
    }

    @Test
    void shouldReturnEventBookingsByStatus()
            throws Exception {

        when(
                eventBookingService
                        .getEventBookingsByStatus(
                                "CONFIRMED"
                        )
        ).thenReturn(List.of(createResponse()));

        mockMvc.perform(
                        get(
                                "/api/event-bookings/statuses/CONFIRMED"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(1))
                .andExpect(jsonPath("$[0].eventBookingId")
                        .value(6));

        verify(eventBookingService)
                .getEventBookingsByStatus("CONFIRMED");
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
                .andExpect(
                        jsonPath(
                                "$.validationErrors.customerId"
                        ).value(
                                "Customer ID is required."
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.validationErrors.venueId"
                        ).value(
                                "Venue ID is required."
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.validationErrors.bookingDate"
                        ).value(
                                "Booking date is required."
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.validationErrors.guestCount"
                        ).value(
                                "Guest count is required."
                        )
                );
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
                .andExpect(
                        jsonPath(
                                "$.validationErrors.bookingDate"
                        ).value(
                                "Booking date cannot be in the past."
                        )
                );
    }

    @Test
    void shouldReturnNotFoundWhenBookingDoesNotExist()
            throws Exception {

        when(
                eventBookingService
                        .getEventBookingById(99)
        ).thenThrow(
                new ResourceNotFoundException(
                        "Event booking",
                        "eventBookingId",
                        99
                )
        );

        mockMvc.perform(get("/api/event-bookings/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status")
                        .value(404))
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Event booking not found with eventBookingId: 99"
                        ))
                .andExpect(jsonPath("$.path")
                        .value("/api/event-bookings/99"));
    }

    @Test
    void shouldReturnConflictForVenueBookingConflict()
            throws Exception {

        EventBookingCreateRequest request =
                createValidRequest();

        when(
                eventBookingService
                        .createEventBooking(request)
        ).thenThrow(
                new BusinessRuleException(
                        "The selected venue is already booked for the requested date."
                )
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
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status")
                        .value(409))
                .andExpect(jsonPath("$.error")
                        .value("Conflict"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "The selected venue is already booked for the requested date."
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

    private EventBookingResponse createResponse() {
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