package com.aurevia.inventory.dto;

public record SupplierResponse(
        Integer supplierId,
        String supplierName,
        String email,
        String contactNumber,
        String street,
        String city,
        String province,
        String postalCode
) {
}