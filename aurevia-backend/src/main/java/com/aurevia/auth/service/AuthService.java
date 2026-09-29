package com.aurevia.auth.service;

import com.aurevia.auth.dto.AuthResponse;
import com.aurevia.auth.dto.LoginRequest;
import com.aurevia.security.AureviaUserPrincipal;
import com.aurevia.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim();

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                request.password()
                        )
                );

        AureviaUserPrincipal principal =
                (AureviaUserPrincipal) authentication.getPrincipal();

        String accessToken =
                jwtService.generateToken(principal);

        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtService.getExpirationMilliseconds(),
                principal.getUserId(),
                principal.getUsername(),
                principal.getFirstName(),
                principal.getLastName(),
                principal.getRole()
        );
    }
}