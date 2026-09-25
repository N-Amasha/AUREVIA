package com.aurevia.reservation.repository;

import com.aurevia.reservation.entity.Reservation;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class ReservationRepositoryTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void shouldReadAllReservations() {
        long count = reservationRepository.count();

        assertThat(count).isEqualTo(5);
    }

    @Test
    void shouldReadReservationWithCustomerAndTable() {
        Optional<Reservation> result =
                reservationRepository.findById(1);

        assertThat(result).isPresent();

        Reservation reservation = result.orElseThrow();

        assertThat(reservation.getCustomer().getUserId())
                .isEqualTo(1);
        assertThat(reservation.getRestaurantTable().getTableId())
                .isEqualTo(1);
        assertThat(reservation.getReservationDate())
                .isEqualTo(LocalDate.of(2026, 10, 5));
        assertThat(reservation.getStartTime())
                .isEqualTo(LocalTime.of(18, 0));
        assertThat(reservation.getEndTime())
                .isEqualTo(LocalTime.of(20, 0));
        assertThat(reservation.getNumberOfGuests()).isEqualTo(2);
        assertThat(reservation.getReservationStatus())
                .isEqualTo("CONFIRMED");
    }

    @Test
    void shouldFindCustomerReservationHistory() {
        List<Reservation> reservations =
                reservationRepository
                        .findByCustomerUserIdOrderByReservationDateDescStartTimeDesc(
                                1
                        );

        assertThat(reservations).hasSize(1);
        assertThat(reservations.getFirst().getReservationId())
                .isEqualTo(1);
    }

    @Test
    void shouldFindAnOverlappingReservation() {
        List<Reservation> conflicts =
                reservationRepository.findOverlappingReservations(
                        1,
                        LocalDate.of(2026, 10, 5),
                        LocalTime.of(19, 0),
                        LocalTime.of(21, 0)
                );

        assertThat(conflicts).hasSize(1);
        assertThat(conflicts.getFirst().getReservationId())
                .isEqualTo(1);
    }

    @Test
    void shouldNotReportAdjacentTimeAsOverlap() {
        List<Reservation> conflicts =
                reservationRepository.findOverlappingReservations(
                        1,
                        LocalDate.of(2026, 10, 5),
                        LocalTime.of(20, 0),
                        LocalTime.of(22, 0)
                );

        assertThat(conflicts).isEmpty();
    }
}