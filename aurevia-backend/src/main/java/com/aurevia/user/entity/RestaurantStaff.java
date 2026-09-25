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
@Table(name = "restaurant_staff")
public class RestaurantStaff {

    @Id
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "employee_id",
            referencedColumnName = "employee_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_restaurant_staff_employee"
            )
    )
    private Employee employee;

    @Column(name = "staff_type", nullable = false, length = 50)
    private String staffType;

    protected RestaurantStaff() {
    }

    public RestaurantStaff(Employee employee, String staffType) {
        this.employee = employee;
        this.staffType = staffType;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getStaffType() {
        return staffType;
    }

    public void setStaffType(String staffType) {
        this.staffType = staffType;
    }
}