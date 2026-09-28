package com.aurevia.inventory.controller;

import com.aurevia.inventory.dto.SupplierResponse;
import com.aurevia.inventory.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(
            SupplierService supplierService
    ) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<SupplierResponse> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{supplierId}")
    public SupplierResponse getSupplierById(
            @PathVariable Integer supplierId
    ) {
        return supplierService.getSupplierById(supplierId);
    }

    @GetMapping("/search")
    public List<SupplierResponse> searchSuppliers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String province
    ) {
        if (city != null && !city.isBlank()) {
            return supplierService.getSuppliersByCity(city);
        }

        if (province != null && !province.isBlank()) {
            return supplierService
                    .getSuppliersByProvince(province);
        }

        throw new IllegalArgumentException(
                "Either city or province is required."
        );
    }
}