package com.aurevia.user.repository;

import com.aurevia.user.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void shouldReadAllExistingEmployees() {
        long employeeCount = employeeRepository.count();

        assertThat(employeeCount).isEqualTo(35);
    }

    @Test
    void shouldLoadEmployeeWithUserAccount() {
        Optional<Employee> result =
                employeeRepository.findById(1);

        assertThat(result).isPresent();

        Employee employee = result.get();

        assertThat(employee.getEmployeeId()).isEqualTo(1);
        assertThat(employee.getUserAccount().getUserId()).isEqualTo(11);
        assertThat(employee.getHireDate())
                .isEqualTo(LocalDate.of(2024, 1, 10));
        assertThat(employee.getSalary())
                .isEqualByComparingTo("180000.00");
        assertThat(employee.getEmploymentStatus()).isEqualTo("ACTIVE");
        assertThat(employee.getSupervisor()).isNull();
    }

    @Test
    void shouldLoadEmployeesAssignedToSupervisor() {
        var employees =
                employeeRepository.findBySupervisorEmployeeId(1);

        assertThat(employees).isNotEmpty();

        assertThat(employees)
                .allMatch(employee ->
                        employee.getSupervisor() != null
                                && employee.getSupervisor()
                                        .getEmployeeId()
                                        .equals(1)
                );
    }
}