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
@Table(name = "inventory_manager")
public class InventoryManager {

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
                    name = "fk_inventory_manager_employee"
            )
    )
    private Employee employee;

    @Column(name = "warehouse_area", nullable = false, length = 100)
    private String warehouseArea;

    protected InventoryManager() {
    }

    public InventoryManager(
            Employee employee,
            String warehouseArea
    ) {
        this.employee = employee;
        this.warehouseArea = warehouseArea;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getWarehouseArea() {
        return warehouseArea;
    }

    public void setWarehouseArea(String warehouseArea) {
        this.warehouseArea = warehouseArea;
    }
}