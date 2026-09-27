package com.aurevia.menu.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.MenuItemResponse;
import com.aurevia.menu.dto.MenuResponse;
import com.aurevia.menu.entity.Menu;
import com.aurevia.menu.entity.MenuItem;
import com.aurevia.menu.mapper.MenuMapper;
import com.aurevia.menu.repository.MenuItemRepository;
import com.aurevia.menu.repository.MenuRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private MenuMapper menuMapper;

    @InjectMocks
    private MenuService menuService;

    @Test
    void shouldReturnMenuById() {
        Menu menu = mock(Menu.class);
        MenuItem item = mock(MenuItem.class);
        MenuResponse expected = menuResponse(1);

        when(menuRepository.findById(1))
                .thenReturn(Optional.of(menu));

        when(menuItemRepository
                .findByMenuMenuIdOrderByMenuItemIdAsc(1))
                .thenReturn(List.of(item));

        when(menuMapper.toResponse(menu, List.of(item)))
                .thenReturn(expected);

        MenuResponse actual = menuService.getMenuById(1);

        assertEquals(expected, actual);
    }

    @Test
    void shouldRejectUnknownMenu() {
        when(menuRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> menuService.getMenuById(99)
        );

        verify(
                menuItemRepository,
                never()
        ).findByMenuMenuIdOrderByMenuItemIdAsc(99);
    }

    @Test
    void shouldReturnActiveMenusWithAvailableItems() {
        Menu menu = mock(Menu.class);
        MenuItem item = mock(MenuItem.class);
        MenuResponse expected = menuResponse(1);

        when(menu.getMenuId()).thenReturn(1);

        when(menuRepository.findByStatusIgnoreCase("ACTIVE"))
                .thenReturn(List.of(menu));

        when(menuItemRepository
                .findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
                        1,
                        "AVAILABLE"
                ))
                .thenReturn(List.of(item));

        when(menuMapper.toResponse(menu, List.of(item)))
                .thenReturn(expected);

        List<MenuResponse> result =
                menuService.getActiveMenus();

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldReturnActiveMenusByType() {
        Menu menu = mock(Menu.class);
        MenuResponse expected = menuResponse(1);

        when(menu.getMenuId()).thenReturn(1);

        when(menuRepository
                .findByMenuTypeIgnoreCaseAndStatusIgnoreCase(
                        "DINE_IN",
                        "ACTIVE"
                ))
                .thenReturn(List.of(menu));

        when(menuItemRepository
                .findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
                        1,
                        "AVAILABLE"
                ))
                .thenReturn(List.of());

        when(menuMapper.toResponse(menu, List.of()))
                .thenReturn(expected);

        List<MenuResponse> result =
                menuService.getActiveMenusByType(" DINE_IN ");

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRejectBlankMenuType() {
        assertThrows(
                IllegalArgumentException.class,
                () -> menuService.getActiveMenusByType(" ")
        );

        verify(
                menuRepository,
                never()
        ).findByMenuTypeIgnoreCaseAndStatusIgnoreCase(
                " ",
                "ACTIVE"
        );
    }

    @Test
    void shouldReturnAvailableItemsByMenu() {
        Menu menu = mock(Menu.class);
        MenuItem item = mock(MenuItem.class);
        MenuItemResponse expected = itemResponse(1);

        when(menuRepository.findById(1))
                .thenReturn(Optional.of(menu));

        when(menuItemRepository
                .findByMenuMenuIdAndAvailabilityStatusIgnoreCaseOrderByMenuItemIdAsc(
                        1,
                        "AVAILABLE"
                ))
                .thenReturn(List.of(item));

        when(menuMapper.toItemResponse(item))
                .thenReturn(expected);

        List<MenuItemResponse> result =
                menuService.getAvailableItemsByMenu(1);

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldReturnAvailableItemsByCategory() {
        MenuItem item = mock(MenuItem.class);
        MenuItemResponse expected = itemResponse(1);

        when(menuItemRepository
                .findByCategoryIgnoreCaseAndAvailabilityStatusIgnoreCase(
                        "DESSERT",
                        "AVAILABLE"
                ))
                .thenReturn(List.of(item));

        when(menuMapper.toItemResponse(item))
                .thenReturn(expected);

        List<MenuItemResponse> result =
                menuService.getAvailableItemsByCategory(
                        " DESSERT "
                );

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRejectBlankCategory() {
        assertThrows(
                IllegalArgumentException.class,
                () -> menuService
                        .getAvailableItemsByCategory(" ")
        );
    }

    private MenuResponse menuResponse(Integer menuId) {
        return new MenuResponse(
                menuId,
                "Fine Dining Menu",
                "DINE_IN",
                "ACTIVE",
                "Premium menu",
                List.of()
        );
    }

    private MenuItemResponse itemResponse(
            Integer menuItemId
    ) {
        return new MenuItemResponse(
                menuItemId,
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