package com.aurevia.event.mapper;

import com.aurevia.event.dto.ReviewResponse;
import com.aurevia.event.entity.Review;
import com.aurevia.user.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        UserAccount userAccount =
                review.getCustomer().getUserAccount();

        String customerName =
                userAccount.getFirstName()
                        + " "
                        + userAccount.getLastName();

        Integer eventId = review.getEvent() == null
                ? null
                : review.getEvent().getEventId();

        String eventName = review.getEvent() == null
                ? null
                : review.getEvent().getEventName();

        Integer orderId = review.getCustomerOrder() == null
                ? null
                : review.getCustomerOrder().getOrderId();

        return new ReviewResponse(
                review.getReviewId(),
                review.getCustomer().getUserId(),
                customerName,
                eventId,
                eventName,
                orderId,
                review.getReviewDate(),
                review.getRating(),
                review.getComment(),
                review.getSentiment()
        );
    }
}