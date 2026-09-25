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
@Table(name = "restaurant_manager")
public class RestaurantManager {

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
                    name = "fk_restaurant_manager_employee"
            )
    )
    private Employee employee;

    @Column(name = "management_area", nullable = false, length = 100)
    private String managementArea;

    protected RestaurantManager() {
    }

    public RestaurantManager(Employee employee, String managementArea) {
        this.employee = employee;
        this.managementArea = managementArea;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getManagementArea() {
        return managementArea;
    }

    public void setManagementArea(String managementArea) {
        this.managementArea = managementArea;
    }
}