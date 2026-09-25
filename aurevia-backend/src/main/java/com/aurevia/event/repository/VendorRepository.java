package com.aurevia.event.repository;

import com.aurevia.event.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository
        extends JpaRepository<Vendor, Integer> {

    Optional<Vendor> findByEmailIgnoreCase(String email);

    Optional<Vendor> findByVendorNameIgnoreCase(String vendorName);

    List<Vendor> findByVendorTypeIgnoreCase(String vendorType);

    List<Vendor> findByCityIgnoreCase(String city);
}