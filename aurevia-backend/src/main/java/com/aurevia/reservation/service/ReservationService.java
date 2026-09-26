package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.ReservationCreateRequest;
import com.aurevia.reservation.dto.ReservationResponse;
import com.aurevia.reservation.entity.Reservation;
import com.aurevia.reservation.entity.RestaurantTable;
import com.aurevia.reservation.mapper.ReservationMapper;
import com.aurevia.reservation.repository.ReservationRepository;
import com.aurevia.reservation.repository.RestaurantTableRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final CustomerRepository customerRepository;
    private final ReservationMapper reservationMapper;

    public ReservationService(
            ReservationRepository reservationRepository,
            RestaurantTableRepository restaurantTableRepository,
            CustomerRepository customerRepository,
            ReservationMapper reservationMapper
    ) {
        this.reservationRepository = reservationRepository;
        this.restaurantTableRepository = restaurantTableRepository;
        this.customerRepository = customerRepository;
        this.reservationMapper = reservationMapper;
    }

    public ReservationResponse createReservation(
            ReservationCreateRequest request
    ) {
        validateReservationTime(request);

        Customer customer = customerRepository
                .findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer",
                        "customerId",
                        request.customerId()
                ));

        RestaurantTable restaurantTable = restaurantTableRepository
                .findById(request.tableId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Restaurant table",
                        "tableId",
                        request.tableId()
                ));

        validateTableAvailability(restaurantTable);
        validateGuestCapacity(request, restaurantTable);
        validateNoOverlap(request);

        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setRestaurantTable(restaurantTable);
        reservation.setReservationDate(request.reservationDate());
        reservation.setStartTime(request.startTime());
        reservation.setEndTime(request.endTime());
        reservation.setNumberOfGuests(request.numberOfGuests());
        reservation.setReservationStatus("PENDING");

        Reservation savedReservation =
                reservationRepository.save(reservation);

        return reservationMapper.toResponse(savedReservation);
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(
            Integer reservationId
    ) {
        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reservation",
                        "reservationId",
                        reservationId
                ));

        return reservationMapper.toResponse(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getCustomerReservationHistory(
            Integer customerId
    ) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException(
                    "Customer",
                    "customerId",
                    customerId
            );
        }

        return reservationRepository
                .findByCustomerUserIdOrderByReservationDateDescStartTimeDesc(
                        customerId
                )
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    private void validateReservationTime(
            ReservationCreateRequest request
    ) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessRuleException(
                    "Reservation end time must be later than start time."
            );
        }
    }

    private void validateTableAvailability(
            RestaurantTable restaurantTable
    ) {
        if (!"AVAILABLE".equalsIgnoreCase(
                restaurantTable.getTableStatus()
        )) {
            throw new BusinessRuleException(
                    "The selected restaurant table is not available."
            );
        }
    }

    private void validateGuestCapacity(
            ReservationCreateRequest request,
            RestaurantTable restaurantTable
    ) {
        if (request.numberOfGuests()
                > restaurantTable.getCapacity()) {

            throw new BusinessRuleException(
                    "The number of guests exceeds the selected table capacity."
            );
        }
    }

    private void validateNoOverlap(
            ReservationCreateRequest request
    ) {
        boolean hasOverlap = !reservationRepository
                .findOverlappingReservations(
                        request.tableId(),
                        request.reservationDate(),
                        request.startTime(),
                        request.endTime()
                )
                .isEmpty();

        if (hasOverlap) {
            throw new BusinessRuleException(
                    "The selected table is already reserved "
                            + "for the requested time period."
            );
        }
    }
}