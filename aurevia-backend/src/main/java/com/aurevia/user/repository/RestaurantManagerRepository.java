package com.aurevia.user.repository;

import com.aurevia.user.entity.RestaurantManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantManagerRepository
        extends JpaRepository<RestaurantManager, Integer> {

    Optional<RestaurantManager> findByEmployeeUserAccountEmailIgnoreCase(
            String email
    );

    List<RestaurantManager> findByManagementAreaIgnoreCase(
            String managementArea
    );
}