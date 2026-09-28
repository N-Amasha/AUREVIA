package com.aurevia.inventory.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.WasteRecordCreateRequest;
import com.aurevia.inventory.dto.WasteRecordResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.entity.WasteRecord;
import com.aurevia.inventory.mapper.WasteRecordMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import com.aurevia.inventory.repository.WasteRecordRepository;
import com.aurevia.user.entity.InventoryManager;
import com.aurevia.user.repository.InventoryManagerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WasteRecordServiceTest {

    @Mock
    private WasteRecordRepository wasteRepository;

    @Mock
    private InventoryItemRepository itemRepository;

    @Mock
    private InventoryManagerRepository managerRepository;

    @Mock
    private WasteRecordMapper wasteMapper;

    @InjectMocks
    private WasteRecordService wasteService;

    @Test
    void shouldRecordWasteAndReduceStock() {
        InventoryItem item = item();
        InventoryManager manager =
                org.mockito.Mockito.mock(
                        InventoryManager.class
                );
        WasteRecordResponse response = response();

        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item));
        when(managerRepository.findById(26))
                .thenReturn(Optional.of(manager));
        when(wasteRepository.saveAndFlush(
                any(WasteRecord.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );
        when(wasteMapper.toResponse(
                any(WasteRecord.class)
        )).thenReturn(response);

        WasteRecordResponse result =
                wasteService.recordWaste(request());

        assertSame(response, result);
        assertEquals(
                new BigDecimal("8.000"),
                item.getCurrentQuantity()
        );
        verify(itemRepository).save(item);
    }

    @Test
    void shouldRejectWasteAboveAvailableQuantity() {
        WasteRecordCreateRequest request =
                new WasteRecordCreateRequest(
                        1,
                        26,
                        LocalDateTime.now(),
                        "Spoiled",
                        new BigDecimal("11.000")
                );

        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item()));

        assertThrows(
                BusinessRuleException.class,
                () -> wasteService.recordWaste(request)
        );

        verify(wasteRepository, never())
                .saveAndFlush(any());
    }

    @Test
    void shouldRejectMissingInventoryItem() {
        when(itemRepository.findById(99))
                .thenReturn(Optional.empty());

        WasteRecordCreateRequest request =
                new WasteRecordCreateRequest(
                        99,
                        26,
                        LocalDateTime.now(),
                        "Spoiled",
                        BigDecimal.ONE
                );

        assertThrows(
                ResourceNotFoundException.class,
                () -> wasteService.recordWaste(request)
        );
    }

    @Test
    void shouldRejectMissingInventoryManager() {
        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item()));
        when(managerRepository.findById(26))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> wasteService.recordWaste(request())
        );
    }

    @Test
    void shouldGetWasteRecordById() {
        WasteRecord wasteRecord = new WasteRecord();

        when(wasteRepository.findById(1))
                .thenReturn(Optional.of(wasteRecord));
        when(wasteMapper.toResponse(wasteRecord))
                .thenReturn(response());

        WasteRecordResponse result =
                wasteService.getWasteRecordById(1);

        assertEquals(1, result.wasteId());
    }

    @Test
    void shouldGetWasteByItem() {
        WasteRecord wasteRecord = new WasteRecord();

        when(wasteRepository
                .findByInventoryItemInventoryItemIdOrderByWasteDateDesc(
                        1
                ))
                .thenReturn(List.of(wasteRecord));
        when(wasteMapper.toResponse(wasteRecord))
                .thenReturn(response());

        List<WasteRecordResponse> result =
                wasteService.getWasteByItem(1);

        assertEquals(1, result.size());
    }

    @Test
    void shouldRejectInvalidWasteDateRange() {
        LocalDateTime startDate =
                LocalDateTime.of(2026, 10, 2, 10, 0);
        LocalDateTime endDate =
                LocalDateTime.of(2026, 10, 1, 10, 0);

        assertThrows(
                IllegalArgumentException.class,
                () -> wasteService.getWasteByDateRange(
                        startDate,
                        endDate
                )
        );
    }

    @Test
    void shouldReturnTotalEstimatedWasteCost() {
        when(wasteRepository
                .calculateTotalEstimatedWasteCost())
                .thenReturn(new BigDecimal("1000.00"));

        BigDecimal result =
                wasteService
                        .getTotalEstimatedWasteCost();

        assertEquals(
                new BigDecimal("1000.00"),
                result
        );
    }

    private InventoryItem item() {
        InventoryItem item = new InventoryItem();
        item.setInventoryItemId(1);
        item.setCurrentQuantity(
                new BigDecimal("10.000")
        );
        item.setUnitCost(
                new BigDecimal("500.00")
        );
        return item;
    }

    private WasteRecordCreateRequest request() {
        return new WasteRecordCreateRequest(
                1,
                26,
                LocalDateTime.of(
                        2026, 9, 28, 10, 0
                ),
                "Spoiled during storage",
                new BigDecimal("2.000")
        );
    }

    private WasteRecordResponse response() {
        return new WasteRecordResponse(
                1,
                1,
                "Basmati Rice",
                26,
                "Inventory Manager",
                LocalDateTime.of(
                        2026, 9, 28, 10, 0
                ),
                "Spoiled during storage",
                new BigDecimal("2.000"),
                "KG",
                new BigDecimal("1000.00")
        );
    }
}