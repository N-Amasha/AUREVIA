package com.aurevia.inventory.entity;

import com.aurevia.user.entity.InventoryManager;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_record")
public class WasteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "waste_id")
    private Integer wasteId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recorded_by_manager_id", nullable = false)
    private InventoryManager recordedByManager;

    @Column(name = "waste_date", nullable = false)
    private LocalDateTime wasteDate;

    @Column(name = "waste_reason", nullable = false, length = 255)
    private String wasteReason;

    @Column(
            name = "quantity",
            nullable = false,
            precision = 12,
            scale = 3
    )
    private BigDecimal quantity;

    @Column(
            name = "estimated_cost",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal estimatedCost;

    public Integer getWasteId() {
        return wasteId;
    }

    public void setWasteId(Integer wasteId) {
        this.wasteId = wasteId;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
    }

    public InventoryManager getRecordedByManager() {
        return recordedByManager;
    }

    public void setRecordedByManager(
            InventoryManager recordedByManager
    ) {
        this.recordedByManager = recordedByManager;
    }

    public LocalDateTime getWasteDate() {
        return wasteDate;
    }

    public void setWasteDate(LocalDateTime wasteDate) {
        this.wasteDate = wasteDate;
    }

    public String getWasteReason() {
        return wasteReason;
    }

    public void setWasteReason(String wasteReason) {
        this.wasteReason = wasteReason;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }
}