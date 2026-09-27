package com.aurevia.menu.dto;

import java.math.BigDecimal;
import java.util.List;

public record CateringPackageResponse(
        Integer packageId,
        String packageName,
        String description,
        String packageType,
        BigDecimal basePrice,
        Integer minimumGuests,
        Integer maximumGuests,
        List<PackageItemResponse> items
) {
}