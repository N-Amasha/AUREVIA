package com.aurevia.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_account",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_user_account_email",
                        columnNames = "email"
                )
        }
)
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(
            name = "registration_date",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime registrationDate;

    @Column(name = "street", length = 150)
    private String street;

    @Column(name = "city", length = 80)
    private String city;

    @Column(name = "province", length = 80)
    private String province;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    protected UserAccount() {
        // Required by JPA
    }

    public UserAccount(
            String firstName,
            String lastName,
            String email,
            String street,
            String city,
            String province,
            String postalCode,
            String passwordHash
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.street = street;
        this.city = city;
        this.province = province;
        this.postalCode = postalCode;
        this.passwordHash = passwordHash;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}