package com.aurevia.event.dto;

public record VendorResponse(
        Integer vendorId,
        String vendorName,
        String vendorType,
        String email,
        String contactNumber,
        String street,
        String city,
        String province,
        String postalCode
) {
}