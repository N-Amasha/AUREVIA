package com.aurevia.auth.controller;

import com.aurevia.auth.dto.AuthResponse;
import com.aurevia.auth.dto.LoginRequest;
import com.aurevia.auth.service.AuthService;
import com.aurevia.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import com.aurevia.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

   @MockitoBean
   private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest(
                "amaya.customer@aurevia.test",
                "Aurevia@2026"
        );

        AuthResponse response = new AuthResponse(
                "test-jwt-token",
                "Bearer",
                3_600_000L,
                1,
                "amaya.customer@aurevia.test",
                "Amaya",
                "Perera",
                "CUSTOMER"
        );

        when(authService.login(any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        request
                                )
                        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken")
                        .value("test-jwt-token"))
                .andExpect(jsonPath("$.tokenType")
                        .value("Bearer"))
                .andExpect(jsonPath("$.expiresIn")
                        .value(3_600_000))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email")
                        .value(
                                "amaya.customer@aurevia.test"
                        ))
                .andExpect(jsonPath("$.firstName")
                        .value("Amaya"))
                .andExpect(jsonPath("$.lastName")
                        .value("Perera"))
                .andExpect(jsonPath("$.role")
                        .value("CUSTOMER"));
    }

    @Test
    void shouldRejectBlankLoginFields() throws Exception {
        LoginRequest request = new LoginRequest(
                "",
                ""
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        request
                                )
                        ))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.email"
                ).exists())
                .andExpect(jsonPath(
                        "$.validationErrors.password"
                ).value("Password is required."));
    }

    @Test
    void shouldRejectInvalidEmailFormat() throws Exception {
        LoginRequest request = new LoginRequest(
                "invalid-email",
                "Aurevia@2026"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        request
                                )
                        ))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.email"
                ).value("Enter a valid email address."));
    }

    @Test
    void shouldReturnUnauthorizedForInvalidCredentials()
            throws Exception {

        LoginRequest request = new LoginRequest(
                "amaya.customer@aurevia.test",
                "WrongPassword"
        );

        when(authService.login(any()))
                .thenThrow(
                        new BadCredentialsException(
                                "Invalid credentials"
                        )
                );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        request
                                )
                        ))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error")
                        .value("Unauthorized"))
                .andExpect(jsonPath("$.message")
                        .value("Invalid email or password."))
                .andExpect(jsonPath("$.path")
                        .value("/api/auth/login"));
    }
}