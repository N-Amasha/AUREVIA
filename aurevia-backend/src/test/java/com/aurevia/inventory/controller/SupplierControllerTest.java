package com.aurevia.inventory.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.inventory.dto.SupplierResponse;
import com.aurevia.inventory.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SupplierController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SupplierService supplierService;

    @Test
    void shouldGetAllSuppliers() throws Exception {
        when(supplierService.getAllSuppliers())
                .thenReturn(List.of(response()));

        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].supplierId")
                        .value(1))
                .andExpect(jsonPath("$[0].supplierName")
                        .value("Fresh Foods Supplier"));
    }

    @Test
    void shouldGetSupplierById() throws Exception {
        when(supplierService.getSupplierById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.supplierId").value(1))
                .andExpect(jsonPath("$.city")
                        .value("Colombo"));
    }

    @Test
    void shouldSearchSuppliersByCity() throws Exception {
        when(supplierService.getSuppliersByCity("Colombo"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/suppliers/search")
                                .param("city", "Colombo")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].city")
                        .value("Colombo"));
    }

    @Test
    void shouldSearchSuppliersByProvince()
            throws Exception {

        when(supplierService
                .getSuppliersByProvince("Western"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/suppliers/search")
                                .param("province", "Western")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].province")
                        .value("Western"));
    }

    @Test
    void shouldRejectSearchWithoutCriteria()
            throws Exception {

        mockMvc.perform(get("/api/suppliers/search"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        "Either city or province is required."
                ));
    }

    @Test
    void shouldReturnNotFoundForMissingSupplier()
            throws Exception {

        when(supplierService.getSupplierById(99))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Supplier",
                                "supplierId",
                                99
                        )
                );

        mockMvc.perform(get("/api/suppliers/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        "Supplier not found with supplierId: 99"
                ));
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