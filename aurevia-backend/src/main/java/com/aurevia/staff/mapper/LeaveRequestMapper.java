package com.aurevia.staff.mapper;

import com.aurevia.staff.dto.LeaveRequestResponse;
import com.aurevia.staff.entity.LeaveRequest;
import com.aurevia.user.entity.HrManager;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class LeaveRequestMapper {

    public LeaveRequestResponse toResponse(
            LeaveRequest leaveRequest
    ) {
        UserAccount employeeAccount =
                leaveRequest.getEmployee().getUserAccount();

        String employeeName =
                employeeAccount.getFirstName()
                        + " "
                        + employeeAccount.getLastName();

        HrManager hrManager =
                leaveRequest.getReviewedByHrManager();

        Integer hrManagerId = null;
        String hrManagerName = null;

        if (hrManager != null) {
            hrManagerId = hrManager.getEmployeeId();

            UserAccount managerAccount =
                    hrManager.getEmployee().getUserAccount();

            hrManagerName =
                    managerAccount.getFirstName()
                            + " "
                            + managerAccount.getLastName();
        }

        return new LeaveRequestResponse(
                leaveRequest.getLeaveRequestId(),
                leaveRequest.getEmployee().getEmployeeId(),
                employeeName,
                hrManagerId,
                hrManagerName,
                leaveRequest.getRequestDate(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getLeaveType(),
                leaveRequest.getReason(),
                leaveRequest.getRequestStatus(),
                leaveRequest.getReviewedDate()
        );
    }
}