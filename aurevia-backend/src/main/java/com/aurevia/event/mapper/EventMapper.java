package com.aurevia.event.mapper;

import com.aurevia.event.dto.EventResponse;
import com.aurevia.event.entity.Event;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event) {
        UserAccount coordinatorAccount =
                event.getCoordinator()
                        .getEmployee()
                        .getUserAccount();

        String coordinatorName =
                coordinatorAccount.getFirstName()
                        + " "
                        + coordinatorAccount.getLastName();

        return new EventResponse(
                event.getEventId(),
                event.getEventBooking().getEventBookingId(),
                event.getCoordinator().getEmployeeId(),
                coordinatorName,
                event.getEventName(),
                event.getEventType(),
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime(),
                event.getBudget(),
                event.getNumberOfGuests(),
                event.getEventStatus()
        );
    }
}