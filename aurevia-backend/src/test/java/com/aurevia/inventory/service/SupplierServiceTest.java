package com.aurevia.inventory.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.SupplierResponse;
import com.aurevia.inventory.entity.Supplier;
import com.aurevia.inventory.mapper.SupplierMapper;
import com.aurevia.inventory.repository.SupplierRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private SupplierMapper supplierMapper;

    @InjectMocks
    private SupplierService supplierService;

    @Test
    void shouldGetSupplierById() {
        Supplier supplier = new Supplier();
        SupplierResponse response = response();

        when(supplierRepository.findById(1))
                .thenReturn(Optional.of(supplier));
        when(supplierMapper.toResponse(supplier))
                .thenReturn(response);

        SupplierResponse result =
                supplierService.getSupplierById(1);

        assertSame(response, result);
    }

    @Test
    void shouldRejectMissingSupplier() {
        when(supplierRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> supplierService.getSupplierById(99)
        );
    }

    @Test
    void shouldGetAllSuppliers() {
        Supplier supplier = new Supplier();

        when(supplierRepository.findAll())
                .thenReturn(List.of(supplier));
        when(supplierMapper.toResponse(supplier))
                .thenReturn(response());

        List<SupplierResponse> result =
                supplierService.getAllSuppliers();

        assertEquals(1, result.size());
    }

    @Test
    void shouldGetSuppliersByCity() {
        Supplier supplier = new Supplier();

        when(supplierRepository
                .findByCityIgnoreCaseOrderBySupplierNameAsc(
                        "Colombo"
                ))
                .thenReturn(List.of(supplier));
        when(supplierMapper.toResponse(supplier))
                .thenReturn(response());

        List<SupplierResponse> result =
                supplierService.getSuppliersByCity(
                        " Colombo "
                );

        assertEquals(1, result.size());
    }

    @Test
    void shouldRejectBlankCity() {
        assertThrows(
                IllegalArgumentException.class,
                () -> supplierService.getSuppliersByCity(" ")
        );

        verify(supplierRepository, never())
                .findByCityIgnoreCaseOrderBySupplierNameAsc(
                        org.mockito.ArgumentMatchers.any()
                );
    }

    @Test
    void shouldRejectBlankProvince() {
        assertThrows(
                IllegalArgumentException.class,
                () -> supplierService.getSuppliersByProvince(null)
        );

        verify(supplierRepository, never())
                .findByProvinceIgnoreCaseOrderBySupplierNameAsc(
                        org.mockito.ArgumentMatchers.any()
                );
    }

    private SupplierResponse response() {
        return new SupplierResponse(
                1,
                "Fresh Foods Supplier",
                "supplier@test.com",
                "0711002001",
                "10 Market Road",
                "Colombo",
                "Western",
                "00100"
        );
    }
}