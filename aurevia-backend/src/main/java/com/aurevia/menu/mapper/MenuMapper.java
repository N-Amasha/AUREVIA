package com.aurevia.menu.mapper;

import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.entity.Menu;
import com.aurevia.menu.entity.MenuItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MenuMapper {

    public MenuItemResponse toItemResponse(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getMenuItemId(),
                menuItem.getMenu().getMenuId(),
                menuItem.getMenu().getMenuName(),
                menuItem.getItemName(),
                menuItem.getCategory(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getAvailabilityStatus()
        );
    }

    public MenuResponse toResponse(
            Menu menu,
            List<MenuItem> menuItems
    ) {
        List<MenuItemResponse> items = menuItems.stream()
                .map(this::toItemResponse)
                .toList();

        return new MenuResponse(
                menu.getMenuId(),
                menu.getMenuName(),
                menu.getMenuType(),
                menu.getStatus(),
                menu.getDescription(),
                items
        );
    }
}