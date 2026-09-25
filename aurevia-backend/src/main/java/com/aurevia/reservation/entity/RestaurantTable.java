package com.aurevia.reservation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "restaurant_table",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_restaurant_table_number",
                columnNames = "table_number"
        )
)
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id", nullable = false)
    private Integer tableId;

    @Column(name = "table_number", nullable = false, length = 20)
    private String tableNumber;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "location", nullable = false, length = 100)
    private String location;

    @Column(name = "table_status", nullable = false, length = 30)
    private String tableStatus;

    protected RestaurantTable() {
    }

    public RestaurantTable(
            String tableNumber,
            Integer capacity,
            String location,
            String tableStatus
    ) {
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.location = location;
        this.tableStatus = tableStatus;
    }

    public Integer getTableId() {
        return tableId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTableStatus() {
        return tableStatus;
    }

    public void setTableStatus(String tableStatus) {
        this.tableStatus = tableStatus;
    }
}