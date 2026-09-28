package com.aurevia.staff.mapper;

import com.aurevia.staff.dto.AttendanceResponse;
import com.aurevia.staff.entity.Attendance;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(
            Attendance attendance
    ) {
        UserAccount userAccount =
                attendance.getEmployee().getUserAccount();

        String employeeName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        Integer shiftId =
                attendance.getShift() == null
                        ? null
                        : attendance.getShift().getShiftId();

        return new AttendanceResponse(
                attendance.getAttendanceId(),
                attendance.getEmployee().getEmployeeId(),
                employeeName,
                shiftId,
                attendance.getAttendanceDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getAttendanceStatus()
        );
    }
}