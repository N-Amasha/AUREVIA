package com.aurevia.inventory.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryItemResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.mapper.InventoryItemMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryItemServiceTest {

    @Mock
    private InventoryItemRepository inventoryItemRepository;

    @Mock
    private InventoryItemMapper inventoryItemMapper;

    @InjectMocks
    private InventoryItemService inventoryItemService;

    @Test
    void shouldGetInventoryItemById() {
        InventoryItem item = new InventoryItem();
        InventoryItemResponse response = response();

        when(inventoryItemRepository.findById(1))
                .thenReturn(Optional.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response);

        InventoryItemResponse result =
                inventoryItemService
                        .getInventoryItemById(1);

        assertSame(response, result);
    }

    @Test
    void shouldRejectMissingInventoryItem() {
        when(inventoryItemRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> inventoryItemService
                        .getInventoryItemById(99)
        );
    }

    @Test
    void shouldGetAllInventoryItems() {
        InventoryItem item = new InventoryItem();

        when(inventoryItemRepository.findAll())
                .thenReturn(List.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response());

        List<InventoryItemResponse> result =
                inventoryItemService
                        .getAllInventoryItems();

        assertEquals(1, result.size());
    }

    @Test
    void shouldGetItemsBySupplier() {
        InventoryItem item = new InventoryItem();

        when(inventoryItemRepository
                .findBySupplierSupplierIdOrderByItemNameAsc(1))
                .thenReturn(List.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response());

        List<InventoryItemResponse> result =
                inventoryItemService
                        .getItemsBySupplier(1);

        assertEquals(1, result.size());
    }

    @Test
    void shouldGetReorderAlerts() {
        InventoryItem item = new InventoryItem();

        when(inventoryItemRepository
                .findItemsAtOrBelowReorderLevel())
                .thenReturn(List.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response());

        List<InventoryItemResponse> result =
                inventoryItemService.getReorderAlerts();

        assertEquals(1, result.size());
    }

    @Test
    void shouldGetExpiredItems() {
        InventoryItem item = new InventoryItem();

        when(inventoryItemRepository
                .findByExpiryDateBeforeOrderByExpiryDateAsc(
                        LocalDate.now()
                ))
                .thenReturn(List.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response());

        List<InventoryItemResponse> result =
                inventoryItemService.getExpiredItems();

        assertEquals(1, result.size());
    }

    @Test
    void shouldGetExpiryAlertsForValidRange() {
        LocalDate startDate = LocalDate.of(
                2026, 9, 28
        );
        LocalDate endDate = LocalDate.of(
                2026, 10, 28
        );

        InventoryItem item = new InventoryItem();

        when(inventoryItemRepository
                .findItemsExpiringBetween(
                        startDate,
                        endDate
                ))
                .thenReturn(List.of(item));
        when(inventoryItemMapper.toResponse(item))
                .thenReturn(response());

        List<InventoryItemResponse> result =
                inventoryItemService.getExpiryAlerts(
                        startDate,
                        endDate
                );

        assertEquals(1, result.size());
    }

    @Test
    void shouldRejectInvalidExpiryRange() {
        LocalDate startDate = LocalDate.of(
                2026, 10, 28
        );
        LocalDate endDate = LocalDate.of(
                2026, 9, 28
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> inventoryItemService.getExpiryAlerts(
                        startDate,
                        endDate
                )
        );

        verify(inventoryItemRepository, never())
                .findItemsExpiringBetween(
                        org.mockito.ArgumentMatchers.any(),
                        org.mockito.ArgumentMatchers.any()
                );
    }

    private InventoryItemResponse response() {
        return new InventoryItemResponse(
                1,
                1,
                "Fresh Foods Supplier",
                "Basmati Rice",
                "GRAIN",
                "KG",
                new BigDecimal("10.000"),
                new BigDecimal("15.000"),
                new BigDecimal("500.00"),
                LocalDate.of(2026, 12, 31),
                true,
                false
        );
    }
}