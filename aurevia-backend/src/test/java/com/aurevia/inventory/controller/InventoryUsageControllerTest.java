package com.aurevia.inventory.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.InventoryUsageResponse;
import com.aurevia.inventory.service.InventoryUsageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = InventoryUsageController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class InventoryUsageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryUsageService usageService;

    @Test
    void shouldRecordInventoryUsage() throws Exception {
        when(usageService.recordUsage(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/inventory-usages")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "inventoryItemId": 1,
                                          "usageDate": "2026-09-28T10:00:00",
                                          "quantityUsed": 2.000,
                                          "usageReason": "Kitchen usage"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usageId").value(1))
                .andExpect(jsonPath("$.quantityUsed")
                        .value(2.000));
    }

    @Test
    void shouldRejectInvalidUsageRequest() throws Exception {
        mockMvc.perform(
                        post("/api/inventory-usages")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "inventoryItemId": null,
                                          "usageDate": null,
                                          "quantityUsed": 0,
                                          "usageReason": ""
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error")
                        .value("Validation Failed"))
                .andExpect(jsonPath(
                        "$.validationErrors.inventoryItemId"
                ).value("Inventory item ID is required."));
    }

    @Test
    void shouldGetUsageById() throws Exception {
        when(usageService.getUsageById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/inventory-usages/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usageId").value(1));
    }

    @Test
    void shouldGetUsageByItem() throws Exception {
        when(usageService.getUsageByItem(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-usages/items/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].inventoryItemId")
                        .value(1));
    }

    @Test
    void shouldGetGeneralUsage() throws Exception {
        when(usageService.getGeneralUsage())
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-usages/general")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId")
                        .doesNotExist());
    }

    @Test
    void shouldGetUsageByDateRange() throws Exception {
        when(usageService.getUsageByDateRange(
                any(LocalDateTime.class),
                any(LocalDateTime.class)
        )).thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/inventory-usages/date-range")
                                .param(
                                        "startDate",
                                        "2026-09-28T00:00:00"
                                )
                                .param(
                                        "endDate",
                                        "2026-09-28T23:59:59"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].usageId")
                        .value(1));
    }

    @Test
    void shouldGetTotalUsageForItem() throws Exception {
        when(usageService.getTotalUsageForItem(1))
                .thenReturn(new BigDecimal("5.500"));

        mockMvc.perform(
                        get("/api/inventory-usages/items/1/total")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(5.500));
    }

    @Test
    void shouldReturnNotFoundForMissingUsage()
            throws Exception {

        when(usageService.getUsageById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Inventory usage",
                                "usageId",
                                99
                        )
                );

        mockMvc.perform(get("/api/inventory-usages/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Inventory usage not found with usageId: 99"
                ));
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