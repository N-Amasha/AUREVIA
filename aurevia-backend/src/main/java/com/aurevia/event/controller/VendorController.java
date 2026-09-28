package com.aurevia.event.controller;

import com.aurevia.event.dto.VendorResponse;
import com.aurevia.event.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<VendorResponse> getVendorById(
            @PathVariable Integer vendorId
    ) {
        return ResponseEntity.ok(
                vendorService.getVendorById(vendorId)
        );
    }

    @GetMapping
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        return ResponseEntity.ok(
                vendorService.getAllVendors()
        );
    }

    @GetMapping("/types/{vendorType}")
    public ResponseEntity<List<VendorResponse>> getVendorsByType(
            @PathVariable String vendorType
    ) {
        return ResponseEntity.ok(
                vendorService.getVendorsByType(vendorType)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<VendorResponse>> getVendorsByCity(
            @RequestParam String city
    ) {
        return ResponseEntity.ok(
                vendorService.getVendorsByCity(city)
        );
    }
}