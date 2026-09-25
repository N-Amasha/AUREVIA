package com.aurevia.menu.repository;

import com.aurevia.menu.entity.PackageItem;
import com.aurevia.menu.entity.PackageItemId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageItemRepository
        extends JpaRepository<PackageItem, PackageItemId> {

    List<PackageItem>
    findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
            Integer packageId
    );

    List<PackageItem>
    findByMenuItemMenuItemId(Integer menuItemId);
}