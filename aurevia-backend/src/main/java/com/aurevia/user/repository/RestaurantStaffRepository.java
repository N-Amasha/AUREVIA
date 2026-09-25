package com.aurevia.user.repository;

import com.aurevia.user.entity.RestaurantStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantStaffRepository
        extends JpaRepository<RestaurantStaff, Integer> {

    Optional<RestaurantStaff>
    findByEmployeeUserAccountEmailIgnoreCase(String email);

    List<RestaurantStaff> findByStaffTypeContainingIgnoreCase(
            String staffType
    );
}