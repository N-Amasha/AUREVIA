package com.aurevia.user.repository;

import com.aurevia.user.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository
        extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByUserAccountEmailIgnoreCase(String email);

    List<Employee> findByEmploymentStatusIgnoreCase(
            String employmentStatus
    );

    List<Employee> findBySupervisorEmployeeId(Integer supervisorId);
}