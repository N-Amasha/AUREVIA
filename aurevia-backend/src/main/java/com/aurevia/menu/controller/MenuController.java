package com.aurevia.menu.controller;

import com.aurevia.menu.dto.MenuItemRequest;
import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.service.MenuService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@Validated
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<MenuResponse> getMenuById(
            @PathVariable
            @Positive(message = "Menu ID must be positive.")
            Integer menuId
    ) {
        return ResponseEntity.ok(
                menuService.getMenuById(menuId)
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<MenuResponse>> getActiveMenus() {
        return ResponseEntity.ok(
                menuService.getActiveMenus()
        );
    }

    @GetMapping("/types/{menuType}")
    public ResponseEntity<List<MenuResponse>>
    getActiveMenusByType(
            @PathVariable String menuType
    ) {
        return ResponseEntity.ok(
                menuService.getActiveMenusByType(menuType)
        );
    }

    @GetMapping("/items")
    public ResponseEntity<List<MenuItemResponse>>
    getAllMenuItems() {
        return ResponseEntity.ok(
                menuService.getAllMenuItems()
        );
    }

    @GetMapping("/items/{menuItemId}")
    public ResponseEntity<MenuItemResponse>
    getMenuItemById(
            @PathVariable
            @Positive(message = "Menu item ID must be positive.")
            Integer menuItemId
    ) {
        return ResponseEntity.ok(
                menuService.getMenuItemById(menuItemId)
        );
    }

    @GetMapping("/{menuId}/items/available")
    public ResponseEntity<List<MenuItemResponse>>
    getAvailableItemsByMenu(
            @PathVariable
            @Positive(message = "Menu ID must be positive.")
            Integer menuId
    ) {
        return ResponseEntity.ok(
                menuService.getAvailableItemsByMenu(menuId)
        );
    }

    @GetMapping("/items/categories/{category}")
    public ResponseEntity<List<MenuItemResponse>>
    getAvailableItemsByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                menuService.getAvailableItemsByCategory(category)
        );
    }

    @PostMapping("/items")
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @Valid
            @RequestBody
            MenuItemRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(menuService.createMenuItem(request));
    }

    @PutMapping("/items/{menuItemId}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable
            @Positive(message = "Menu item ID must be positive.")
            Integer menuItemId,

            @Valid
            @RequestBody
            MenuItemRequest request
    ) {
        return ResponseEntity.ok(
                menuService.updateMenuItem(
                        menuItemId,
                        request
                )
        );
    }

    @DeleteMapping("/items/{menuItemId}")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable
            @Positive(message = "Menu item ID must be positive.")
            Integer menuItemId
    ) {
        menuService.deleteMenuItem(menuItemId);
        return ResponseEntity.noContent().build();
    }
}