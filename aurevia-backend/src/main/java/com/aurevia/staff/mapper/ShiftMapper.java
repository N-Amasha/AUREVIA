package com.aurevia.staff.mapper;

import com.aurevia.staff.dto.ShiftResponse;
import com.aurevia.staff.entity.Shift;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class ShiftMapper {

    public ShiftResponse toResponse(Shift shift) {
        UserAccount userAccount =
                shift.getEmployee().getUserAccount();

        String employeeName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        return new ShiftResponse(
                shift.getShiftId(),
                shift.getEmployee().getEmployeeId(),
                employeeName,
                shift.getShiftDate(),
                shift.getStartTime(),
                shift.getEndTime(),
                shift.getShiftStatus()
        );
    }
}