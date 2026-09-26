package com.aurevia.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CustomerPhoneId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    public CustomerPhoneId() {
    }

    public CustomerPhoneId(
            Integer userId,
            String phoneNumber
    ) {
        this.userId = userId;
        this.phoneNumber = phoneNumber;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof CustomerPhoneId that)) {
            return false;
        }

        return Objects.equals(userId, that.userId)
                && Objects.equals(phoneNumber, that.phoneNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, phoneNumber);
    }
}