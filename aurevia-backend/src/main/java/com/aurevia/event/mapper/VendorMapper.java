package com.aurevia.event.mapper;

import com.aurevia.event.dto.VendorResponse;
import com.aurevia.event.entity.Vendor;
import org.springframework.stereotype.Component;

@Component
public class VendorMapper {

    public VendorResponse toResponse(Vendor vendor) {
        return new VendorResponse(
                vendor.getVendorId(),
                vendor.getVendorName(),
                vendor.getVendorType(),
                vendor.getEmail(),
                vendor.getContactNumber(),
                vendor.getStreet(),
                vendor.getCity(),
                vendor.getProvince(),
                vendor.getPostalCode()
        );
    }
}