package com.aurevia.menu.service;

import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.dto.FavoritePackageCreateRequest;
import com.aurevia.menu.dto.FavoritePackageResponse;
import com.aurevia.menu.entity.CateringPackage;
import com.aurevia.menu.entity.FavoritePackage;
import com.aurevia.menu.mapper.FavoritePackageMapper;
import com.aurevia.menu.repository.CateringPackageRepository;
import com.aurevia.menu.repository.FavoritePackageRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoritePackageServiceTest {

    @Mock
    private FavoritePackageRepository
            favoritePackageRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CateringPackageRepository
            cateringPackageRepository;

    @Mock
    private FavoritePackageMapper favoritePackageMapper;

    @InjectMocks
    private FavoritePackageService favoritePackageService;

    @Test
    void shouldCreateFavorite() {
        Customer customer = mock(Customer.class);
        CateringPackage cateringPackage =
                mock(CateringPackage.class);
        FavoritePackage saved = mock(FavoritePackage.class);
        FavoritePackageResponse expected = response();

        FavoritePackageCreateRequest request =
                new FavoritePackageCreateRequest(
                        1,
                        2,
                        " Preferred package "
                );

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(cateringPackageRepository.findById(2))
                .thenReturn(Optional.of(cateringPackage));

        when(favoritePackageRepository
                .existsByCustomerUserIdAndCateringPackagePackageId(
                        1,
                        2
                ))
                .thenReturn(false);

        when(favoritePackageRepository.save(
                any(FavoritePackage.class)
        )).thenReturn(saved);

        when(favoritePackageMapper.toResponse(saved))
                .thenReturn(expected);

        FavoritePackageResponse actual =
                favoritePackageService
                        .createFavorite(request);

        assertEquals(expected, actual);
    }

    @Test
    void shouldRejectDuplicateFavorite() {
        Customer customer = mock(Customer.class);
        CateringPackage cateringPackage =
                mock(CateringPackage.class);

        FavoritePackageCreateRequest request =
                new FavoritePackageCreateRequest(
                        1,
                        2,
                        null
                );

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(cateringPackageRepository.findById(2))
                .thenReturn(Optional.of(cateringPackage));

        when(favoritePackageRepository
                .existsByCustomerUserIdAndCateringPackagePackageId(
                        1,
                        2
                ))
                .thenReturn(true);

        assertThrows(
                BusinessRuleException.class,
                () -> favoritePackageService
                        .createFavorite(request)
        );

        verify(
                favoritePackageRepository,
                never()
        ).save(any(FavoritePackage.class));
    }

    @Test
    void shouldRejectUnknownCustomerWhenCreatingFavorite() {
        FavoritePackageCreateRequest request =
                new FavoritePackageCreateRequest(
                        99,
                        2,
                        null
                );

        when(customerRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> favoritePackageService
                        .createFavorite(request)
        );

        verify(
                cateringPackageRepository,
                never()
        ).findById(2);
    }

    @Test
    void shouldReturnFavoritesByCustomer() {
        Customer customer = mock(Customer.class);
        FavoritePackage favoritePackage =
                mock(FavoritePackage.class);
        FavoritePackageResponse expected = response();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));

        when(favoritePackageRepository
                .findByCustomerUserIdOrderBySavedDateDesc(1))
                .thenReturn(List.of(favoritePackage));

        when(favoritePackageMapper.toResponse(
                favoritePackage
        )).thenReturn(expected);

        List<FavoritePackageResponse> result =
                favoritePackageService
                        .getFavoritesByCustomer(1);

        assertEquals(List.of(expected), result);
    }

    @Test
    void shouldRemoveFavorite() {
        FavoritePackage favoritePackage =
                mock(FavoritePackage.class);

        when(favoritePackageRepository
                .findByCustomerUserIdAndCateringPackagePackageId(
                        1,
                        2
                ))
                .thenReturn(Optional.of(favoritePackage));

        favoritePackageService.removeFavorite(1, 2);

        verify(favoritePackageRepository)
                .delete(favoritePackage);
    }

    @Test
    void shouldRejectRemovingUnknownFavorite() {
        when(favoritePackageRepository
                .findByCustomerUserIdAndCateringPackagePackageId(
                        1,
                        99
                ))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> favoritePackageService
                        .removeFavorite(1, 99)
        );

        verify(
                favoritePackageRepository,
                never()
        ).delete(any(FavoritePackage.class));
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