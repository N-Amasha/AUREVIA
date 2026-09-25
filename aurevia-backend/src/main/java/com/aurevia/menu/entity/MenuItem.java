package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_item_id", nullable = false)
    private Integer menuItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "menu_id",
            referencedColumnName = "menu_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_menu_item_menu")
    )
    private Menu menu;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(
            name = "price",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal price;

    @Column(
            name = "availability_status",
            nullable = false,
            length = 30
    )
    private String availabilityStatus;

    protected MenuItem() {
    }

    public MenuItem(
            Menu menu,
            String itemName,
            String category,
            String description,
            BigDecimal price,
            String availabilityStatus
    ) {
        this.menu = menu;
        this.itemName = itemName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.availabilityStatus = availabilityStatus;
    }

    public Integer getMenuItemId() {
        return menuItemId;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}