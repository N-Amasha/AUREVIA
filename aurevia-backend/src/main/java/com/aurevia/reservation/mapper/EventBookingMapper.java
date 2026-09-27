package com.aurevia.reservation.mapper;

import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class EventBookingMapper {

    public EventBookingResponse toResponse(
            EventBooking eventBooking
    ) {
        UserAccount userAccount =
                eventBooking.getCustomer().getUserAccount();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        return new EventBookingResponse(
                eventBooking.getEventBookingId(),
                eventBooking.getCustomer().getUserId(),
                customerName,
                eventBooking.getVenue().getVenueId(),
                eventBooking.getVenue().getVenueName(),
                eventBooking.getVenue().getLocation(),
                eventBooking.getBookingDate(),
                eventBooking.getGuestCount(),
                eventBooking.getTotalAmount(),
                eventBooking.getBookingStatus(),
                eventBooking.getCreatedAt()
        );
    }
}