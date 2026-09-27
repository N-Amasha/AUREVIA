package com.aurevia.reservation.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.service.VenueService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = VenueController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class VenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VenueService venueService;

    @Test
    void shouldReturnVenueById() throws Exception {
        VenueResponse response = createVenueResponse();

        when(venueService.getVenueById(1))
                .thenReturn(response);

        mockMvc.perform(get("/api/venues/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        "application/json"
                ))
                .andExpect(jsonPath("$.venueId").value(1))
                .andExpect(jsonPath("$.venueName")
                        .value("Grand Ballroom"))
                .andExpect(jsonPath("$.availabilityStatus")
                        .value("AVAILABLE"))
                .andExpect(jsonPath("$.capacity").value(500))
                .andExpect(jsonPath("$.location")
                        .value("Ground Floor"))
                .andExpect(jsonPath("$.venueType")
                        .value("BALLROOM"))
                .andExpect(jsonPath("$.basePrice")
                        .value(250000.00))
                .andExpect(jsonPath("$.features.length()")
                        .value(2))
                .andExpect(jsonPath("$.features[0]")
                        .value("Air Conditioning"))
                .andExpect(jsonPath("$.features[1]")
                        .value("Professional Sound System"));

        verify(venueService).getVenueById(1);
    }

    @Test
    void shouldReturnAvailableVenuesWithoutCapacityFilter()
            throws Exception {

        when(venueService.getAvailableVenues(null))
                .thenReturn(List.of(createVenueResponse()));

        mockMvc.perform(get("/api/venues/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].venueId").value(1))
                .andExpect(jsonPath("$[0].venueName")
                        .value("Grand Ballroom"));

        verify(venueService).getAvailableVenues(null);
    }

    @Test
    void shouldReturnAvailableVenuesWithMinimumCapacity()
            throws Exception {

        when(venueService.getAvailableVenues(200))
                .thenReturn(List.of(createVenueResponse()));

        mockMvc.perform(
                        get("/api/venues/available")
                                .param(
                                        "minimumCapacity",
                                        "200"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].capacity")
                        .value(500));

        verify(venueService).getAvailableVenues(200);
    }

    @Test
    void shouldReturnVenuesByType() throws Exception {
        when(venueService.getVenuesByType("BALLROOM"))
                .thenReturn(List.of(createVenueResponse()));

        mockMvc.perform(get("/api/venues/types/BALLROOM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].venueType")
                        .value("BALLROOM"));

        verify(venueService).getVenuesByType("BALLROOM");
    }

    @Test
    void shouldReturnNotFoundWhenVenueDoesNotExist()
            throws Exception {

        when(venueService.getVenueById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                99
                        )
                );

        mockMvc.perform(get("/api/venues/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error")
                        .value("Not Found"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Venue not found with venueId: 99"
                        ))
                .andExpect(jsonPath("$.path")
                        .value("/api/venues/99"));

        verify(venueService).getVenueById(99);
    }

    @Test
    void shouldReturnBadRequestForInvalidMinimumCapacity()
            throws Exception {

        when(venueService.getAvailableVenues(0))
                .thenThrow(
                        new IllegalArgumentException(
                                "Minimum capacity must be positive."
                        )
                );

        mockMvc.perform(
                        get("/api/venues/available")
                                .param(
                                        "minimumCapacity",
                                        "0"
                                )
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error")
                        .value("Bad Request"))
                .andExpect(jsonPath("$.message")
                        .value(
                                "Minimum capacity must be positive."
                        ));

        verify(venueService).getAvailableVenues(0);
    }

    private VenueResponse createVenueResponse() {
        return new VenueResponse(
                1,
                "Grand Ballroom",
                "AVAILABLE",
                500,
                "Ground Floor",
                "BALLROOM",
                new BigDecimal("250000.00"),
                List.of(
                        "Air Conditioning",
                        "Professional Sound System"
                )
        );
    }
}