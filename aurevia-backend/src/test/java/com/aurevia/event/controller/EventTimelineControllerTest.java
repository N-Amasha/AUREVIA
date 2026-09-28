package com.aurevia.event.controller;

import com.aurevia.event.dto.EventTimelineResponse;
import com.aurevia.event.service.EventTimelineService;
import com.aurevia.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EventTimelineController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class EventTimelineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventTimelineService timelineService;

    @Test
    void shouldCreateTimelineMilestone() throws Exception {
        when(timelineService.createTimelineMilestone(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/event-timelines")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "eventId": 1,
                                          "milestoneName": "Venue Decoration",
                                          "description": "Complete ballroom decoration",
                                          "scheduledDate": "2026-11-10T09:00:00"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.timelineId").value(1))
                .andExpect(jsonPath("$.status")
                        .value("PENDING"));
    }

    @Test
    void shouldRejectInvalidTimelineRequest() throws Exception {
        mockMvc.perform(
                        post("/api/event-timelines")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "milestoneName": ""
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"));
    }

    @Test
    void shouldReturnTimelineById() throws Exception {
        when(timelineService.getTimelineById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/event-timelines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timelineId").value(1));
    }

    @Test
    void shouldReturnTimelineByEvent() throws Exception {
        when(timelineService.getTimelineByEvent(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/event-timelines/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(1));
    }

    @Test
    void shouldReturnTimelineByEventAndStatus()
            throws Exception {

        when(timelineService.getTimelineByEventAndStatus(
                1,
                "PENDING"
        )).thenReturn(List.of(response()));

        mockMvc.perform(
                        get(
                                "/api/event-timelines/events/1/statuses/PENDING"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status")
                        .value("PENDING"));
    }

    @Test
    void shouldUpdateTimelineStatus() throws Exception {
        EventTimelineResponse completed =
                new EventTimelineResponse(
                        1,
                        1,
                        "Perera Wedding Reception",
                        "Venue Decoration",
                        "Complete ballroom decoration",
                        LocalDateTime.of(
                                2026, 11, 10, 9, 0
                        ),
                        "COMPLETED",
                        LocalDateTime.of(
                                2026, 11, 10, 16, 0
                        )
                );

        when(timelineService.updateTimelineStatus(
                org.mockito.ArgumentMatchers.eq(1),
                any()
        )).thenReturn(completed);

        mockMvc.perform(
                        patch(
                                "/api/event-timelines/1/status"
                        )
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "status": "COMPLETED"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status")
                        .value("COMPLETED"));
    }

    private EventTimelineResponse response() {
        return new EventTimelineResponse(
                1,
                1,
                "Perera Wedding Reception",
                "Venue Decoration",
                "Complete ballroom decoration",
                LocalDateTime.of(2026, 11, 10, 9, 0),
                "PENDING",
                LocalDateTime.of(2026, 9, 28, 8, 0)
        );
    }
}