package com.aurevia.menu.dto;

import java.util.List;

public record MenuResponse(
        Integer menuId,
        String menuName,
        String menuType,
        String status,
        String description,
        List<MenuItemResponse> items
) {
}