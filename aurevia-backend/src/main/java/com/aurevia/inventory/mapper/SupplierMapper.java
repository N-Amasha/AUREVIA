package com.aurevia.inventory.mapper;

import com.aurevia.inventory.dto.SupplierResponse;
import com.aurevia.inventory.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public SupplierResponse toResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getSupplierId(),
                supplier.getSupplierName(),
                supplier.getEmail(),
                supplier.getContactNumber(),
                supplier.getStreet(),
                supplier.getCity(),
                supplier.getProvince(),
                supplier.getPostalCode()
        );
    }
}