package com.aurevia.reservation.controller;

import com.aurevia.reservation.dto.RestaurantTableRequest;
import com.aurevia.reservation.dto.RestaurantTableResponse;
import com.aurevia.reservation.service.RestaurantTableService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/restaurant-tables")
@Validated
public class RestaurantTableController {

    private final RestaurantTableService
            restaurantTableService;

    public RestaurantTableController(
            RestaurantTableService restaurantTableService
    ) {
        this.restaurantTableService =
                restaurantTableService;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTableResponse>>
    getAllTables() {
        return ResponseEntity.ok(
                restaurantTableService.getAllTables()
        );
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<RestaurantTableResponse>
    getTableById(
            @PathVariable
            @Positive(
                    message =
                            "Table ID must be greater than zero."
            )
            Integer tableId
    ) {
        return ResponseEntity.ok(
                restaurantTableService
                        .getTableById(tableId)
        );
    }

    @PostMapping
    public ResponseEntity<RestaurantTableResponse>
    createTable(
            @Valid
            @RequestBody
            RestaurantTableRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        restaurantTableService
                                .createTable(request)
                );
    }

    @PutMapping("/{tableId}")
    public ResponseEntity<RestaurantTableResponse>
    updateTable(
            @PathVariable
            @Positive(
                    message =
                            "Table ID must be greater than zero."
            )
            Integer tableId,

            @Valid
            @RequestBody
            RestaurantTableRequest request
    ) {
        return ResponseEntity.ok(
                restaurantTableService
                        .updateTable(
                                tableId,
                                request
                        )
        );
    }

    @DeleteMapping("/{tableId}")
    public ResponseEntity<Void> deleteTable(
            @PathVariable
            @Positive(
                    message =
                            "Table ID must be greater than zero."
            )
            Integer tableId
    ) {
        restaurantTableService.deleteTable(tableId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<RestaurantTableResponse>>
    getAvailableTables(
            @RequestParam
            @NotNull(
                    message =
                            "Reservation date is required."
            )
            @FutureOrPresent(
                    message =
                            "Reservation date cannot be in the past."
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate reservationDate,

            @RequestParam
            @NotNull(
                    message =
                            "Start time is required."
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.TIME
            )
            LocalTime startTime,

            @RequestParam
            @NotNull(
                    message =
                            "End time is required."
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.TIME
            )
            LocalTime endTime,

            @RequestParam
            @NotNull(
                    message =
                            "Number of guests is required."
            )
            @Positive(
                    message =
                            "Number of guests must be greater than zero."
            )
            Integer numberOfGuests
    ) {
        return ResponseEntity.ok(
                restaurantTableService
                        .getAvailableTables(
                                reservationDate,
                                startTime,
                                endTime,
                                numberOfGuests
                        )
        );
    }
}