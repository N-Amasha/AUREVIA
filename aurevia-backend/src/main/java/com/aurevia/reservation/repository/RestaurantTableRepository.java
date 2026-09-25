package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantTableRepository
        extends JpaRepository<RestaurantTable, Integer> {

    Optional<RestaurantTable> findByTableNumberIgnoreCase(
            String tableNumber
    );

    List<RestaurantTable> findByTableStatusIgnoreCase(
            String tableStatus
    );

    List<RestaurantTable>
    findByTableStatusIgnoreCaseAndCapacityGreaterThanEqual(
            String tableStatus,
            Integer capacity
    );
}