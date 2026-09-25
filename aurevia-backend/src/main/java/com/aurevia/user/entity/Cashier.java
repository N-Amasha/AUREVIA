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
@Table(name = "cashier")
public class Cashier {

    @Id
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "employee_id",
            referencedColumnName = "employee_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_cashier_employee")
    )
    private Employee employee;

    @Column(name = "counter_no", nullable = false, length = 20)
    private String counterNumber;

    protected Cashier() {
    }

    public Cashier(Employee employee, String counterNumber) {
        this.employee = employee;
        this.counterNumber = counterNumber;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getCounterNumber() {
        return counterNumber;
    }

    public void setCounterNumber(String counterNumber) {
        this.counterNumber = counterNumber;
    }
}