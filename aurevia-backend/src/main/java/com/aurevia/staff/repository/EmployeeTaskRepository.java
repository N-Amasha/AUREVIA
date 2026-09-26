package com.aurevia.staff.repository;

import com.aurevia.staff.entity.EmployeeTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeTaskRepository
        extends JpaRepository<EmployeeTask, Integer> {

    List<EmployeeTask>
    findByEmployeeEmployeeIdOrderByDueDateAsc(
            Integer employeeId
    );

    List<EmployeeTask>
    findByEventEventIdOrderByDueDateAsc(
            Integer eventId
    );

    List<EmployeeTask>
    findByEventIsNullOrderByDueDateAsc();

    List<EmployeeTask>
    findByTaskStatusIgnoreCaseOrderByDueDateAsc(
            String taskStatus
    );

    List<EmployeeTask>
    findByDueDateBetweenOrderByDueDateAsc(
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
            SELECT task
            FROM EmployeeTask task
            WHERE task.dueDate < :referenceDate
              AND UPPER(task.taskStatus) <> 'COMPLETED'
            ORDER BY task.dueDate ASC
            """)
    List<EmployeeTask> findOverdueIncompleteTasks(
            @Param("referenceDate") LocalDate referenceDate
    );
}