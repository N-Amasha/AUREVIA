package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PackageItemId implements Serializable {

    @Column(name = "package_id", nullable = false)
    private Integer packageId;

    @Column(name = "menu_item_id", nullable = false)
    private Integer menuItemId;

    protected PackageItemId() {
    }

    public PackageItemId(Integer packageId, Integer menuItemId) {
        this.packageId = packageId;
        this.menuItemId = menuItemId;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public Integer getMenuItemId() {
        return menuItemId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof PackageItemId that)) {
            return false;
        }

        return Objects.equals(packageId, that.packageId)
                && Objects.equals(menuItemId, that.menuItemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(packageId, menuItemId);
    }
}