package com.aurevia.event.service;

import com.aurevia.event.dto.VendorResponse;
import com.aurevia.event.entity.Vendor;
import com.aurevia.event.mapper.VendorMapper;
import com.aurevia.event.repository.VendorRepository;
import com.aurevia.exception.ResourceNotFoundException;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private VendorMapper vendorMapper;

    private VendorService vendorService;

    @BeforeEach
    void setUp() {
        vendorService = new VendorService(
                vendorRepository,
                vendorMapper
        );
    }

    @Test
    void shouldReturnVendorById() {
        Vendor vendor = mock(Vendor.class);
        VendorResponse response = response(1);

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));
        when(vendorMapper.toResponse(vendor))
                .thenReturn(response);

        assertEquals(response, vendorService.getVendorById(1));
    }

    @Test
    void shouldRejectMissingVendor() {
        when(vendorRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> vendorService.getVendorById(99)
        );
    }

    @Test
    void shouldReturnAllVendors() {
        Vendor vendor = mock(Vendor.class);
        VendorResponse response = response(1);

        when(vendorRepository.findAll())
                .thenReturn(List.of(vendor));
        when(vendorMapper.toResponse(vendor))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                vendorService.getAllVendors()
        );
    }

    @Test
    void shouldReturnVendorsByType() {
        Vendor vendor = mock(Vendor.class);
        VendorResponse response = response(1);

        when(vendorRepository.findByVendorTypeIgnoreCase(
                "FLORAL"
        )).thenReturn(List.of(vendor));
        when(vendorMapper.toResponse(vendor))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                vendorService.getVendorsByType(" FLORAL ")
        );

        verify(vendorRepository)
                .findByVendorTypeIgnoreCase("FLORAL");
    }

    @Test
    void shouldReturnVendorsByCity() {
        Vendor vendor = mock(Vendor.class);
        VendorResponse response = response(1);

        when(vendorRepository.findByCityIgnoreCase("Colombo"))
                .thenReturn(List.of(vendor));
        when(vendorMapper.toResponse(vendor))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                vendorService.getVendorsByCity(" Colombo ")
        );

        verify(vendorRepository).findByCityIgnoreCase("Colombo");
    }

    @Test
    void shouldRejectBlankSearchValues() {
        assertThrows(
                IllegalArgumentException.class,
                () -> vendorService.getVendorsByType(" ")
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> vendorService.getVendorsByCity(null)
        );
    }

    private VendorResponse response(Integer vendorId) {
        return new VendorResponse(
                vendorId,
                "Elegant Floral Designs",
                "FLORAL",
                "contact@elegantfloral.test",
                "0711001001",
                "10 Flower Road",
                "Colombo",
                "Western",
                "00500"
        );
    }
}