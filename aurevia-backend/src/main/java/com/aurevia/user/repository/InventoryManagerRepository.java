package com.aurevia.user.repository;

import com.aurevia.user.entity.InventoryManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryManagerRepository
        extends JpaRepository<InventoryManager, Integer> {

    Optional<InventoryManager>
    findByEmployeeUserAccountEmailIgnoreCase(String email);

    List<InventoryManager> findByWarehouseAreaContainingIgnoreCase(
            String warehouseArea
    );
}