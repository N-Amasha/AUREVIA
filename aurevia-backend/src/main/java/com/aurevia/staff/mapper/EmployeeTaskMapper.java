package com.aurevia.staff.mapper;

import com.aurevia.event.entity.Event;
import com.aurevia.staff.dto.EmployeeTaskResponse;
import com.aurevia.staff.entity.EmployeeTask;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EmployeeTaskMapper {

    public EmployeeTaskResponse toResponse(
            EmployeeTask employeeTask
    ) {
        return toResponse(employeeTask, LocalDate.now());
    }

    public EmployeeTaskResponse toResponse(
            EmployeeTask employeeTask,
            LocalDate referenceDate
    ) {
        UserAccount userAccount =
                employeeTask.getEmployee().getUserAccount();

        String employeeName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        Event event = employeeTask.getEvent();

        Integer eventId =
                event == null ? null : event.getEventId();

        String eventName =
                event == null ? null : event.getEventName();

        boolean overdue =
                employeeTask.getDueDate()
                        .isBefore(referenceDate)
                        && !"COMPLETED".equalsIgnoreCase(
                                employeeTask.getTaskStatus()
                        );

        return new EmployeeTaskResponse(
                employeeTask.getTaskId(),
                employeeTask.getEmployee().getEmployeeId(),
                employeeName,
                eventId,
                eventName,
                employeeTask.getTaskDescription(),
                employeeTask.getAssignedDate(),
                employeeTask.getDueDate(),
                employeeTask.getTaskStatus(),
                overdue
        );
    }
}