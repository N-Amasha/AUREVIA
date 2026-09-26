package com.aurevia.reservation.mapper;

import com.aurevia.reservation.dto.ReservationResponse;
import com.aurevia.reservation.entity.Reservation;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(Reservation reservation) {
        UserAccount userAccount =
                reservation.getCustomer().getUserAccount();

        String customerName = (
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName()
        ).trim();

        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getCustomer().getUserId(),
                customerName,
                reservation.getRestaurantTable().getTableId(),
                reservation.getRestaurantTable().getTableNumber(),
                reservation.getRestaurantTable().getLocation(),
                reservation.getReservationDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getNumberOfGuests(),
                reservation.getReservationStatus(),
                reservation.getCreatedAt()
        );
    }
}