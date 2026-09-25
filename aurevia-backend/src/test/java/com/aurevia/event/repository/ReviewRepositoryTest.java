package com.aurevia.event.repository;

import com.aurevia.event.entity.Review;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@ActiveProfiles("test")
class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    void shouldReadAllReviews() {
        assertThat(reviewRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldReadEventReview() {
        Optional<Review> result = reviewRepository.findById(1);

        assertThat(result).isPresent();

        Review review = result.orElseThrow();

        assertThat(review.getCustomer().getUserId()).isEqualTo(1);
        assertThat(review.getEvent()).isNotNull();
        assertThat(review.getEvent().getEventId()).isEqualTo(1);
        assertThat(review.getCustomerOrder()).isNull();
        assertThat(review.getReviewDate())
                .isEqualTo(LocalDateTime.of(
                        2026,
                        11,
                        11,
                        10,
                        0
                ));
        assertThat(review.getRating()).isEqualTo(5);
        assertThat(review.getSentiment()).isEqualTo("POSITIVE");
    }

    @Test
    void shouldReadOrderReview() {
        Optional<Review> result = reviewRepository.findById(4);

        assertThat(result).isPresent();

        Review review = result.orElseThrow();

        assertThat(review.getCustomer().getUserId()).isEqualTo(1);
        assertThat(review.getEvent()).isNull();
        assertThat(review.getCustomerOrder()).isNotNull();
        assertThat(review.getCustomerOrder().getOrderId())
                .isEqualTo(1);
        assertThat(review.getRating()).isEqualTo(4);
    }

    @Test
    void shouldFindReviewsForEvent() {
        List<Review> reviews =
                reviewRepository
                        .findByEventEventIdOrderByReviewDateDesc(2);

        assertThat(reviews).hasSize(1);
        assertThat(reviews.getFirst().getReviewId()).isEqualTo(2);
    }

    @Test
    void shouldFindReviewsBySentiment() {
        List<Review> reviews =
                reviewRepository
                        .findBySentimentIgnoreCase("positive");

        assertThat(reviews)
                .extracting(Review::getReviewId)
                .containsExactlyInAnyOrder(1, 2, 3, 4);
    }
}