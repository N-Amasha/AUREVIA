package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "menu",
        uniqueConstraints = @UniqueConstraint(
                name = "menu_name",
                columnNames = "menu_name"
        )
)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id", nullable = false)
    private Integer menuId;

    @Column(name = "menu_name", nullable = false, length = 100)
    private String menuName;

    @Column(name = "menu_type", nullable = false, length = 50)
    private String menuType;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    protected Menu() {
    }

    public Menu(
            String menuName,
            String menuType,
            String status,
            String description
    ) {
        this.menuName = menuName;
        this.menuType = menuType;
        this.status = status;
        this.description = description;
    }

    public Integer getMenuId() {
        return menuId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getMenuType() {
        return menuType;
    }

    public void setMenuType(String menuType) {
        this.menuType = menuType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}