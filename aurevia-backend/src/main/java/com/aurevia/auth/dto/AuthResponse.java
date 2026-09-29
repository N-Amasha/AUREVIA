package com.aurevia.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Long expiresIn,
        Integer userId,
        String email,
        String firstName,
        String lastName,
        String role
) {
}