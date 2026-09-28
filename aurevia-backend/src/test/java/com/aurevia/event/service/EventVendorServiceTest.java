package com.aurevia.event.service;

import com.aurevia.event.dto.EventServiceCreateRequest;
import com.aurevia.event.dto.EventServiceResponse;
import com.aurevia.event.entity.Event;
import com.aurevia.event.entity.EventService;
import com.aurevia.event.entity.Vendor;
import com.aurevia.event.mapper.EventServiceMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.event.repository.EventServiceRepository;
import com.aurevia.event.repository.VendorRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventVendorServiceTest {

    @Mock
    private EventServiceRepository eventServiceRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private EventServiceMapper eventServiceMapper;

    private EventVendorService eventVendorService;

    @BeforeEach
    void setUp() {
        eventVendorService = new EventVendorService(
                eventServiceRepository,
                eventRepository,
                vendorRepository,
                eventServiceMapper
        );
    }

    @Test
    void shouldCreateEventService() {
        Event event = mock(Event.class);
        Vendor vendor = mock(Vendor.class);
        EventService savedService = mock(EventService.class);
        EventServiceResponse response = response();

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));
        when(event.getEventDate())
                .thenReturn(LocalDate.of(2026, 11, 10));
        when(event.getEventId()).thenReturn(1);
        when(event.getBudget())
                .thenReturn(new BigDecimal("500000.00"));
        when(eventServiceRepository
                .calculateEventServiceCost(1))
                .thenReturn(new BigDecimal("85000.00"));
        when(eventServiceRepository.save(any(EventService.class)))
                .thenReturn(savedService);
        when(eventServiceMapper.toResponse(savedService))
                .thenReturn(response);

        assertEquals(
                response,
                eventVendorService.createEventService(request())
        );
    }

    @Test
    void shouldRejectInvalidServiceTime() {
        EventServiceCreateRequest request =
                new EventServiceCreateRequest(
                        1,
                        1,
                        "Floral Decoration",
                        LocalDate.of(2026, 11, 10),
                        LocalTime.of(16, 0),
                        LocalTime.of(9, 0),
                        new BigDecimal("75000.00")
                );

        assertThrows(
                BusinessRuleException.class,
                () -> eventVendorService
                        .createEventService(request)
        );
    }

    @Test
    void shouldRejectMissingEvent() {
        when(eventRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> eventVendorService
                        .createEventService(request())
        );
    }

    @Test
    void shouldRejectMismatchedServiceDate() {
        Event event = mock(Event.class);

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(mock(Vendor.class)));
        when(event.getEventDate())
                .thenReturn(LocalDate.of(2026, 11, 11));

        assertThrows(
                BusinessRuleException.class,
                () -> eventVendorService
                        .createEventService(request())
        );
    }

    @Test
    void shouldRejectCostAboveEventBudget() {
        Event event = mock(Event.class);

        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(mock(Vendor.class)));
        when(event.getEventDate())
                .thenReturn(LocalDate.of(2026, 11, 10));
        when(event.getEventId()).thenReturn(1);
        when(event.getBudget())
                .thenReturn(new BigDecimal("100000.00"));
        when(eventServiceRepository
                .calculateEventServiceCost(1))
                .thenReturn(new BigDecimal("50000.00"));

        assertThrows(
                BusinessRuleException.class,
                () -> eventVendorService
                        .createEventService(request())
        );
    }

    @Test
    void shouldReturnEventServiceById() {
        EventService eventService = mock(EventService.class);
        EventServiceResponse response = response();

        when(eventServiceRepository.findById(1))
                .thenReturn(Optional.of(eventService));
        when(eventServiceMapper.toResponse(eventService))
                .thenReturn(response);

        assertEquals(
                response,
                eventVendorService.getEventServiceById(1)
        );
    }

    @Test
    void shouldReturnServicesByEvent() {
        EventService eventService = mock(EventService.class);
        EventServiceResponse response = response();

        when(eventServiceRepository
                .findByEventEventIdOrderByServiceDateAscStartTimeAsc(1))
                .thenReturn(List.of(eventService));
        when(eventServiceMapper.toResponse(eventService))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                eventVendorService.getServicesByEvent(1)
        );
    }

    @Test
    void shouldReturnTotalServiceCost() {
        when(eventRepository.existsById(1)).thenReturn(true);
        when(eventServiceRepository.calculateEventServiceCost(1))
                .thenReturn(new BigDecimal("160000.00"));

        assertEquals(
                new BigDecimal("160000.00"),
                eventVendorService.getTotalServiceCost(1)
        );
    }

    private EventServiceCreateRequest request() {
        return new EventServiceCreateRequest(
                1,
                1,
                "Floral Decoration",
                LocalDate.of(2026, 11, 10),
                LocalTime.of(9, 0),
                LocalTime.of(16, 0),
                new BigDecimal("75000.00")
        );
    }

    private EventServiceResponse response() {
        return new EventServiceResponse(
                1,
                1,
                "Perera Wedding Reception",
                1,
                "Elegant Floral Designs",
                "FLORAL",
                "Floral Decoration",
                LocalDate.of(2026, 11, 10),
                LocalTime.of(9, 0),
                LocalTime.of(16, 0),
                new BigDecimal("75000.00"),
                "PLANNED"
        );
    }
}