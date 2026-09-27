package com.aurevia.menu.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CateringPackageResponse;
import com.aurevia.menu.entity.CateringPackage;
import com.aurevia.menu.entity.PackageItem;
import com.aurevia.menu.mapper.CateringPackageMapper;
import com.aurevia.menu.repository.CateringPackageRepository;
import com.aurevia.menu.repository.PackageItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CateringPackageService {

    private final CateringPackageRepository
            cateringPackageRepository;

    private final PackageItemRepository packageItemRepository;
    private final CateringPackageMapper cateringPackageMapper;

    public CateringPackageService(
            CateringPackageRepository cateringPackageRepository,
            PackageItemRepository packageItemRepository,
            CateringPackageMapper cateringPackageMapper
    ) {
        this.cateringPackageRepository =
                cateringPackageRepository;
        this.packageItemRepository = packageItemRepository;
        this.cateringPackageMapper = cateringPackageMapper;
    }

    public CateringPackageResponse getPackageById(
            Integer packageId
    ) {
        CateringPackage cateringPackage =
                findPackage(packageId);

        return mapPackage(cateringPackage);
    }

    public List<CateringPackageResponse> getPackagesByType(
            String packageType
    ) {
        if (packageType == null || packageType.isBlank()) {
            throw new IllegalArgumentException(
                    "Package type is required."
            );
        }

        return cateringPackageRepository
                .findByPackageTypeIgnoreCase(
                        packageType.trim()
                )
                .stream()
                .map(this::mapPackage)
                .toList();
    }

    public List<CateringPackageResponse>
    getPackagesSupportingGuestCount(Integer guestCount) {

        if (guestCount == null || guestCount <= 0) {
            throw new IllegalArgumentException(
                    "Guest count must be positive."
            );
        }

        return cateringPackageRepository
                .findPackagesSupportingGuestCount(guestCount)
                .stream()
                .map(this::mapPackage)
                .toList();
    }

    private CateringPackage findPackage(Integer packageId) {
        return cateringPackageRepository.findById(packageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Catering package",
                                "packageId",
                                packageId
                        )
                );
    }

    private CateringPackageResponse mapPackage(
            CateringPackage cateringPackage
    ) {
        List<PackageItem> packageItems =
                packageItemRepository
                        .findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                                cateringPackage.getPackageId()
                        );

        return cateringPackageMapper.toResponse(
                cateringPackage,
                packageItems
        );
    }
}