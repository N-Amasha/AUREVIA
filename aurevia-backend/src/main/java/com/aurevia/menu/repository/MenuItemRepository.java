package com.aurevia.menu.repository;

import com.aurevia.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, Integer> {

    Optional<MenuItem> findByItemNameIgnoreCase(String itemName);

    List<MenuItem> findByMenuMenuIdOrderByMenuItemIdAsc(
            Integer menuId
    );

    List<MenuItem>
    findByCategoryIgnoreCaseAndAvailabilityStatusIgnoreCase(
            String category,
            String availabilityStatus
    );

    List<MenuItem>
    findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
            Integer menuId,
            String availabilityStatus
    );
}