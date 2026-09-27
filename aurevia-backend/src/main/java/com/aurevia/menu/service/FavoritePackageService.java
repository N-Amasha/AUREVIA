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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class FavoritePackageService {

    private final FavoritePackageRepository
            favoritePackageRepository;

    private final CustomerRepository customerRepository;

    private final CateringPackageRepository
            cateringPackageRepository;

    private final FavoritePackageMapper favoritePackageMapper;

    public FavoritePackageService(
            FavoritePackageRepository favoritePackageRepository,
            CustomerRepository customerRepository,
            CateringPackageRepository cateringPackageRepository,
            FavoritePackageMapper favoritePackageMapper
    ) {
        this.favoritePackageRepository =
                favoritePackageRepository;
        this.customerRepository = customerRepository;
        this.cateringPackageRepository =
                cateringPackageRepository;
        this.favoritePackageMapper = favoritePackageMapper;
    }

    @Transactional
    public FavoritePackageResponse createFavorite(
            FavoritePackageCreateRequest request
    ) {
        Customer customer = findCustomer(request.customerId());

        CateringPackage cateringPackage =
                findPackage(request.packageId());

        boolean alreadySaved =
                favoritePackageRepository
                        .existsByCustomerUserIdAndCateringPackagePackageId(
                                request.customerId(),
                                request.packageId()
                        );

        if (alreadySaved) {
            throw new BusinessRuleException(
                    "The selected catering package is " +
                    "already saved by this customer."
            );
        }

        FavoritePackage favoritePackage =
                new FavoritePackage(
                        customer,
                        cateringPackage,
                        normalizeNotes(request.notes())
                );

        FavoritePackage savedFavorite =
                favoritePackageRepository.save(favoritePackage);

        return favoritePackageMapper.toResponse(savedFavorite);
    }

    public List<FavoritePackageResponse>
    getFavoritesByCustomer(Integer customerId) {

        findCustomer(customerId);

        return favoritePackageRepository
                .findByCustomerUserIdOrderBySavedDateDesc(
                        customerId
                )
                .stream()
                .map(favoritePackageMapper::toResponse)
                .toList();
    }

    @Transactional
    public void removeFavorite(
            Integer customerId,
            Integer packageId
    ) {
        FavoritePackage favoritePackage =
                favoritePackageRepository
                        .findByCustomerUserIdAndCateringPackagePackageId(
                                customerId,
                                packageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Favorite package",
                                        "customerId/packageId",
                                        customerId + "/" + packageId
                                )
                        );

        favoritePackageRepository.delete(favoritePackage);
    }

    private Customer findCustomer(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                customerId
                        )
                );
    }

    private CateringPackage findPackage(Integer packageId) {
        return cateringPackageRepository.findById(packageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Catering package",
                                "packageId",
                                packageId
                        )
                );
    }

    private String normalizeNotes(String notes) {
        if (notes == null || notes.isBlank()) {
            return null;
        }

        return notes.trim();
    }
}