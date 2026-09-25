package com.aurevia.event.repository;

import com.aurevia.event.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Integer> {

    List<Review>
    findByCustomerUserIdOrderByReviewDateDesc(Integer customerId);

    List<Review> findByEventEventIdOrderByReviewDateDesc(
            Integer eventId
    );

    List<Review>
    findByCustomerOrderOrderIdOrderByReviewDateDesc(
            Integer orderId
    );

    Optional<Review>
    findByCustomerUserIdAndEventEventId(
            Integer customerId,
            Integer eventId
    );

    Optional<Review>
    findByCustomerUserIdAndCustomerOrderOrderId(
            Integer customerId,
            Integer orderId
    );

    List<Review> findBySentimentIgnoreCase(String sentiment);
}