package com.aurevia.menu.entity;

import com.aurevia.user.entity.Customer;
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
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "favorite_package",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_favorite_customer_package",
                columnNames = {"customer_id", "package_id"}
        )
)
public class FavoritePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id", nullable = false)
    private Integer favoriteId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_favorite_package_customer"
            )
    )
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "package_id",
            referencedColumnName = "package_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_favorite_package_package"
            )
    )
    private CateringPackage cateringPackage;

    @Column(
            name = "saved_date",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime savedDate;

    @Column(name = "notes", length = 255)
    private String notes;

    protected FavoritePackage() {
    }

    public FavoritePackage(
            Customer customer,
            CateringPackage cateringPackage,
            String notes
    ) {
        this.customer = customer;
        this.cateringPackage = cateringPackage;
        this.notes = notes;
    }

    public Integer getFavoriteId() {
        return favoriteId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public CateringPackage getCateringPackage() {
        return cateringPackage;
    }

    public void setCateringPackage(
            CateringPackage cateringPackage
    ) {
        this.cateringPackage = cateringPackage;
    }

    public LocalDateTime getSavedDate() {
        return savedDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}