package com.aurevia.inventory.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.SupplierResponse;
import com.aurevia.inventory.entity.Supplier;
import com.aurevia.inventory.mapper.SupplierMapper;
import com.aurevia.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public SupplierService(
            SupplierRepository supplierRepository,
            SupplierMapper supplierMapper
    ) {
        this.supplierRepository = supplierRepository;
        this.supplierMapper = supplierMapper;
    }

    public SupplierResponse getSupplierById(
            Integer supplierId
    ) {
        Supplier supplier = supplierRepository
                .findById(supplierId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier",
                                "supplierId",
                                supplierId
                        )
                );

        return supplierMapper.toResponse(supplier);
    }

    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    public List<SupplierResponse> getSuppliersByCity(
            String city
    ) {
        validateText(city, "Supplier city is required.");

        return supplierRepository
                .findByCityIgnoreCaseOrderBySupplierNameAsc(
                        city.trim()
                )
                .stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    public List<SupplierResponse> getSuppliersByProvince(
            String province
    ) {
        validateText(
                province,
                "Supplier province is required."
        );

        return supplierRepository
                .findByProvinceIgnoreCaseOrderBySupplierNameAsc(
                        province.trim()
                )
                .stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    private void validateText(
            String value,
            String message
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }
}