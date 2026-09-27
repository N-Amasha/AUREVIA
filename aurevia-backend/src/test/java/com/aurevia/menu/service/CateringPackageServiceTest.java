package com.aurevia.menu.service;

import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.CateringPackageResponse;
import com.aurevia.menu.entity.CateringPackage;
import com.aurevia.menu.entity.PackageItem;
import com.aurevia.menu.mapper.CateringPackageMapper;
import com.aurevia.menu.repository.CateringPackageRepository;
import com.aurevia.menu.repository.PackageItemRepository;
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
class CateringPackageServiceTest {

    @Mock
    private CateringPackageRepository
            cateringPackageRepository;

    @Mock
    private PackageItemRepository packageItemRepository;

    @Mock
    private CateringPackageMapper cateringPackageMapper;

    @InjectMocks
    private CateringPackageService cateringPackageService;

    @Test
    void shouldReturnPackageById() {
        CateringPackage cateringPackage =
                mock(CateringPackage.class);
        PackageItem packageItem = mock(PackageItem.class);
        CateringPackageResponse expected = response();

        when(cateringPackage.getPackageId()).thenReturn(1);

        when(cateringPackageRepository.findById(1))
                .thenReturn(Optional.of(cateringPackage));

        when(packageItemRepository
                .findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                        1
                ))
                .thenReturn(List.of(packageItem));

        when(cateringPackageMapper.toResponse(
                cateringPackage,
                List.of(packageItem)
        )).thenReturn(expected);

        CateringPackageResponse actual =
                cateringPackageService.getPackageById(1);

        assertEquals(expected, actual);
    }

    @Test
    void shouldRejectUnknownPackage() {
        when(cateringPackageRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> cateringPackageService
                        .getPackageById(99)
        );

        verify(
                packageItemRepository,
                never()
        ).findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                99
        );
    }

    @Test
    void shouldReturnPackagesByType() {
        CateringPackage cateringPackage =
                mock(CateringPackage.class);
        CateringPackageResponse expected = response();

        when(cateringPackage.getPackageId()).thenReturn(1);

        when(cateringPackageRepository
                .findByPackageTypeIgnoreCase("WEDDING"))
                .thenReturn(List.of(cateringPackage));

        when(packageItemRepository
                .findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                        1
                ))
                .thenReturn(List.of());

        when(cateringPackageMapper.toResponse(
                cateringPackage,
                List.of()
        )).thenReturn(expected);

        List<CateringPackageResponse> result =
                cateringPackageService
                        .getPackagesByType(" WEDDING ");

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRejectBlankPackageType() {
        assertThrows(
                IllegalArgumentException.class,
                () -> cateringPackageService
                        .getPackagesByType(" ")
        );
    }

    @Test
    void shouldReturnPackagesSupportingGuestCount() {
        CateringPackage cateringPackage =
                mock(CateringPackage.class);
        CateringPackageResponse expected = response();

        when(cateringPackage.getPackageId()).thenReturn(1);

        when(cateringPackageRepository
                .findPackagesSupportingGuestCount(100))
                .thenReturn(List.of(cateringPackage));

        when(packageItemRepository
                .findByCateringPackagePackageIdOrderByIdMenuItemIdAsc(
                        1
                ))
                .thenReturn(List.of());

        when(cateringPackageMapper.toResponse(
                cateringPackage,
                List.of()
        )).thenReturn(expected);

        List<CateringPackageResponse> result =
                cateringPackageService
                        .getPackagesSupportingGuestCount(100);

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRejectNonPositiveGuestCount() {
        assertThrows(
                IllegalArgumentException.class,
                () -> cateringPackageService
                        .getPackagesSupportingGuestCount(0)
        );
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