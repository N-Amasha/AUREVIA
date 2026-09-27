package com.aurevia.menu.controller;

import com.aurevia.exception.GlobalExceptionHandler;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.service.MenuService;
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

@WebMvcTest(controllers = MenuController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MenuService menuService;

    @Test
    void shouldReturnMenuById() throws Exception {
        when(menuService.getMenuById(1))
                .thenReturn(menuResponse());

        mockMvc.perform(get("/api/menus/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.menuId").value(1))
                .andExpect(jsonPath("$.menuName")
                        .value("Fine Dining Menu"))
                .andExpect(jsonPath("$.items[0].menuItemId")
                        .value(1))
                .andExpect(jsonPath("$.items[0].price")
                        .value(2500.00));
    }

    @Test
    void shouldReturnNotFoundForUnknownMenu()
            throws Exception {

        when(menuService.getMenuById(99))
                .thenThrow(new ResourceNotFoundException(
                        "Menu",
                        "menuId",
                        99
                ));

        mockMvc.perform(get("/api/menus/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message")
                        .value("Menu not found with menuId: 99"));
    }

    @Test
    void shouldReturnActiveMenus() throws Exception {
        when(menuService.getActiveMenus())
                .thenReturn(List.of(menuResponse()));

        mockMvc.perform(get("/api/menus/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status")
                        .value("ACTIVE"))
                .andExpect(jsonPath("$[0].items.length()")
                        .value(1));
    }

    @Test
    void shouldReturnActiveMenusByType()
            throws Exception {

        when(menuService.getActiveMenusByType("DINE_IN"))
                .thenReturn(List.of(menuResponse()));

        mockMvc.perform(get("/api/menus/types/DINE_IN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].menuType")
                        .value("DINE_IN"));
    }

    @Test
    void shouldReturnAvailableItemsByMenu()
            throws Exception {

        when(menuService.getAvailableItemsByMenu(1))
                .thenReturn(List.of(itemResponse()));

        mockMvc.perform(
                        get("/api/menus/1/items/available")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].menuId").value(1))
                .andExpect(jsonPath("$[0].availabilityStatus")
                        .value("AVAILABLE"));
    }

    @Test
    void shouldReturnAvailableItemsByCategory()
            throws Exception {

        when(menuService.getAvailableItemsByCategory(
                "MAIN_COURSE"
        )).thenReturn(List.of(itemResponse()));

        mockMvc.perform(
                        get(
                                "/api/menus/items/categories/" +
                                "MAIN_COURSE"
                        )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category")
                        .value("MAIN_COURSE"))
                .andExpect(jsonPath("$[0].itemName")
                        .value("Grilled Chicken Supreme"));
    }

    private MenuResponse menuResponse() {
        return new MenuResponse(
                1,
                "Fine Dining Menu",
                "DINE_IN",
                "ACTIVE",
                "Premium menu",
                List.of(itemResponse())
        );
    }

    private MenuItemResponse itemResponse() {
        return new MenuItemResponse(
                1,
                1,
                "Fine Dining Menu",
                "Grilled Chicken Supreme",
                "MAIN_COURSE",
                "Grilled chicken with herb sauce",
                new BigDecimal("2500.00"),
                "AVAILABLE"
        );
    }
}