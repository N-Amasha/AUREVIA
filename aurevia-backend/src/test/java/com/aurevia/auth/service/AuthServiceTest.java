package com.aurevia.auth.service;

import com.aurevia.auth.dto.AuthResponse;
import com.aurevia.auth.dto.LoginRequest;
import com.aurevia.security.AureviaUserPrincipal;
import com.aurevia.security.JwtService;
import com.aurevia.user.entity.UserAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private Authentication authentication;

    @Mock
    private UserAccount userAccount;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                authenticationManager,
                jwtService
        );
    }

    @Test
    void shouldLoginAndReturnJwtResponse() {
        LoginRequest request = new LoginRequest(
                "  amaya.customer@aurevia.test  ",
                "Aurevia@2026"
        );

        when(userAccount.getUserId()).thenReturn(1);
        when(userAccount.getEmail())
                .thenReturn("amaya.customer@aurevia.test");
        when(userAccount.getPasswordHash())
                .thenReturn("$2a$12$test");
        when(userAccount.getFirstName()).thenReturn("Amaya");
        when(userAccount.getLastName()).thenReturn("Perera");

        AureviaUserPrincipal principal =
                new AureviaUserPrincipal(
                        userAccount,
                        "CUSTOMER"
                );

        when(authenticationManager.authenticate(any(
                UsernamePasswordAuthenticationToken.class
        ))).thenReturn(authentication);

        when(authentication.getPrincipal()).thenReturn(principal);

        when(jwtService.generateToken(principal))
                .thenReturn("test-jwt-token");

        when(jwtService.getExpirationMilliseconds())
                .thenReturn(3_600_000L);

        AuthResponse response = authService.login(request);

        assertEquals("test-jwt-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(3_600_000L, response.expiresIn());
        assertEquals(1, response.userId());
        assertEquals(
                "amaya.customer@aurevia.test",
                response.email()
        );
        assertEquals("Amaya", response.firstName());
        assertEquals("Perera", response.lastName());
        assertEquals("CUSTOMER", response.role());

        verify(authenticationManager).authenticate(any(
                UsernamePasswordAuthenticationToken.class
        ));
        verify(jwtService).generateToken(principal);
    }

    @Test
    void shouldRejectInvalidCredentials() {
        LoginRequest request = new LoginRequest(
                "amaya.customer@aurevia.test",
                "WrongPassword"
        );

        when(authenticationManager.authenticate(any(
                UsernamePasswordAuthenticationToken.class
        ))).thenThrow(
                new BadCredentialsException(
                        "Invalid credentials"
                )
        );

        assertThrows(
                BadCredentialsException.class,
                () -> authService.login(request)
        );
    }
}