package com.aurevia.menu.controller;

import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<MenuResponse> getMenuById(
            @PathVariable Integer menuId
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

    @GetMapping("/{menuId}/items/available")
    public ResponseEntity<List<MenuItemResponse>>
    getAvailableItemsByMenu(
            @PathVariable Integer menuId
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
}