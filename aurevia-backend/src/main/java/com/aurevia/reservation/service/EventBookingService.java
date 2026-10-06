package com.aurevia.reservation.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.EventBookingCreateRequest;
import com.aurevia.reservation.dto.EventBookingResponse;
import com.aurevia.reservation.dto.EventBookingUpdateRequest;
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.reservation.entity.PricingRule;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.mapper.EventBookingMapper;
import com.aurevia.reservation.repository.EventBookingRepository;
import com.aurevia.reservation.repository.PricingRuleRepository;
import com.aurevia.reservation.repository.VenueRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EventBookingService {

    private final EventBookingRepository eventBookingRepository;
    private final CustomerRepository customerRepository;
    private final VenueRepository venueRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final EventBookingMapper eventBookingMapper;

    public EventBookingService(
            EventBookingRepository eventBookingRepository,
            CustomerRepository customerRepository,
            VenueRepository venueRepository,
            PricingRuleRepository pricingRuleRepository,
            EventBookingMapper eventBookingMapper
    ) {
        this.eventBookingRepository = eventBookingRepository;
        this.customerRepository = customerRepository;
        this.venueRepository = venueRepository;
        this.pricingRuleRepository = pricingRuleRepository;
        this.eventBookingMapper = eventBookingMapper;
    }

    @Transactional
    public EventBookingResponse createEventBooking(
            EventBookingCreateRequest request
    ) {
        Customer customer = customerRepository
                .findById(request.customerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                request.customerId()
                        )
                );

        Venue venue = venueRepository
                .findById(request.venueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                request.venueId()
                        )
                );

        validateVenueAvailability(venue);
        validateGuestCapacity(venue, request.guestCount());
        validateBookingConflict(request);

        BigDecimal totalAmount = calculateTotalAmount(
                venue,
                request.bookingDate()
        );

        EventBooking eventBooking = new EventBooking(
                customer,
                venue,
                request.bookingDate(),
                request.guestCount(),
                totalAmount,
                "PENDING"
        );

        EventBooking savedBooking =
                eventBookingRepository.save(eventBooking);

        return eventBookingMapper.toResponse(savedBooking);
    }

    @Transactional
    public EventBookingResponse updateEventBooking(
            Integer eventBookingId,
            EventBookingUpdateRequest request
    ) {
        EventBooking eventBooking =
                findEventBooking(eventBookingId);

        validatePendingBooking(eventBooking);

        Venue venue = venueRepository
                .findById(request.venueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue",
                                "venueId",
                                request.venueId()
                        )
                );

        validateVenueAvailability(venue);
        validateGuestCapacity(venue, request.guestCount());

        validateBookingConflictForUpdate(
                eventBookingId,
                request
        );

        BigDecimal totalAmount = calculateTotalAmount(
                venue,
                request.bookingDate()
        );

        eventBooking.setVenue(venue);
        eventBooking.setBookingDate(request.bookingDate());
        eventBooking.setGuestCount(request.guestCount());
        eventBooking.setTotalAmount(totalAmount);

        EventBooking updatedBooking =
                eventBookingRepository.save(eventBooking);

        return eventBookingMapper.toResponse(updatedBooking);
    }

    @Transactional
    public EventBookingResponse cancelEventBooking(
            Integer eventBookingId
    ) {
        EventBooking eventBooking =
                findEventBooking(eventBookingId);

        validatePendingBooking(eventBooking);

        eventBooking.setBookingStatus("CANCELLED");

        EventBooking cancelledBooking =
                eventBookingRepository.save(eventBooking);

        return eventBookingMapper.toResponse(cancelledBooking);
    }


    public List<EventBookingResponse> getAllEventBookings() {
        return eventBookingRepository
                .findAll()
                .stream()
                .sorted(
                        (first, second) ->
                                second.getBookingDate()
                                        .compareTo(
                                                first.getBookingDate()
                                        )
                )
                .map(eventBookingMapper::toResponse)
                .toList();
        }

    public EventBookingResponse getEventBookingById(
            Integer eventBookingId
    ) {
        return eventBookingMapper.toResponse(
                findEventBooking(eventBookingId)
        );
    }

    public List<EventBookingResponse> getCustomerEventBookings(
            Integer customerId
    ) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException(
                    "Customer",
                    "customerId",
                    customerId
            );
        }

        return eventBookingRepository
                .findByCustomerUserIdOrderByBookingDateDesc(
                        customerId
                )
                .stream()
                .map(eventBookingMapper::toResponse)
                .toList();
    }

    public List<EventBookingResponse> getEventBookingsByStatus(
            String bookingStatus
    ) {
        if (
                bookingStatus == null
                        || bookingStatus.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Booking status is required."
            );
        }

        return eventBookingRepository
                .findByBookingStatusIgnoreCase(
                        bookingStatus.trim()
                )
                .stream()
                .map(eventBookingMapper::toResponse)
                .toList();
    }

    private EventBooking findEventBooking(
            Integer eventBookingId
    ) {
        return eventBookingRepository
                .findById(eventBookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event booking",
                                "eventBookingId",
                                eventBookingId
                        )
                );
    }

    private void validateVenueAvailability(Venue venue) {
        if (
                !"AVAILABLE".equalsIgnoreCase(
                        venue.getAvailabilityStatus()
                )
        ) {
            throw new BusinessRuleException(
                    "The selected venue is not available."
            );
        }
    }

    private void validateGuestCapacity(
            Venue venue,
            Integer guestCount
    ) {
        if (guestCount > venue.getCapacity()) {
            throw new BusinessRuleException(
                    "Guest count exceeds the selected venue capacity."
            );
        }
    }

    private void validateBookingConflict(
            EventBookingCreateRequest request
    ) {
        boolean conflictExists =
                !eventBookingRepository
                        .findVenueBookingConflicts(
                                request.venueId(),
                                request.bookingDate()
                        )
                        .isEmpty();

        if (conflictExists) {
            throw new BusinessRuleException(
                    "The selected venue is already booked "
                            + "for the requested date."
            );
        }
    }

    private void validateBookingConflictForUpdate(
            Integer eventBookingId,
            EventBookingUpdateRequest request
    ) {
        boolean conflictExists =
                !eventBookingRepository
                        .findVenueBookingConflictsExcludingBooking(
                                request.venueId(),
                                request.bookingDate(),
                                eventBookingId
                        )
                        .isEmpty();

        if (conflictExists) {
            throw new BusinessRuleException(
                    "The selected venue is already booked "
                            + "for the requested date."
            );
        }
    }

    private void validatePendingBooking(
            EventBooking eventBooking
    ) {
        if (!"PENDING".equalsIgnoreCase(
                eventBooking.getBookingStatus()
        )) {
            throw new BusinessRuleException(
                    "Only pending event bookings can be modified."
            );
        }
    }

    private BigDecimal calculateTotalAmount(
            Venue venue,
            LocalDate bookingDate
    ) {
        List<PricingRule> pricingRules =
                pricingRuleRepository
                        .findApprovedRulesForDate(
                                venue.getVenueId(),
                                bookingDate
                        );

        if (pricingRules.isEmpty()) {
            return venue.getBasePrice();
        }

        PricingRule pricingRule = pricingRules.getFirst();

        return pricingRule
                .getPrice()
                .add(pricingRule.getSurcharge());
    }
}