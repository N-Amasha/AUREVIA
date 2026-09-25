package com.aurevia.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "employee",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_employee_user",
                        columnNames = "user_id"
                )
        },
        indexes = {
                @Index(
                        name = "fk_employee_supervisor",
                        columnList = "supervisor_id"
                )
        }
)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_employee_user")
    )
    private UserAccount userAccount;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(
            name = "salary",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal salary;

    @Column(
            name = "employment_status",
            nullable = false,
            length = 30
    )
    private String employmentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "supervisor_id",
            referencedColumnName = "employee_id",
            foreignKey = @ForeignKey(name = "fk_employee_supervisor")
    )
    private Employee supervisor;

    protected Employee() {
        // Required by JPA
    }

    public Employee(
            UserAccount userAccount,
            LocalDate hireDate,
            BigDecimal salary,
            String employmentStatus,
            Employee supervisor
    ) {
        this.userAccount = userAccount;
        this.hireDate = hireDate;
        this.salary = salary;
        this.employmentStatus = employmentStatus;
        this.supervisor = supervisor;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public Employee getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Employee supervisor) {
        this.supervisor = supervisor;
    }
}