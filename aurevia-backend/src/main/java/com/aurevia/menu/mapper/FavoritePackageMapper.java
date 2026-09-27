package com.aurevia.menu.mapper;

import com.aurevia.menu.dto.FavoritePackageResponse;
import com.aurevia.menu.entity.CateringPackage;
import com.aurevia.menu.entity.FavoritePackage;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class FavoritePackageMapper {

    public FavoritePackageResponse toResponse(
            FavoritePackage favoritePackage
    ) {
        UserAccount userAccount =
                favoritePackage
                        .getCustomer()
                        .getUserAccount();

        CateringPackage cateringPackage =
                favoritePackage.getCateringPackage();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        return new FavoritePackageResponse(
                favoritePackage.getFavoriteId(),
                favoritePackage.getCustomer().getUserId(),
                customerName,
                cateringPackage.getPackageId(),
                cateringPackage.getPackageName(),
                cateringPackage.getPackageType(),
                cateringPackage.getBasePrice(),
                favoritePackage.getSavedDate(),
                favoritePackage.getNotes()
        );
    }
}