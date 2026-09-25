package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Integer> {

    List<Reservation>
    findByCustomerUserIdOrderByReservationDateDescStartTimeDesc(
            Integer customerId
    );

    List<Reservation> findByReservationStatusIgnoreCase(
            String reservationStatus
    );

    @Query("""
            SELECT r
            FROM Reservation r
            WHERE r.restaurantTable.tableId = :tableId
              AND r.reservationDate = :reservationDate
              AND UPPER(r.reservationStatus) <> 'CANCELLED'
              AND r.startTime < :requestedEndTime
              AND r.endTime > :requestedStartTime
            """)
    List<Reservation> findOverlappingReservations(
            @Param("tableId") Integer tableId,
            @Param("reservationDate") LocalDate reservationDate,
            @Param("requestedStartTime") LocalTime requestedStartTime,
            @Param("requestedEndTime") LocalTime requestedEndTime
    );
}