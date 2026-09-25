package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "package_item")
public class PackageItem {

    @EmbeddedId
    private PackageItemId id;

    @MapsId("packageId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "package_id",
            referencedColumnName = "package_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_package_item_package"
            )
    )
    private CateringPackage cateringPackage;

    @MapsId("menuItemId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "menu_item_id",
            referencedColumnName = "menu_item_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_package_item_menu_item"
            )
    )
    private MenuItem menuItem;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    protected PackageItem() {
    }

    public PackageItem(
            CateringPackage cateringPackage,
            MenuItem menuItem,
            Integer quantity
    ) {
        this.cateringPackage = cateringPackage;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.id = new PackageItemId(
                cateringPackage.getPackageId(),
                menuItem.getMenuItemId()
        );
    }

    public PackageItemId getId() {
        return id;
    }

    public CateringPackage getCateringPackage() {
        return cateringPackage;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}