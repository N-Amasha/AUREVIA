package com.aurevia.menu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderItemId implements Serializable {

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "menu_item_id", nullable = false)
    private Integer menuItemId;

    protected OrderItemId() {
    }

    public OrderItemId(Integer orderId, Integer menuItemId) {
        this.orderId = orderId;
        this.menuItemId = menuItemId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public Integer getMenuItemId() {
        return menuItemId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof OrderItemId that)) {
            return false;
        }

        return Objects.equals(orderId, that.orderId)
                && Objects.equals(menuItemId, that.menuItemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, menuItemId);
    }
}