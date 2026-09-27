package com.aurevia.menu.controller;

import com.aurevia.menu.dto.CateringPackageResponse;
import com.aurevia.menu.service.CateringPackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catering-packages")
public class CateringPackageController {

    private final CateringPackageService
            cateringPackageService;

    public CateringPackageController(
            CateringPackageService cateringPackageService
    ) {
        this.cateringPackageService =
                cateringPackageService;
    }

    @GetMapping("/{packageId}")
    public ResponseEntity<CateringPackageResponse>
    getPackageById(
            @PathVariable Integer packageId
    ) {
        return ResponseEntity.ok(
                cateringPackageService
                        .getPackageById(packageId)
        );
    }

    @GetMapping("/types/{packageType}")
    public ResponseEntity<List<CateringPackageResponse>>
    getPackagesByType(
            @PathVariable String packageType
    ) {
        return ResponseEntity.ok(
                cateringPackageService
                        .getPackagesByType(packageType)
        );
    }

    @GetMapping("/supported")
    public ResponseEntity<List<CateringPackageResponse>>
    getPackagesSupportingGuestCount(
            @RequestParam Integer guestCount
    ) {
        return ResponseEntity.ok(
                cateringPackageService
                        .getPackagesSupportingGuestCount(
                                guestCount
                        )
        );
    }
}