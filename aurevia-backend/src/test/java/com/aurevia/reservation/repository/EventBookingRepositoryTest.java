package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.EventBooking;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class EventBookingRepositoryTest {

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Test
    void shouldReadAllEventBookings() {
        long count = eventBookingRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadBookingWithCustomerAndVenue() {
        Optional<EventBooking> result =
                eventBookingRepository.findById(1);

        assertThat(result).isPresent();

        EventBooking booking = result.orElseThrow();

        assertThat(booking.getCustomer().getUserId()).isEqualTo(1);
        assertThat(booking.getVenue().getVenueId()).isEqualTo(1);
        assertThat(booking.getBookingDate())
                .isEqualTo(LocalDate.of(2026, 11, 10));
        assertThat(booking.getGuestCount()).isEqualTo(300);
        assertThat(booking.getTotalAmount())
                .isEqualByComparingTo(new BigDecimal("350000.00"));
        assertThat(booking.getBookingStatus())
                .isEqualTo("CONFIRMED");
    }

    @Test
    void shouldFindCustomerBookingHistory() {
        List<EventBooking> bookings =
                eventBookingRepository
                        .findByCustomerUserIdOrderByBookingDateDesc(1);

        assertThat(bookings).hasSize(1);
        assertThat(bookings.getFirst().getEventBookingId())
                .isEqualTo(1);
    }

    @Test
    void shouldFindVenueDateConflict() {
        List<EventBooking> conflicts =
                eventBookingRepository.findVenueBookingConflicts(
                        1,
                        LocalDate.of(2026, 11, 10)
                );

        assertThat(conflicts).hasSize(1);
        assertThat(conflicts.getFirst().getEventBookingId())
                .isEqualTo(1);
    }

    @Test
    void shouldReturnNoConflictForAvailableDate() {
        List<EventBooking> conflicts =
                eventBookingRepository.findVenueBookingConflicts(
                        1,
                        LocalDate.of(2026, 11, 11)
                );

        assertThat(conflicts).isEmpty();
    }
}