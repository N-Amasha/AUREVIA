package com.aurevia.event.controller;

import com.aurevia.event.dto.ReviewCreateRequest;
import com.aurevia.event.dto.ReviewResponse;
import com.aurevia.event.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reviewService.createReview(request));
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(
                reviewService.getAllReviews()
        );
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(
            @PathVariable Integer reviewId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewById(reviewId)
        );
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsByCustomer(
            @PathVariable Integer customerId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByCustomer(customerId)
        );
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsByEvent(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByEvent(eventId)
        );
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsByOrder(
            @PathVariable Integer orderId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByOrder(orderId)
        );
    }

    @GetMapping("/sentiments/{sentiment}")
    public ResponseEntity<List<ReviewResponse>>
    getReviewsBySentiment(
            @PathVariable String sentiment
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsBySentiment(sentiment)
        );
    }
}