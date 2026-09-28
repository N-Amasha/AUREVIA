package com.aurevia.inventory.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.WasteRecordResponse;
import com.aurevia.inventory.service.WasteRecordService;
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

@WebMvcTest(controllers = WasteRecordController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class WasteRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WasteRecordService wasteService;

    @Test
    void shouldRecordWaste() throws Exception {
        when(wasteService.recordWaste(any()))
                .thenReturn(response());

        mockMvc.perform(
                        post("/api/waste-records")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "inventoryItemId": 1,
                                          "managerId": 26,
                                          "wasteDate": "2026-09-28T10:00:00",
                                          "wasteReason": "Spoiled during storage",
                                          "quantity": 2.000
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.wasteId").value(1))
                .andExpect(jsonPath("$.estimatedCost")
                        .value(1000.00));
    }

    @Test
    void shouldRejectInvalidWasteRequest() throws Exception {
        mockMvc.perform(
                        post("/api/waste-records")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "inventoryItemId": null,
                                          "managerId": null,
                                          "wasteDate": null,
                                          "wasteReason": "",
                                          "quantity": 0
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
    void shouldGetWasteRecordById() throws Exception {
        when(wasteService.getWasteRecordById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/waste-records/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wasteId").value(1))
                .andExpect(jsonPath("$.managerId").value(26));
    }

    @Test
    void shouldGetWasteByItem() throws Exception {
        when(wasteService.getWasteByItem(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/waste-records/items/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].inventoryItemId")
                        .value(1));
    }

    @Test
    void shouldGetWasteByManager() throws Exception {
        when(wasteService.getWasteByManager(26))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/waste-records/managers/26")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].managerId")
                        .value(26));
    }

    @Test
    void shouldGetWasteByDateRange() throws Exception {
        when(wasteService.getWasteByDateRange(
                any(LocalDateTime.class),
                any(LocalDateTime.class)
        )).thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/waste-records/date-range")
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
                .andExpect(jsonPath("$[0].wasteId")
                        .value(1));
    }

    @Test
    void shouldGetTotalWasteCost() throws Exception {
        when(wasteService
                .getTotalEstimatedWasteCost())
                .thenReturn(new BigDecimal("1000.00"));

        mockMvc.perform(
                        get("/api/waste-records/total-cost")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(1000.00));
    }

    @Test
    void shouldGetWasteCostForItem() throws Exception {
        when(wasteService
                .getEstimatedWasteCostForItem(1))
                .thenReturn(new BigDecimal("1000.00"));

        mockMvc.perform(
                        get(
                                "/api/waste-records/items/1/total-cost"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(1000.00));
    }

    @Test
    void shouldReturnNotFoundForMissingWasteRecord()
            throws Exception {

        when(wasteService.getWasteRecordById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Waste record",
                                "wasteId",
                                99
                        )
                );

        mockMvc.perform(get("/api/waste-records/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Waste record not found with wasteId: 99"
                ));
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