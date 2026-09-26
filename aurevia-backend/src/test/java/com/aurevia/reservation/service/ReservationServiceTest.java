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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ReservationMapper reservationMapper;

    private ReservationService reservationService;

    private ReservationCreateRequest validRequest;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository,
                restaurantTableRepository,
                customerRepository,
                reservationMapper
        );

        validRequest = new ReservationCreateRequest(
                1,
                2,
                LocalDate.of(2026, 10, 15),
                LocalTime.of(18, 0),
                LocalTime.of(20, 0),
                4
        );
    }

    @Test
    void shouldCreateReservationSuccessfully() {
        Customer customer = mock(Customer.class);
        RestaurantTable restaurantTable =
                mock(RestaurantTable.class);

        ReservationResponse expectedResponse =
                createResponse(10);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(restaurantTableRepository.findById(2))
                .thenReturn(Optional.of(restaurantTable));

        when(restaurantTable.getTableStatus())
                .thenReturn("AVAILABLE");

        when(restaurantTable.getCapacity())
                .thenReturn(4);

        when(reservationRepository.findOverlappingReservations(
                2,
                validRequest.reservationDate(),
                validRequest.startTime(),
                validRequest.endTime()
        )).thenReturn(List.of());

        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(reservationMapper.toResponse(any(Reservation.class)))
                .thenReturn(expectedResponse);

        ReservationResponse actualResponse =
                reservationService.createReservation(validRequest);

        assertThat(actualResponse).isEqualTo(expectedResponse);

        ArgumentCaptor<Reservation> captor =
                ArgumentCaptor.forClass(Reservation.class);

        verify(reservationRepository).save(captor.capture());

        Reservation savedReservation = captor.getValue();

        assertThat(savedReservation.getCustomer())
                .isSameAs(customer);
        assertThat(savedReservation.getRestaurantTable())
                .isSameAs(restaurantTable);
        assertThat(savedReservation.getReservationDate())
                .isEqualTo(validRequest.reservationDate());
        assertThat(savedReservation.getStartTime())
                .isEqualTo(validRequest.startTime());
        assertThat(savedReservation.getEndTime())
                .isEqualTo(validRequest.endTime());
        assertThat(savedReservation.getNumberOfGuests())
                .isEqualTo(4);
        assertThat(savedReservation.getReservationStatus())
                .isEqualTo("PENDING");
    }

    @Test
    void shouldRejectInvalidReservationTime() {
        ReservationCreateRequest invalidRequest =
                new ReservationCreateRequest(
                        1,
                        2,
                        LocalDate.of(2026, 10, 15),
                        LocalTime.of(20, 0),
                        LocalTime.of(18, 0),
                        4
                );

        assertThatThrownBy(() ->
                reservationService.createReservation(invalidRequest)
        )
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage(
                        "Reservation end time must be later than start time."
                );

        verifyNoInteractions(
                customerRepository,
                restaurantTableRepository,
                reservationRepository,
                reservationMapper
        );
    }

    @Test
    void shouldRejectMissingCustomer() {
        when(customerRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                reservationService.createReservation(validRequest)
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer not found with customerId: 1");

        verify(reservationRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectMissingRestaurantTable() {
        Customer customer = mock(Customer.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(restaurantTableRepository.findById(2))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                reservationService.createReservation(validRequest)
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(
                        "Restaurant table not found with tableId: 2"
                );

        verify(reservationRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectUnavailableRestaurantTable() {
        Customer customer = mock(Customer.class);
        RestaurantTable restaurantTable =
                mock(RestaurantTable.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(restaurantTableRepository.findById(2))
                .thenReturn(Optional.of(restaurantTable));

        when(restaurantTable.getTableStatus())
                .thenReturn("MAINTENANCE");

        assertThatThrownBy(() ->
                reservationService.createReservation(validRequest)
        )
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage(
                        "The selected restaurant table is not available."
                );

        verify(reservationRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectGuestCountAboveTableCapacity() {
        Customer customer = mock(Customer.class);
        RestaurantTable restaurantTable =
                mock(RestaurantTable.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(restaurantTableRepository.findById(2))
                .thenReturn(Optional.of(restaurantTable));

        when(restaurantTable.getTableStatus())
                .thenReturn("AVAILABLE");

        when(restaurantTable.getCapacity())
                .thenReturn(3);

        assertThatThrownBy(() ->
                reservationService.createReservation(validRequest)
        )
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage(
                        "The number of guests exceeds "
                                + "the selected table capacity."
                );

        verify(reservationRepository, never())
                .save(any());
    }

    @Test
    void shouldRejectOverlappingReservation() {
        Customer customer = mock(Customer.class);
        RestaurantTable restaurantTable =
                mock(RestaurantTable.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(restaurantTableRepository.findById(2))
                .thenReturn(Optional.of(restaurantTable));

        when(restaurantTable.getTableStatus())
                .thenReturn("AVAILABLE");

        when(restaurantTable.getCapacity())
                .thenReturn(4);

        when(reservationRepository.findOverlappingReservations(
                2,
                validRequest.reservationDate(),
                validRequest.startTime(),
                validRequest.endTime()
        )).thenReturn(List.of(new Reservation()));

        assertThatThrownBy(() ->
                reservationService.createReservation(validRequest)
        )
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage(
                        "The selected table is already reserved "
                                + "for the requested time period."
                );

        verify(reservationRepository, never())
                .save(any());
    }

    @Test
    void shouldGetReservationById() {
        Reservation reservation = new Reservation();
        ReservationResponse expectedResponse =
                createResponse(1);

        when(reservationRepository.findById(1))
                .thenReturn(Optional.of(reservation));

        when(reservationMapper.toResponse(reservation))
                .thenReturn(expectedResponse);

        ReservationResponse actualResponse =
                reservationService.getReservationById(1);

        assertThat(actualResponse).isEqualTo(expectedResponse);
    }

    @Test
    void shouldRejectMissingReservationId() {
        when(reservationRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                reservationService.getReservationById(99)
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(
                        "Reservation not found with reservationId: 99"
                );
    }

    @Test
    void shouldGetCustomerReservationHistory() {
        Reservation firstReservation = new Reservation();
        Reservation secondReservation = new Reservation();

        ReservationResponse firstResponse = createResponse(1);
        ReservationResponse secondResponse = createResponse(2);

        when(customerRepository.existsById(1))
                .thenReturn(true);

        when(reservationRepository
                .findByCustomerUserIdOrderByReservationDateDescStartTimeDesc(
                        1
                ))
                .thenReturn(List.of(
                        firstReservation,
                        secondReservation
                ));

        when(reservationMapper.toResponse(firstReservation))
                .thenReturn(firstResponse);

        when(reservationMapper.toResponse(secondReservation))
                .thenReturn(secondResponse);

        List<ReservationResponse> responses =
                reservationService
                        .getCustomerReservationHistory(1);

        assertThat(responses)
                .containsExactly(firstResponse, secondResponse);
    }

    @Test
    void shouldRejectHistoryForMissingCustomer() {
        when(customerRepository.existsById(99))
                .thenReturn(false);

        assertThatThrownBy(() ->
                reservationService
                        .getCustomerReservationHistory(99)
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer not found with customerId: 99");

        verify(reservationRepository, never())
                .findByCustomerUserIdOrderByReservationDateDescStartTimeDesc(
                        any()
                );
    }

    private ReservationResponse createResponse(
            Integer reservationId
    ) {
        return new ReservationResponse(
                reservationId,
                1,
                "Amaya Perera",
                2,
                "T02",
                "Main Dining Area",
                LocalDate.of(2026, 10, 15),
                LocalTime.of(18, 0),
                LocalTime.of(20, 0),
                4,
                "PENDING",
                null
        );
    }
}