package com.aurevia.event.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventServiceResponse(
        Integer eventServiceId,
        Integer eventId,
        String eventName,
        Integer vendorId,
        String vendorName,
        String vendorType,
        String serviceName,
        LocalDate serviceDate,
        LocalTime startTime,
        LocalTime endTime,
        BigDecimal cost,
        String serviceStatus
) {
}