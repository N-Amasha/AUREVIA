package com.aurevia.inventory.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryItemResponse;
import com.aurevia.inventory.service.InventoryItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = InventoryItemController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class InventoryItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryItemService inventoryItemService;

    @Test
    void shouldGetAllInventoryItems() throws Exception {
        when(inventoryItemService.getAllInventoryItems())
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/inventory-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].inventoryItemId")
                        .value(1))
                .andExpect(jsonPath("$[0].itemName")
                        .value("Basmati Rice"));
    }

    @Test
    void shouldGetInventoryItemById() throws Exception {
        when(inventoryItemService
                .getInventoryItemById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/inventory-items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.supplierId").value(1))
                .andExpect(jsonPath("$.reorderRequired")
                        .value(true));
    }

    @Test
    void shouldGetItemsBySupplier() throws Exception {
        when(inventoryItemService.getItemsBySupplier(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-items/suppliers/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].supplierId")
                        .value(1));
    }

    @Test
    void shouldGetItemsByCategory() throws Exception {
        when(inventoryItemService
                .getItemsByCategory("GRAIN"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-items/categories/GRAIN")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].itemCategory")
                        .value("GRAIN"));
    }

    @Test
    void shouldGetReorderAlerts() throws Exception {
        when(inventoryItemService.getReorderAlerts())
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-items/alerts/reorder")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reorderRequired")
                        .value(true));
    }

    @Test
    void shouldGetExpiredItems() throws Exception {
        when(inventoryItemService.getExpiredItems())
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-items/alerts/expired")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].inventoryItemId")
                        .value(1));
    }

    @Test
    void shouldGetExpiryAlerts() throws Exception {
        LocalDate startDate =
                LocalDate.of(2026, 9, 28);
        LocalDate endDate =
                LocalDate.of(2026, 12, 31);

        when(inventoryItemService.getExpiryAlerts(
                startDate,
                endDate
        )).thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-items/alerts/expiring")
                                .param(
                                        "startDate",
                                        "2026-09-28"
                                )
                                .param(
                                        "endDate",
                                        "2026-12-31"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].expiryDate")
                        .value("2026-12-31"));
    }

    @Test
    void shouldReturnNotFoundForMissingItem()
            throws Exception {

        when(inventoryItemService
                .getInventoryItemById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Inventory item",
                                "inventoryItemId",
                                99
                        )
                );

        mockMvc.perform(get("/api/inventory-items/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Inventory item not found with "
                                + "inventoryItemId: 99"
                ));
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