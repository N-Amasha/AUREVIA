package com.aurevia.menu.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.MenuItemRequest;
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
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class MenuService {

    private static final String ACTIVE = "ACTIVE";
    private static final String AVAILABLE = "AVAILABLE";

    private static final Set<String> ALLOWED_ITEM_STATUSES =
            Set.of("AVAILABLE", "UNAVAILABLE");

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

    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll()
                .stream()
                .map(menuMapper::toItemResponse)
                .toList();
    }

    public MenuItemResponse getMenuItemById(
            Integer menuItemId
    ) {
        return menuMapper.toItemResponse(
                findMenuItem(menuItemId)
        );
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

    @Transactional
    public MenuItemResponse createMenuItem(
            MenuItemRequest request
    ) {
        Menu menu = findMenu(request.menuId());
        String status =
                normalizeAndValidateItemStatus(
                        request.availabilityStatus()
                );

        MenuItem menuItem = new MenuItem(
                menu,
                request.itemName().trim(),
                request.category().trim().toUpperCase(),
                normalizeOptionalText(request.description()),
                request.price(),
                status
        );

        return menuMapper.toItemResponse(
                menuItemRepository.save(menuItem)
        );
    }

    @Transactional
    public MenuItemResponse updateMenuItem(
            Integer menuItemId,
            MenuItemRequest request
    ) {
        MenuItem menuItem = findMenuItem(menuItemId);
        Menu menu = findMenu(request.menuId());

        String status =
                normalizeAndValidateItemStatus(
                        request.availabilityStatus()
                );

        menuItem.setMenu(menu);
        menuItem.setItemName(request.itemName().trim());
        menuItem.setCategory(
                request.category().trim().toUpperCase()
        );
        menuItem.setDescription(
                normalizeOptionalText(request.description())
        );
        menuItem.setPrice(request.price());
        menuItem.setAvailabilityStatus(status);

        return menuMapper.toItemResponse(
                menuItemRepository.save(menuItem)
        );
    }

    @Transactional
    public void deleteMenuItem(Integer menuItemId) {
        MenuItem menuItem = findMenuItem(menuItemId);
        menuItemRepository.delete(menuItem);
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

    private MenuItem findMenuItem(Integer menuItemId) {
        return menuItemRepository.findById(menuItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Menu item",
                                "menuItemId",
                                menuItemId
                        )
                );
    }

    private String normalizeAndValidateItemStatus(
            String availabilityStatus
    ) {
        String normalizedStatus =
                availabilityStatus.trim().toUpperCase();

        if (!ALLOWED_ITEM_STATUSES.contains(
                normalizedStatus
        )) {
            throw new BusinessRuleException(
                    "Availability status must be AVAILABLE or UNAVAILABLE."
            );
        }

        return normalizedStatus;
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
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