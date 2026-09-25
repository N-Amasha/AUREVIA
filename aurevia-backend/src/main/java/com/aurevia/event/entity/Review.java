package com.aurevia.event.entity;

import com.aurevia.menu.entity.CustomerOrder;
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
        name = "review",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_review_customer_event",
                        columnNames = {"customer_id", "event_id"}
                ),
                @UniqueConstraint(
                        name = "uq_review_customer_order",
                        columnNames = {"customer_id", "order_id"}
                )
        }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_id",
            referencedColumnName = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_review_customer")
    )
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "event_id",
            referencedColumnName = "event_id",
            foreignKey = @ForeignKey(name = "fk_review_event")
    )
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "order_id",
            foreignKey = @ForeignKey(name = "fk_review_order")
    )
    private CustomerOrder customerOrder;

    @Column(
            name = "review_date",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime reviewDate;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "sentiment", length = 30)
    private String sentiment;

    protected Review() {
    }

    public Review(
            Customer customer,
            Event event,
            CustomerOrder customerOrder,
            Integer rating,
            String comment,
            String sentiment
    ) {
        this.customer = customer;
        this.event = event;
        this.customerOrder = customerOrder;
        this.rating = rating;
        this.comment = comment;
        this.sentiment = sentiment;
    }

    public Integer getReviewId() {
        return reviewId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }
}