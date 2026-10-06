package com.aurevia.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CustomerProfileUpdateRequest(

        @NotBlank(message = "First name is required.")
        @Size(
                max = 50,
                message = "First name cannot exceed 50 characters."
        )
        String firstName,

        @NotBlank(message = "Last name is required.")
        @Size(
                max = 50,
                message = "Last name cannot exceed 50 characters."
        )
        String lastName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Email must be valid.")
        @Size(
                max = 150,
                message = "Email cannot exceed 150 characters."
        )
        String email,

        @Size(
                max = 150,
                message = "Street cannot exceed 150 characters."
        )
        String street,

        @Size(
                max = 80,
                message = "City cannot exceed 80 characters."
        )
        String city,

        @Size(
                max = 80,
                message = "Province cannot exceed 80 characters."
        )
        String province,

        @Size(
                max = 20,
                message = "Postal code cannot exceed 20 characters."
        )
        String postalCode,

        @Size(
                max = 5,
                message = "A customer can store at most 5 phone numbers."
        )
        List<
                @NotBlank(message = "Phone number cannot be blank.")
                @Size(
                        max = 20,
                        message = "Phone number cannot exceed 20 characters."
                )
                @Pattern(
                        regexp = "^[0-9+() -]+$",
                        message = "Phone number contains invalid characters."
                )
                String
                > phoneNumbers
) {
}