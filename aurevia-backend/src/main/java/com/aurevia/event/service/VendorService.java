package com.aurevia.event.service;

import com.aurevia.event.dto.VendorResponse;
import com.aurevia.event.entity.Vendor;
import com.aurevia.event.mapper.VendorMapper;
import com.aurevia.event.repository.VendorRepository;
import com.aurevia.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VendorService {

    private final VendorRepository vendorRepository;
    private final VendorMapper vendorMapper;

    public VendorService(
            VendorRepository vendorRepository,
            VendorMapper vendorMapper
    ) {
        this.vendorRepository = vendorRepository;
        this.vendorMapper = vendorMapper;
    }

    public VendorResponse getVendorById(Integer vendorId) {
        return vendorMapper.toResponse(findVendor(vendorId));
    }

    public List<VendorResponse> getAllVendors() {
        return vendorRepository.findAll()
                .stream()
                .map(vendorMapper::toResponse)
                .toList();
    }

    public List<VendorResponse> getVendorsByType(
            String vendorType
    ) {
        if (vendorType == null || vendorType.isBlank()) {
            throw new IllegalArgumentException(
                    "Vendor type is required."
            );
        }

        return vendorRepository
                .findByVendorTypeIgnoreCase(vendorType.trim())
                .stream()
                .map(vendorMapper::toResponse)
                .toList();
    }

    public List<VendorResponse> getVendorsByCity(String city) {
        if (city == null || city.isBlank()) {
            throw new IllegalArgumentException(
                    "City is required."
            );
        }

        return vendorRepository
                .findByCityIgnoreCase(city.trim())
                .stream()
                .map(vendorMapper::toResponse)
                .toList();
    }

    private Vendor findVendor(Integer vendorId) {
        return vendorRepository.findById(vendorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor",
                                "vendorId",
                                vendorId
                        )
                );
    }
}