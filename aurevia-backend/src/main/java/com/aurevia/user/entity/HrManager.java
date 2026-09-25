package com.aurevia.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "hr_manager")
public class HrManager {

    @Id
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "employee_id",
            referencedColumnName = "employee_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_hr_manager_employee")
    )
    private Employee employee;

    @Column(name = "hr_level", nullable = false, length = 50)
    private String hrLevel;

    protected HrManager() {
    }

    public HrManager(Employee employee, String hrLevel) {
        this.employee = employee;
        this.hrLevel = hrLevel;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getHrLevel() {
        return hrLevel;
    }

    public void setHrLevel(String hrLevel) {
        this.hrLevel = hrLevel;
    }
}