package com.aurevia.menu.controller;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.menu.dto.FavoritePackageCreateRequest;
import com.aurevia.menu.dto.FavoritePackageResponse;
import com.aurevia.menu.service.FavoritePackageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = FavoritePackageController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class FavoritePackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FavoritePackageService favoritePackageService;

    @Test
    void shouldCreateFavorite() throws Exception {
        when(favoritePackageService.createFavorite(
                any(FavoritePackageCreateRequest.class)
        )).thenReturn(response());

        mockMvc.perform(
                        post("/api/favorite-packages")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "customerId": 1,
                                          "packageId": 2,
                                          "notes": "Preferred package"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.favoriteId").value(1))
                .andExpect(jsonPath("$.customerId").value(1))
                .andExpect(jsonPath("$.packageId").value(2))
                .andExpect(jsonPath("$.packageName")
                        .value("Gold Wedding Package"));
    }

    @Test
    void shouldValidateFavoriteRequest() throws Exception {
        mockMvc.perform(
                        post("/api/favorite-packages")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("{}")
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(
                        "$.validationErrors.customerId"
                ).value("Customer ID is required."))
                .andExpect(jsonPath(
                        "$.validationErrors.packageId"
                ).value("Package ID is required."));
    }

    @Test
    void shouldReturnConflictForDuplicateFavorite()
            throws Exception {

        when(favoritePackageService.createFavorite(
                any(FavoritePackageCreateRequest.class)
        )).thenThrow(new BusinessRuleException(
                "The selected catering package is " +
                "already saved by this customer."
        ));

        mockMvc.perform(
                        post("/api/favorite-packages")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "customerId": 1,
                                          "packageId": 2
                                        }
                                        """)
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(
                        "The selected catering package is " +
                        "already saved by this customer."
                ));
    }

    @Test
    void shouldReturnFavoritesByCustomer()
            throws Exception {

        when(favoritePackageService
                .getFavoritesByCustomer(1))
                .thenReturn(List.of(response()));

        mockMvc.perform(
                        get(
                                "/api/favorite-packages/" +
                                "customers/1"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerId")
                        .value(1))
                .andExpect(jsonPath("$[0].packageId")
                        .value(2));
    }

    @Test
    void shouldRemoveFavorite() throws Exception {
        mockMvc.perform(
                        delete(
                                "/api/favorite-packages/" +
                                "customers/1/packages/2"
                        )
                )
                .andExpect(status().isNoContent());

        verify(favoritePackageService)
                .removeFavorite(1, 2);
    }

    private FavoritePackageResponse response() {
        return new FavoritePackageResponse(
                1,
                1,
                "Amaya Perera",
                2,
                "Gold Wedding Package",
                "WEDDING",
                new BigDecimal("280000.00"),
                LocalDateTime.of(
                        2026,
                        9,
                        15,
                        10,
                        0
                ),
                "Preferred package"
        );
    }
}