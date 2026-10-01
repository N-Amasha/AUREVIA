package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
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

    @Query("""
            SELECT restaurantTable
            FROM RestaurantTable restaurantTable
            WHERE UPPER(restaurantTable.tableStatus) = 'AVAILABLE'
              AND restaurantTable.capacity >= :numberOfGuests
              AND NOT EXISTS (
                    SELECT reservation.reservationId
                    FROM Reservation reservation
                    WHERE reservation.restaurantTable = restaurantTable
                      AND reservation.reservationDate = :reservationDate
                      AND UPPER(reservation.reservationStatus) <> 'CANCELLED'
                      AND reservation.startTime < :endTime
                      AND reservation.endTime > :startTime
              )
            ORDER BY restaurantTable.capacity ASC,
                     restaurantTable.tableNumber ASC
            """)
    List<RestaurantTable> findAvailableTables(
            @Param("reservationDate")
            LocalDate reservationDate,

            @Param("startTime")
            LocalTime startTime,

            @Param("endTime")
            LocalTime endTime,

            @Param("numberOfGuests")
            Integer numberOfGuests
    );
}
