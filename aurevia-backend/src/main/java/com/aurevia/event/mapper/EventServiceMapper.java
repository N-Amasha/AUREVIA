package com.aurevia.event.mapper;

import com.aurevia.event.dto.EventServiceResponse;
import com.aurevia.event.entity.EventService;
import org.springframework.stereotype.Component;

@Component
public class EventServiceMapper {

    public EventServiceResponse toResponse(
            EventService eventService
    ) {
        return new EventServiceResponse(
                eventService.getEventServiceId(),
                eventService.getEvent().getEventId(),
                eventService.getEvent().getEventName(),
                eventService.getVendor().getVendorId(),
                eventService.getVendor().getVendorName(),
                eventService.getVendor().getVendorType(),
                eventService.getServiceName(),
                eventService.getServiceDate(),
                eventService.getStartTime(),
                eventService.getEndTime(),
                eventService.getCost(),
                eventService.getServiceStatus()
        );
    }
}