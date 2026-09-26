package com.aurevia.common;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> validationErrors
) {

    public static ApiErrorResponse of(
            int status,
            String error,
            String message,
            String path
    ) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status,
                error,
                message,
                path,
                Map.of()
        );
    }

    public static ApiErrorResponse withValidationErrors(
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status,
                error,
                message,
                path,
                Map.copyOf(validationErrors)
        );
    }
}