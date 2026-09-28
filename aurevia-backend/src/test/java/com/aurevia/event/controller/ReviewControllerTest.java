package com.aurevia.event.controller;

import com.aurevia.event.dto.ReviewResponse;
import com.aurevia.event.service.ReviewService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    @Test
    void shouldCreateReview() throws Exception {
        when(reviewService.createReview(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/reviews")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "customerId": 1,
                                          "eventId": 1,
                                          "rating": 5,
                                          "comment": "Excellent event coordination."
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reviewId").value(1))
                .andExpect(jsonPath("$.sentiment")
                        .value("POSITIVE"));
    }

    @Test
    void shouldRejectInvalidReviewRequest()
            throws Exception {

        mockMvc.perform(
                        post("/api/reviews")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "rating": 6
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"));
    }

    @Test
    void shouldReturnReviewById() throws Exception {
        when(reviewService.getReviewById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/reviews/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId").value(1))
                .andExpect(jsonPath("$.rating").value(5));
    }

    @Test
    void shouldReturnReviewsByCustomer() throws Exception {
        when(reviewService.getReviewsByCustomer(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/reviews/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerId")
                        .value(1));
    }

    @Test
    void shouldReturnReviewsByEvent() throws Exception {
        when(reviewService.getReviewsByEvent(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/reviews/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventId").value(1));
    }

    @Test
    void shouldReturnReviewsBySentiment() throws Exception {
        when(reviewService.getReviewsBySentiment("POSITIVE"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/reviews/sentiments/POSITIVE")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sentiment")
                        .value("POSITIVE"));
    }

    private ReviewResponse response() {
        return new ReviewResponse(
                1,
                1,
                "Amaya Perera",
                1,
                "Perera Wedding Reception",
                null,
                LocalDateTime.of(2026, 11, 11, 10, 0),
                5,
                "Excellent event coordination.",
                "POSITIVE"
        );
    }
}