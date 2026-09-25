package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.EventBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventBookingRepository
        extends JpaRepository<EventBooking, Integer> {

    List<EventBooking>
    findByCustomerUserIdOrderByBookingDateDesc(Integer customerId);

    List<EventBooking> findByBookingStatusIgnoreCase(
            String bookingStatus
    );

    @Query("""
            SELECT eb
            FROM EventBooking eb
            WHERE eb.venue.venueId = :venueId
              AND eb.bookingDate = :bookingDate
              AND UPPER(eb.bookingStatus) <> 'CANCELLED'
            """)
    List<EventBooking> findVenueBookingConflicts(
            @Param("venueId") Integer venueId,
            @Param("bookingDate") LocalDate bookingDate
    );
}