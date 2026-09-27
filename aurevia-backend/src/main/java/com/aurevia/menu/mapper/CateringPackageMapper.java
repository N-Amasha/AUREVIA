package com.aurevia.menu.mapper;

import com.aurevia.menu.dto.CateringPackageResponse;
import com.aurevia.menu.dto.PackageItemResponse;
import com.aurevia.menu.entity.CateringPackage;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.entity.PackageItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CateringPackageMapper {

    public CateringPackageResponse toResponse(
            CateringPackage cateringPackage,
            List<PackageItem> packageItems
    ) {
        List<PackageItemResponse> items = packageItems.stream()
                .map(this::toItemResponse)
                .toList();

        return new CateringPackageResponse(
                cateringPackage.getPackageId(),
                cateringPackage.getPackageName(),
                cateringPackage.getDescription(),
                cateringPackage.getPackageType(),
                cateringPackage.getBasePrice(),
                cateringPackage.getMinimumGuests(),
                cateringPackage.getMaximumGuests(),
                items
        );
    }

    public PackageItemResponse toItemResponse(
            PackageItem packageItem
    ) {
        MenuItem menuItem = packageItem.getMenuItem();

        return new PackageItemResponse(
                menuItem.getMenuItemId(),
                menuItem.getItemName(),
                menuItem.getCategory(),
                packageItem.getQuantity(),
                menuItem.getPrice(),
                menuItem.getAvailabilityStatus()
        );
    }
}