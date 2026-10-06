package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.RestaurantTableRequest;
import com.aurevia.reservation.dto.RestaurantTableResponse;
import com.aurevia.reservation.entity.RestaurantTable;
import com.aurevia.reservation.repository.ReservationRepository;
import com.aurevia.reservation.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class RestaurantTableService {

    private static final Set<String> ALLOWED_STATUSES =
            Set.of("AVAILABLE", "MAINTENANCE");

    private final RestaurantTableRepository
            restaurantTableRepository;

    private final ReservationRepository
            reservationRepository;

    public RestaurantTableService(
            RestaurantTableRepository restaurantTableRepository,
            ReservationRepository reservationRepository
    ) {
        this.restaurantTableRepository =
                restaurantTableRepository;
        this.reservationRepository =
                reservationRepository;
    }

    public List<RestaurantTableResponse> getAllTables() {
        return restaurantTableRepository
                .findAll()
                .stream()
                .sorted(
                        (first, second) ->
                                first.getTableNumber()
                                        .compareToIgnoreCase(
                                                second.getTableNumber()
                                        )
                )
                .map(this::toResponse)
                .toList();
    }

    public RestaurantTableResponse getTableById(
            Integer tableId
    ) {
        return toResponse(findTable(tableId));
    }

    @Transactional
    public RestaurantTableResponse createTable(
            RestaurantTableRequest request
    ) {
        String tableNumber =
                normalizeTableNumber(
                        request.tableNumber()
                );

        validateUniqueTableNumber(
                tableNumber,
                null
        );

        RestaurantTable restaurantTable =
                new RestaurantTable(
                        tableNumber,
                        request.capacity(),
                        request.location().trim(),
                        normalizeStatus(
                                request.tableStatus()
                        )
                );

        return toResponse(
                restaurantTableRepository.save(
                        restaurantTable
                )
        );
    }

    @Transactional
    public RestaurantTableResponse updateTable(
            Integer tableId,
            RestaurantTableRequest request
    ) {
        RestaurantTable restaurantTable =
                findTable(tableId);

        String tableNumber =
                normalizeTableNumber(
                        request.tableNumber()
                );

        validateUniqueTableNumber(
                tableNumber,
                tableId
        );

        restaurantTable.setTableNumber(tableNumber);
        restaurantTable.setCapacity(
                request.capacity()
        );
        restaurantTable.setLocation(
                request.location().trim()
        );
        restaurantTable.setTableStatus(
                normalizeStatus(
                        request.tableStatus()
                )
        );

        return toResponse(
                restaurantTableRepository.save(
                        restaurantTable
                )
        );
    }

    @Transactional
    public void deleteTable(Integer tableId) {
        RestaurantTable restaurantTable =
                findTable(tableId);

        if (reservationRepository
                .existsByRestaurantTableTableId(
                        tableId
                )) {
            throw new BusinessRuleException(
                    "A restaurant table with reservation history "
                            + "cannot be deleted."
            );
        }

        restaurantTableRepository.delete(
                restaurantTable
        );
    }

    public List<RestaurantTableResponse>
    getAvailableTables(
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

        if (numberOfGuests == null
                || numberOfGuests <= 0) {
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

    private RestaurantTable findTable(
            Integer tableId
    ) {
        return restaurantTableRepository
                .findById(tableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Restaurant table",
                                "tableId",
                                tableId
                        )
                );
    }

    private void validateUniqueTableNumber(
            String tableNumber,
            Integer currentTableId
    ) {
        restaurantTableRepository
                .findByTableNumberIgnoreCase(
                        tableNumber
                )
                .filter(existingTable ->
                        currentTableId == null
                                || !existingTable
                                .getTableId()
                                .equals(currentTableId)
                )
                .ifPresent(existingTable -> {
                    throw new BusinessRuleException(
                            "A restaurant table with this "
                                    + "table number already exists."
                    );
                });
    }

    private String normalizeTableNumber(
            String tableNumber
    ) {
        return tableNumber
                .trim()
                .toUpperCase(Locale.ROOT);
    }

    private String normalizeStatus(String status) {
        String normalizedStatus = status
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!ALLOWED_STATUSES.contains(
                normalizedStatus
        )) {
            throw new BusinessRuleException(
                    "Table status must be AVAILABLE "
                            + "or MAINTENANCE."
            );
        }

        return normalizedStatus;
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