package com.aurevia.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ExceptionTestController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
public class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnNotFoundResponse() throws Exception {
        mockMvc.perform(get("/test-errors/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                ))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value(
                        "Reservation not found with reservationId: 100"
                ))
                .andExpect(jsonPath("$.path").value(
                        "/test-errors/not-found"
                ))
                .andExpect(jsonPath("$.validationErrors").isEmpty());
    }

    @Test
    void shouldReturnBusinessRuleConflictResponse() throws Exception {
        mockMvc.perform(get("/test-errors/business-rule"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value(
                        "The selected table is already reserved."
                ));
    }

    @Test
    void shouldReturnBadRequestForIllegalArgument() throws Exception {
        mockMvc.perform(get("/test-errors/illegal-argument"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value(
                        "The supplied value is invalid."
                ));
    }

    @Test
    void shouldReturnValidationErrors() throws Exception {
        mockMvc.perform(
                        post("/test-errors/validation")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "name": ""
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath("$.message")
                        .value("Request validation failed."))
                .andExpect(jsonPath("$.validationErrors.name")
                        .value("Name is required."));
    }

    @Test
    void shouldReturnInternalServerErrorWithoutExposingDetails()
            throws Exception {

        mockMvc.perform(get("/test-errors/unexpected"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error")
                        .value("Internal Server Error"))
                .andExpect(jsonPath("$.message")
                        .value("An unexpected server error occurred."))
                .andExpect(content().string(
                        org.hamcrest.Matchers.not(
                                org.hamcrest.Matchers.containsString(
                                        "Sensitive internal implementation detail."
                                )
                        )
                ));
    }
}