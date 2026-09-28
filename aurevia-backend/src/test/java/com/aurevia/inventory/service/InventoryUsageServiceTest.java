package com.aurevia.inventory.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryUsageCreateRequest;
import com.aurevia.inventory.dto.InventoryUsageResponse;
import com.aurevia.inventory.entity.InventoryItem;
import com.aurevia.inventory.entity.InventoryUsage;
import com.aurevia.inventory.mapper.InventoryUsageMapper;
import com.aurevia.inventory.repository.InventoryItemRepository;
import com.aurevia.inventory.repository.InventoryUsageRepository;
import com.aurevia.menu.repository.CustomerOrderRepository;
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
class InventoryUsageServiceTest {

    @Mock
    private InventoryUsageRepository usageRepository;

    @Mock
    private InventoryItemRepository itemRepository;

    @Mock
    private CustomerOrderRepository orderRepository;

    @Mock
    private InventoryUsageMapper usageMapper;

    @InjectMocks
    private InventoryUsageService usageService;

    @Test
    void shouldRecordGeneralInventoryUsage() {
        InventoryItem item = item();
        InventoryUsageResponse response = response();

        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item));
        when(usageRepository.saveAndFlush(
                any(InventoryUsage.class)
        )).thenAnswer(invocation ->
                invocation.getArgument(0)
        );
        when(usageMapper.toResponse(
                any(InventoryUsage.class)
        )).thenReturn(response);

        InventoryUsageResponse result =
                usageService.recordUsage(request(null));

        assertSame(response, result);
        verify(usageRepository)
                .saveAndFlush(any(InventoryUsage.class));

        // Stock deduction is handled by the database trigger.
        verify(itemRepository, never()).save(any());
    }

    @Test
    void shouldRejectUsageAboveAvailableQuantity() {
        InventoryItem item = item();

        InventoryUsageCreateRequest request =
                new InventoryUsageCreateRequest(
                        1,
                        null,
                        LocalDateTime.now(),
                        new BigDecimal("11.000"),
                        "Kitchen usage"
                );

        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item));

        assertThrows(
                BusinessRuleException.class,
                () -> usageService.recordUsage(request)
        );

        verify(usageRepository, never())
                .saveAndFlush(any());
    }

    @Test
    void shouldRejectMissingInventoryItem() {
        when(itemRepository.findById(99))
                .thenReturn(Optional.empty());

        InventoryUsageCreateRequest request =
                new InventoryUsageCreateRequest(
                        99,
                        null,
                        LocalDateTime.now(),
                        BigDecimal.ONE,
                        "Kitchen usage"
                );

        assertThrows(
                ResourceNotFoundException.class,
                () -> usageService.recordUsage(request)
        );
    }

    @Test
    void shouldRejectMissingOrder() {
        when(itemRepository.findById(1))
                .thenReturn(Optional.of(item()));
        when(orderRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> usageService.recordUsage(
                        request(99)
                )
        );
    }

    @Test
    void shouldGetUsageById() {
        InventoryUsage usage = new InventoryUsage();

        when(usageRepository.findById(1))
                .thenReturn(Optional.of(usage));
        when(usageMapper.toResponse(usage))
                .thenReturn(response());

        InventoryUsageResponse result =
                usageService.getUsageById(1);

        assertEquals(1, result.usageId());
    }

    @Test
    void shouldGetUsageByItem() {
        InventoryUsage usage = new InventoryUsage();

        when(usageRepository
                .findByInventoryItemInventoryItemIdOrderByUsageDateDesc(
                        1
                ))
                .thenReturn(List.of(usage));
        when(usageMapper.toResponse(usage))
                .thenReturn(response());

        List<InventoryUsageResponse> result =
                usageService.getUsageByItem(1);

        assertEquals(1, result.size());
    }

    @Test
    void shouldRejectInvalidDateRange() {
        LocalDateTime startDate =
                LocalDateTime.of(2026, 10, 2, 10, 0);
        LocalDateTime endDate =
                LocalDateTime.of(2026, 10, 1, 10, 0);

        assertThrows(
                IllegalArgumentException.class,
                () -> usageService.getUsageByDateRange(
                        startDate,
                        endDate
                )
        );
    }

    @Test
    void shouldReturnTotalUsageForItem() {
        when(usageRepository
                .calculateTotalUsageForItem(1))
                .thenReturn(new BigDecimal("5.500"));

        BigDecimal result =
                usageService.getTotalUsageForItem(1);

        assertEquals(
                new BigDecimal("5.500"),
                result
        );
    }

    private InventoryItem item() {
        InventoryItem item = new InventoryItem();
        item.setInventoryItemId(1);
        item.setCurrentQuantity(
                new BigDecimal("10.000")
        );
        return item;
    }

    private InventoryUsageCreateRequest request(
            Integer orderId
    ) {
        return new InventoryUsageCreateRequest(
                1,
                orderId,
                LocalDateTime.of(
                        2026, 9, 28, 10, 0
                ),
                new BigDecimal("2.000"),
                "Kitchen usage"
        );
    }

    private InventoryUsageResponse response() {
        return new InventoryUsageResponse(
                1,
                1,
                "Basmati Rice",
                null,
                LocalDateTime.of(
                        2026, 9, 28, 10, 0
                ),
                new BigDecimal("2.000"),
                "KG",
                "Kitchen usage"
        );
    }
}