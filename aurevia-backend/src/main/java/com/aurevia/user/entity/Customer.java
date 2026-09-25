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
@Table(name = "customer")
public class Customer {

    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_customer_user")
    )
    private UserAccount userAccount;

    protected Customer() {
        // Required by JPA
    }

    public Customer(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public Integer getUserId() {
        return userId;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }
}