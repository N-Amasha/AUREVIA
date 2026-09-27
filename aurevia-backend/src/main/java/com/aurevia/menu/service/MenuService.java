package com.aurevia.menu.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.entity.Menu;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.mapper.MenuMapper;
import com.aurevia.menu.repository.MenuItemRepository;
import com.aurevia.menu.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuService {

    private static final String ACTIVE = "ACTIVE";
    private static final String AVAILABLE = "AVAILABLE";

    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuMapper menuMapper;

    public MenuService(
            MenuRepository menuRepository,
            MenuItemRepository menuItemRepository,
            MenuMapper menuMapper
    ) {
        this.menuRepository = menuRepository;
        this.menuItemRepository = menuItemRepository;
        this.menuMapper = menuMapper;
    }

    public MenuResponse getMenuById(Integer menuId) {
        Menu menu = findMenu(menuId);

        List<MenuItem> items =
                menuItemRepository
                        .findByMenuMenuIdOrderByMenuItemIdAsc(menuId);

        return menuMapper.toResponse(menu, items);
    }

    public List<MenuResponse> getActiveMenus() {
        return menuRepository.findByStatusIgnoreCase(ACTIVE)
                .stream()
                .map(this::mapWithAvailableItems)
                .toList();
    }

    public List<MenuResponse> getActiveMenusByType(
            String menuType
    ) {
        if (menuType == null || menuType.isBlank()) {
            throw new IllegalArgumentException(
                    "Menu type is required."
            );
        }

        return menuRepository
                .findByMenuTypeIgnoreCaseAndStatusIgnoreCase(
                        menuType.trim(),
                        ACTIVE
                )
                .stream()
                .map(this::mapWithAvailableItems)
                .toList();
    }

    public List<MenuItemResponse> getAvailableItemsByMenu(
            Integer menuId
    ) {
        findMenu(menuId);

        return menuItemRepository
                .findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
                        menuId,
                        AVAILABLE
                )
                .stream()
                .map(menuMapper::toItemResponse)
                .toList();
    }

    public List<MenuItemResponse> getAvailableItemsByCategory(
            String category
    ) {
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException(
                    "Menu item category is required."
            );
        }

        return menuItemRepository
                .findByCategoryIgnoreCaseAndAvailabilityStatusIgnoreCase(
                        category.trim(),
                        AVAILABLE
                )
                .stream()
                .map(menuMapper::toItemResponse)
                .toList();
    }

    private Menu findMenu(Integer menuId) {
        return menuRepository.findById(menuId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Menu",
                                "menuId",
                                menuId
                        )
                );
    }

    private MenuResponse mapWithAvailableItems(Menu menu) {
        List<MenuItem> items =
                menuItemRepository
                        .findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
                                menu.getMenuId(),
                                AVAILABLE
                        );

        return menuMapper.toResponse(menu, items);
    }
}