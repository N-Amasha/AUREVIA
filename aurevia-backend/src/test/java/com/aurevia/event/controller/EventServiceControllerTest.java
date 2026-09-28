package com.aurevia.event.controller;

import com.aurevia.event.dto.EventServiceResponse;
import com.aurevia.event.service.EventVendorService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EventServiceController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class EventServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventVendorService eventVendorService;

    @Test
    void shouldCreateEventService() throws Exception {
        when(eventVendorService.createEventService(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/event-services")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "eventId": 1,
                                          "vendorId": 1,
                                          "serviceName": "Floral Decoration",
                                          "serviceDate": "2026-11-10",
                                          "startTime": "09:00:00",
                                          "endTime": "16:00:00",
                                          "cost": 75000.00
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventServiceId")
                        .value(1))
                .andExpect(jsonPath("$.serviceStatus")
                        .value("PLANNED"));
    }

    @Test
    void shouldRejectInvalidRequest() throws Exception {
        mockMvc.perform(
                        post("/api/event-services")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "serviceName": "",
                                          "cost": -1
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"));
    }

    @Test
    void shouldReturnEventServiceById() throws Exception {
        when(eventVendorService.getEventServiceById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/event-services/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vendorName")
                        .value("Elegant Floral Designs"));
    }

    @Test
    void shouldReturnServicesByEvent() throws Exception {
        when(eventVendorService.getServicesByEvent(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/event-services/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(1));
    }

    @Test
    void shouldReturnServicesByVendor() throws Exception {
        when(eventVendorService.getServicesByVendor(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/event-services/vendors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vendorId").value(1));
    }

    @Test
    void shouldReturnTotalServiceCost() throws Exception {
        when(eventVendorService.getTotalServiceCost(1))
                .thenReturn(new BigDecimal("160000.00"));

        mockMvc.perform(
                        get("/api/event-services/events/1/total-cost")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(160000.00));
    }

    private EventServiceResponse response() {
        return new EventServiceResponse(
                1,
                1,
                "Perera Wedding Reception",
                1,
                "Elegant Floral Designs",
                "FLORAL",
                "Floral Decoration",
                LocalDate.of(2026, 11, 10),
                LocalTime.of(9, 0),
                LocalTime.of(16, 0),
                new BigDecimal("75000.00"),
                "PLANNED"
        );
    }
}