package com.aurevia.menu.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CateringPackageResponse;
import com.aurevia.menu.service.CateringPackageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CateringPackageController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class CateringPackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CateringPackageService cateringPackageService;

    @Test
    void shouldReturnPackageById() throws Exception {
        when(cateringPackageService.getPackageById(1))
                .thenReturn(response());

        mockMvc.perform(get("/api/catering-packages/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.packageId").value(1))
                .andExpect(jsonPath("$.packageName")
                        .value("Silver Wedding Package"))
                .andExpect(jsonPath("$.basePrice")
                        .value(150000.00))
                .andExpect(jsonPath("$.minimumGuests")
                        .value(50))
                .andExpect(jsonPath("$.maximumGuests")
                        .value(150));
    }

    @Test
    void shouldReturnNotFoundForUnknownPackage()
            throws Exception {

        when(cateringPackageService.getPackageById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Catering package",
                        "packageId",
                        99
                ));

        mockMvc.perform(get("/api/catering-packages/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(
                        "Catering package not found " +
                        "with packageId: 99"
                ));
    }

    @Test
    void shouldReturnPackagesByType() throws Exception {
        when(cateringPackageService
                .getPackagesByType("WEDDING"))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get(
                                "/api/catering-packages/types/" +
                                "WEDDING"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].packageType")
                        .value("WEDDING"));
    }

    @Test
    void shouldReturnPackagesSupportingGuestCount()
            throws Exception {

        when(cateringPackageService
                .getPackagesSupportingGuestCount(100))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get("/api/catering-packages/supported")
                                .param("guestCount", "100")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].minimumGuests")
                        .value(50))
                .andExpect(jsonPath("$[0].maximumGuests")
                        .value(150));
    }

    private CateringPackageResponse response() {
        return new CateringPackageResponse(
                1,
                "Silver Wedding Package",
                "Essential wedding catering package",
                "WEDDING",
                new BigDecimal("150000.00"),
                50,
                150,
                List.of()
        );
    }
}