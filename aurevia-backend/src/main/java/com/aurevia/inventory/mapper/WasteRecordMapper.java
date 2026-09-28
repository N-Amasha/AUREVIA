package com.aurevia.inventory.mapper;

import com.aurevia.inventory.dto.WasteRecordResponse;
import com.aurevia.inventory.entity.WasteRecord;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class WasteRecordMapper {

    public WasteRecordResponse toResponse(
            WasteRecord wasteRecord
    ) {
        UserAccount userAccount =
                wasteRecord.getRecordedByManager()
                        .getEmployee()
                        .getUserAccount();

        String managerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        return new WasteRecordResponse(
                wasteRecord.getWasteId(),
                wasteRecord.getInventoryItem()
                        .getInventoryItemId(),
                wasteRecord.getInventoryItem().getItemName(),
                wasteRecord.getRecordedByManager()
                        .getEmployeeId(),
                managerName,
                wasteRecord.getWasteDate(),
                wasteRecord.getWasteReason(),
                wasteRecord.getQuantity(),
                wasteRecord.getInventoryItem().getUnit(),
                wasteRecord.getEstimatedCost()
        );
    }
}