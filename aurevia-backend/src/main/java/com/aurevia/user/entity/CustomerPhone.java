package com.aurevia.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customer_phone")
public class CustomerPhone {

    @EmbeddedId
    private CustomerPhoneId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Customer customer;

    public CustomerPhoneId getId() {
        return id;
    }

    public void setId(CustomerPhoneId id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getPhoneNumber() {
        return id == null ? null : id.getPhoneNumber();
    }
}