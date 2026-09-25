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
@Table(name = "event_coordinator")
public class EventCoordinator {

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
                    name = "fk_event_coordinator_employee"
            )
    )
    private Employee employee;

    @Column(name = "coordination_level", nullable = false, length = 50)
    private String coordinationLevel;

    protected EventCoordinator() {
    }

    public EventCoordinator(
            Employee employee,
            String coordinationLevel
    ) {
        this.employee = employee;
        this.coordinationLevel = coordinationLevel;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getCoordinationLevel() {
        return coordinationLevel;
    }

    public void setCoordinationLevel(String coordinationLevel) {
        this.coordinationLevel = coordinationLevel;
    }
}