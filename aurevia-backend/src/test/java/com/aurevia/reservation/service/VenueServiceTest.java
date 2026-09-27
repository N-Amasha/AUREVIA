package com.aurevia.reservation.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.reservation.dto.VenueResponse;
import com.aurevia.reservation.entity.Venue;
import com.aurevia.reservation.entity.VenueFeature;
import com.aurevia.reservation.mapper.VenueMapper;
import com.aurevia.reservation.repository.VenueFeatureRepository;
import com.aurevia.reservation.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private VenueFeatureRepository venueFeatureRepository;

    @Mock
    private VenueMapper venueMapper;

    private VenueService venueService;

    @BeforeEach
    void setUp() {
        venueService = new VenueService(
                venueRepository,
                venueFeatureRepository,
                venueMapper
        );
    }

    @Test
    void shouldReturnVenueByIdWithFeatures() {
        Venue venue = mock(Venue.class);
        VenueFeature firstFeature = mock(VenueFeature.class);
        VenueFeature secondFeature = mock(VenueFeature.class);
        VenueResponse expectedResponse = mock(VenueResponse.class);

        when(venue.getVenueId()).thenReturn(1);
        when(firstFeature.getFeatureName())
                .thenReturn("Air Conditioning");
        when(secondFeature.getFeatureName())
                .thenReturn("Professional Sound System");

        when(venueRepository.findById(1))
                .thenReturn(Optional.of(venue));

        when(
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(1)
        ).thenReturn(List.of(firstFeature, secondFeature));

        when(
                venueMapper.toResponse(
                        venue,
                        List.of(
                                "Air Conditioning",
                                "Professional Sound System"
                        )
                )
        ).thenReturn(expectedResponse);

        VenueResponse actualResponse =
                venueService.getVenueById(1);

        assertEquals(expectedResponse, actualResponse);

        verify(venueRepository).findById(1);
        verify(venueFeatureRepository)
                .findByVenueVenueIdOrderByIdFeatureNameAsc(1);
        verify(venueMapper).toResponse(
                venue,
                List.of(
                        "Air Conditioning",
                        "Professional Sound System"
                )
        );
    }

    @Test
    void shouldThrowExceptionWhenVenueDoesNotExist() {
        when(venueRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> venueService.getVenueById(99)
        );

        verify(venueFeatureRepository, never())
                .findByVenueVenueIdOrderByIdFeatureNameAsc(99);
    }

    @Test
    void shouldReturnAllAvailableVenuesWhenCapacityIsNull() {
        Venue firstVenue = mock(Venue.class);
        Venue secondVenue = mock(Venue.class);

        VenueResponse firstResponse = mock(VenueResponse.class);
        VenueResponse secondResponse = mock(VenueResponse.class);

        when(firstVenue.getVenueId()).thenReturn(1);
        when(secondVenue.getVenueId()).thenReturn(2);

        when(
                venueRepository
                        .findByAvailabilityStatusIgnoreCase(
                                "AVAILABLE"
                        )
        ).thenReturn(List.of(firstVenue, secondVenue));

        when(
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(1)
        ).thenReturn(List.of());

        when(
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(2)
        ).thenReturn(List.of());

        when(venueMapper.toResponse(firstVenue, List.of()))
                .thenReturn(firstResponse);

        when(venueMapper.toResponse(secondVenue, List.of()))
                .thenReturn(secondResponse);

        List<VenueResponse> responses =
                venueService.getAvailableVenues(null);

        assertEquals(
                List.of(firstResponse, secondResponse),
                responses
        );

        verify(venueRepository)
                .findByAvailabilityStatusIgnoreCase("AVAILABLE");
    }

    @Test
    void shouldReturnAvailableVenuesWithMinimumCapacity() {
        Venue venue = mock(Venue.class);
        VenueResponse expectedResponse = mock(VenueResponse.class);

        when(venue.getVenueId()).thenReturn(1);

        when(
                venueRepository
                        .findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
                                "AVAILABLE",
                                200
                        )
        ).thenReturn(List.of(venue));

        when(
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(1)
        ).thenReturn(List.of());

        when(venueMapper.toResponse(venue, List.of()))
                .thenReturn(expectedResponse);

        List<VenueResponse> responses =
                venueService.getAvailableVenues(200);

        assertEquals(List.of(expectedResponse), responses);

        verify(venueRepository)
                .findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
                        "AVAILABLE",
                        200
                );
    }

    @Test
    void shouldRejectNonPositiveMinimumCapacity() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> venueService.getAvailableVenues(0)
                );

        assertEquals(
                "Minimum capacity must be positive.",
                exception.getMessage()
        );

        verify(
                venueRepository,
                never()
        ).findByAvailabilityStatusIgnoreCaseAndCapacityGreaterThanEqual(
                "AVAILABLE",
                0
        );
    }

    @Test
    void shouldReturnVenuesByTrimmedType() {
        Venue venue = mock(Venue.class);
        VenueResponse expectedResponse = mock(VenueResponse.class);

        when(venue.getVenueId()).thenReturn(1);

        when(venueRepository.findByVenueTypeIgnoreCase("BALLROOM"))
                .thenReturn(List.of(venue));

        when(
                venueFeatureRepository
                        .findByVenueVenueIdOrderByIdFeatureNameAsc(1)
        ).thenReturn(List.of());

        when(venueMapper.toResponse(venue, List.of()))
                .thenReturn(expectedResponse);

        List<VenueResponse> responses =
                venueService.getVenuesByType("  BALLROOM  ");

        assertEquals(List.of(expectedResponse), responses);

        verify(venueRepository)
                .findByVenueTypeIgnoreCase("BALLROOM");
    }

    @Test
    void shouldRejectBlankVenueType() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> venueService.getVenuesByType("   ")
                );

        assertEquals(
                "Venue type is required.",
                exception.getMessage()
        );

        verify(
                venueRepository,
                never()
        ).findByVenueTypeIgnoreCase("   ");
    }

    @Test
    void shouldRejectNullVenueType() {
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> venueService.getVenuesByType(null)
                );

        assertEquals(
                "Venue type is required.",
                exception.getMessage()
        );

        verify(
                venueRepository,
                never()
        ).findByVenueTypeIgnoreCase(null);
    }
}