package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.reservation.dto.RestaurantTableResponse;
import com.aurevia.reservation.entity.RestaurantTable;
import com.aurevia.reservation.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RestaurantTableService {

    private final RestaurantTableRepository restaurantTableRepository;

    public RestaurantTableService(
            RestaurantTableRepository restaurantTableRepository
    ) {
        this.restaurantTableRepository = restaurantTableRepository;
    }

    public List<RestaurantTableResponse> getAvailableTables(
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime,
            Integer numberOfGuests
    ) {
        if (reservationDate == null) {
            throw new IllegalArgumentException(
                    "Reservation date is required."
            );
        }

        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Start time and end time are required."
            );
        }

        if (!endTime.isAfter(startTime)) {
            throw new BusinessRuleException(
                    "Reservation end time must be later than start time."
            );
        }

        if (numberOfGuests == null || numberOfGuests <= 0) {
            throw new IllegalArgumentException(
                    "Number of guests must be greater than zero."
            );
        }

        return restaurantTableRepository
                .findAvailableTables(
                        reservationDate,
                        startTime,
                        endTime,
                        numberOfGuests
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private RestaurantTableResponse toResponse(
            RestaurantTable restaurantTable
    ) {
        return new RestaurantTableResponse(
                restaurantTable.getTableId(),
                restaurantTable.getTableNumber(),
                restaurantTable.getCapacity(),
                restaurantTable.getLocation(),
                restaurantTable.getTableStatus()
        );
    }
}
