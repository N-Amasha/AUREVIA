package com.aurevia.user.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CustomerProfileResponse(
        Integer customerId,
        String firstName,
        String lastName,
        String email,
        LocalDateTime registrationDate,
        String street,
        String city,
        String province,
        String postalCode,
        List<String> phoneNumbers
) {
}