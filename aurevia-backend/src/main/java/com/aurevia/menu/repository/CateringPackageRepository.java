package com.aurevia.menu.repository;

import com.aurevia.menu.entity.CateringPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CateringPackageRepository
        extends JpaRepository<CateringPackage, Integer> {

    Optional<CateringPackage> findByPackageNameIgnoreCase(
            String packageName
    );

    List<CateringPackage> findByPackageTypeIgnoreCase(
            String packageType
    );

    @Query("""
            SELECT cp
            FROM CateringPackage cp
            WHERE cp.minimumGuests <= :guestCount
              AND cp.maximumGuests >= :guestCount
            ORDER BY cp.basePrice ASC
            """)
    List<CateringPackage> findPackagesSupportingGuestCount(
            @Param("guestCount") Integer guestCount
    );
}