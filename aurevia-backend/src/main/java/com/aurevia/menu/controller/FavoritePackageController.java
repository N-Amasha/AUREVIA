package com.aurevia.menu.controller;

import com.aurevia.menu.dto.FavoritePackageCreateRequest;
import com.aurevia.menu.dto.FavoritePackageResponse;
import com.aurevia.menu.service.FavoritePackageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favorite-packages")
public class FavoritePackageController {

    private final FavoritePackageService
            favoritePackageService;

    public FavoritePackageController(
            FavoritePackageService favoritePackageService
    ) {
        this.favoritePackageService =
                favoritePackageService;
    }

    @PostMapping
    public ResponseEntity<FavoritePackageResponse>
    createFavorite(
            @Valid
            @RequestBody
            FavoritePackageCreateRequest request
    ) {
        FavoritePackageResponse response =
                favoritePackageService
                        .createFavorite(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<List<FavoritePackageResponse>>
    getFavoritesByCustomer(
            @PathVariable Integer customerId
    ) {
        return ResponseEntity.ok(
                favoritePackageService
                        .getFavoritesByCustomer(customerId)
        );
    }

    @DeleteMapping(
            "/customers/{customerId}/packages/{packageId}"
    )
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Integer customerId,
            @PathVariable Integer packageId
    ) {
        favoritePackageService.removeFavorite(
                customerId,
                packageId
        );

        return ResponseEntity.noContent().build();
    }
}