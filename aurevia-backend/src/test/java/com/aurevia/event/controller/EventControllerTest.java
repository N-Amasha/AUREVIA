package com.aurevia.event.controller;

import com.aurevia.event.dto.EventResponse;
import com.aurevia.event.service.EventService;
import com.aurevia.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EventController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Test
    void shouldCreateEvent() throws Exception {
        when(eventService.createEvent(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/events")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "eventBookingId": 6,
                                          "coordinatorId": 6,
                                          "eventName": "Test Corporate Event",
                                          "eventType": "CORPORATE",
                                          "eventDate": "2026-12-20",
                                          "startTime": "09:00:00",
                                          "endTime": "17:00:00",
                                          "budget": 100000.00,
                                          "numberOfGuests": 100
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventId")
                        .value(6))
                .andExpect(jsonPath("$.eventStatus")
                        .value("PLANNED"));
    }

    @Test
    void shouldRejectInvalidEventRequest()
            throws Exception {

        mockMvc.perform(
                        post("/api/events")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "eventName": "",
                                          "eventType": "",
                                          "budget": -1,
                                          "numberOfGuests": 0
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"));
    }

    @Test
    void shouldCreateEventFromBookingForAuthenticatedCoordinator()
            throws Exception {

        when(eventService.createEventForCoordinator(
                any(),
                eq("coordinator1@aurevia.test")
        )).thenReturn(response());

        mockMvc.perform(
                        post("/api/events/from-booking")
                                .principal(
                                        () -> "coordinator1@aurevia.test"
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "eventBookingId": 6,
                                          "eventName": "Test Corporate Event",
                                          "eventType": "CORPORATE",
                                          "startTime": "09:00:00",
                                          "endTime": "17:00:00",
                                          "budget": 100000.00
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventId")
                        .value(6))
                .andExpect(jsonPath("$.eventBookingId")
                        .value(6))
                .andExpect(jsonPath("$.coordinatorId")
                        .value(6))
                .andExpect(jsonPath("$.eventName")
                        .value("Test Corporate Event"))
                .andExpect(jsonPath("$.eventStatus")
                        .value("PLANNED"));
    }

    @Test
    void shouldRejectInvalidCoordinatorEventRequest()
            throws Exception {

        mockMvc.perform(
                        post("/api/events/from-booking")
                                .principal(
                                        () -> "coordinator1@aurevia.test"
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "eventBookingId": null,
                                          "eventName": "",
                                          "eventType": "",
                                          "startTime": null,
                                          "endTime": null,
                                          "budget": -1
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.eventBookingId"
                ).value("Event booking ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.eventName"
                ).value("Event name is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.eventType"
                ).value("Event type is required."));
    }

    @Test
    void shouldReturnEventById() throws Exception {
        when(eventService.getEventById(6))
                .thenReturn(response());

        mockMvc.perform(get("/api/events/6"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventId")
                        .value(6))
                .andExpect(jsonPath("$.eventName")
                        .value("Test Corporate Event"));
    }

    @Test
    void shouldReturnEventsByCoordinator()
            throws Exception {

        when(eventService.getEventsByCoordinator(6))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/events/coordinators/6")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].coordinatorId")
                        .value(6));
    }

    @Test
    void shouldReturnEventsByStatus()
            throws Exception {

        when(eventService.getEventsByStatus("PLANNED"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/events/statuses/PLANNED")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventStatus")
                        .value("PLANNED"));
    }

    @Test
    void shouldReturnEventsBetweenDates()
            throws Exception {

        LocalDate start =
                LocalDate.of(2026, 12, 1);

        LocalDate end =
                LocalDate.of(2026, 12, 31);

        when(eventService.getEventsBetweenDates(
                start,
                end
        )).thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/events/date-range")
                                .param(
                                        "startDate",
                                        "2026-12-01"
                                )
                                .param(
                                        "endDate",
                                        "2026-12-31"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId")
                        .value(6));
    }

    private EventResponse response() {
        return new EventResponse(
                6,
                6,
                6,
                "Event Coordinator",
                "Test Corporate Event",
                "CORPORATE",
                LocalDate.of(2026, 12, 20),
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                new BigDecimal("100000.00"),
                100,
                "PLANNED"
        );
    }
}