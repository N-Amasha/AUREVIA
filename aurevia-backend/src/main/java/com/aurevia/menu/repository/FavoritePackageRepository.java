package com.aurevia.menu.repository;

import com.aurevia.menu.entity.FavoritePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritePackageRepository
        extends JpaRepository<FavoritePackage, Integer> {

    List<FavoritePackage>
    findByCustomerUserIdOrderBySavedDateDesc(Integer customerId);

    Optional<FavoritePackage>
    findByCustomerUserIdAndCateringPackagePackageId(
            Integer customerId,
            Integer packageId
    );

    boolean existsByCustomerUserIdAndCateringPackagePackageId(
            Integer customerId,
            Integer packageId
    );
}