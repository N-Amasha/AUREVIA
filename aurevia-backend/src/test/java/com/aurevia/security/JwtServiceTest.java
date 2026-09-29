package com.aurevia.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private static final String TEST_SECRET =
            "QXVyZXZpYS1EZXZlbG9wbWVudC1KV1QtU2VjcmV0LUtleS0yMDI2";

    private static final long EXPIRATION_MILLISECONDS =
            3_600_000L;

    @Mock
    private AureviaUserPrincipal principal;

    @Mock
    private UserDetails userDetails;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                TEST_SECRET,
                EXPIRATION_MILLISECONDS
        );
    }

    @Test
    void shouldGenerateTokenAndExtractUsername() {
        preparePrincipal();

        String token = jwtService.generateToken(principal);

        assertEquals(
                "amaya.customer@aurevia.test",
                jwtService.extractUsername(token)
        );
    }

    @Test
    void shouldValidateTokenForCorrectUser() {
        preparePrincipal();

        when(userDetails.getUsername())
                .thenReturn("amaya.customer@aurevia.test");

        String token = jwtService.generateToken(principal);

        assertTrue(
                jwtService.isTokenValid(token, userDetails)
        );
    }

    @Test
    void shouldRejectTokenForDifferentUser() {
        preparePrincipal();

        when(userDetails.getUsername())
                .thenReturn("another.user@aurevia.test");

        String token = jwtService.generateToken(principal);

        assertFalse(
                jwtService.isTokenValid(token, userDetails)
        );
    }

    @Test
    void shouldRejectMalformedToken() {
        assertFalse(
                jwtService.isTokenValid(
                        "invalid-jwt-token",
                        userDetails
                )
        );
    }

    @Test
    void shouldReturnConfiguredExpiration() {
        assertEquals(
                EXPIRATION_MILLISECONDS,
                jwtService.getExpirationMilliseconds()
        );
    }

    private void preparePrincipal() {
        when(principal.getUsername())
                .thenReturn("amaya.customer@aurevia.test");
        when(principal.getUserId()).thenReturn(1);
        when(principal.getRole()).thenReturn("CUSTOMER");
        when(principal.getFirstName()).thenReturn("Amaya");
        when(principal.getLastName()).thenReturn("Perera");
    }
}