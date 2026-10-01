package com.aurevia.reservation.dto;

public record RestaurantTableResponse(
        Integer tableId,
        String tableNumber,
        Integer capacity,
        String location,
        String tableStatus
) {
}
