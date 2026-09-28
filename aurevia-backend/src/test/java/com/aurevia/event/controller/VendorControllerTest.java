package com.aurevia.event.controller;

import com.aurevia.event.dto.VendorResponse;
import com.aurevia.event.service.VendorService;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VendorController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class VendorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VendorService vendorService;

    @Test
    void shouldReturnVendorById() throws Exception {
        when(vendorService.getVendorById(1))
                .thenReturn(response(1));

        mockMvc.perform(get("/api/vendors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vendorId").value(1))
                .andExpect(jsonPath("$.vendorName")
                        .value("Elegant Floral Designs"))
                .andExpect(jsonPath("$.vendorType")
                        .value("FLORAL"))
                .andExpect(jsonPath("$.city")
                        .value("Colombo"));
    }

    @Test
    void shouldReturnAllVendors() throws Exception {
        when(vendorService.getAllVendors())
                .thenReturn(List.of(response(1)));

        mockMvc.perform(get("/api/vendors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vendorId").value(1))
                .andExpect(jsonPath("$[0].vendorName")
                        .value("Elegant Floral Designs"));
    }

    @Test
    void shouldReturnVendorsByType() throws Exception {
        when(vendorService.getVendorsByType("FLORAL"))
                .thenReturn(List.of(response(1)));

        mockMvc.perform(get("/api/vendors/types/FLORAL"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vendorType")
                        .value("FLORAL"));

        verify(vendorService).getVendorsByType("FLORAL");
    }

    @Test
    void shouldReturnVendorsByCity() throws Exception {
        when(vendorService.getVendorsByCity("Colombo"))
                .thenReturn(List.of(response(1)));

        mockMvc.perform(
                        get("/api/vendors/search")
                                .param("city", "Colombo")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].city")
                        .value("Colombo"));

        verify(vendorService).getVendorsByCity("Colombo");
    }

    @Test
    void shouldReturnNotFoundForMissingVendor() throws Exception {
        when(vendorService.getVendorById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Vendor",
                        "vendorId",
                        99
                ));

        mockMvc.perform(get("/api/vendors/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(
                        "Vendor not found with vendorId: 99"
                ));
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