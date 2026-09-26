package com.aurevia.inventory.repository;

import com.aurevia.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository
        extends JpaRepository<Supplier, Integer> {

    Optional<Supplier> findByEmailIgnoreCase(String email);

    Optional<Supplier> findBySupplierNameIgnoreCase(
            String supplierName
    );

    List<Supplier> findByCityIgnoreCaseOrderBySupplierNameAsc(
            String city
    );

    List<Supplier> findByProvinceIgnoreCaseOrderBySupplierNameAsc(
            String province
    );
}