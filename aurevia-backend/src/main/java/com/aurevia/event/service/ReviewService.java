package com.aurevia.event.service;

import com.aurevia.event.dto.ReviewCreateRequest;
import com.aurevia.event.dto.ReviewResponse;
import com.aurevia.event.entity.Event;
import com.aurevia.event.entity.Review;
import com.aurevia.event.mapper.ReviewMapper;
import com.aurevia.event.repository.EventRepository;
import com.aurevia.event.repository.ReviewRepository;
import com.aurevia.exception.BusinessRuleException;
import com.aurevia.exception.ResourceNotFoundException;
import com.aurevia.menu.entity.CustomerOrder;
import com.aurevia.menu.repository.CustomerOrderRepository;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerRepository customerRepository;
    private final EventRepository eventRepository;
    private final CustomerOrderRepository orderRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(
            ReviewRepository reviewRepository,
            CustomerRepository customerRepository,
            EventRepository eventRepository,
            CustomerOrderRepository orderRepository,
            ReviewMapper reviewMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.customerRepository = customerRepository;
        this.eventRepository = eventRepository;
        this.orderRepository = orderRepository;
        this.reviewMapper = reviewMapper;
    }

    @Transactional
    public ReviewResponse createReview(
            ReviewCreateRequest request
    ) {
        validateTarget(request);

        Customer customer = customerRepository
                .findById(request.customerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer",
                                "customerId",
                                request.customerId()
                        )
                );

        Event event = null;
        CustomerOrder order = null;

        if (request.eventId() != null) {
            event = findAndValidateEvent(request);
        } else {
            order = findAndValidateOrder(request);
        }

        Review review = new Review(
                customer,
                event,
                order,
                request.rating(),
                normalizeComment(request.comment()),
                determineSentiment(request.rating())
        );

        return reviewMapper.toResponse(
                reviewRepository.saveAndFlush(review)
        );
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository
                .findAllByOrderByReviewDateDesc()
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    public ReviewResponse getReviewById(Integer reviewId) {
        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review",
                                "reviewId",
                                reviewId
                        )
                );

        return reviewMapper.toResponse(review);
    }

    public List<ReviewResponse> getReviewsByCustomer(
            Integer customerId
    ) {
        return reviewRepository
                .findByCustomerUserIdOrderByReviewDateDesc(
                        customerId
                )
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByEvent(
            Integer eventId
    ) {
        return reviewRepository
                .findByEventEventIdOrderByReviewDateDesc(eventId)
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByOrder(
            Integer orderId
    ) {
        return reviewRepository
                .findByCustomerOrderOrderIdOrderByReviewDateDesc(
                        orderId
                )
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsBySentiment(
            String sentiment
    ) {
        if (sentiment == null || sentiment.isBlank()) {
            throw new IllegalArgumentException(
                    "Sentiment is required."
            );
        }

        return reviewRepository
                .findBySentimentIgnoreCase(sentiment.trim())
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    private Event findAndValidateEvent(
            ReviewCreateRequest request
    ) {
        Event event = eventRepository
                .findById(request.eventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event",
                                "eventId",
                                request.eventId()
                        )
                );

        Integer ownerId = event.getEventBooking()
                .getCustomer()
                .getUserId();

        if (!ownerId.equals(request.customerId())) {
            throw new BusinessRuleException(
                    "The customer does not own this event."
            );
        }

        if (!"COMPLETED".equalsIgnoreCase(
                event.getEventStatus()
        )) {
            throw new BusinessRuleException(
                    "Only completed events can be reviewed."
            );
        }

        if (reviewRepository
                .findByCustomerUserIdAndEventEventId(
                        request.customerId(),
                        request.eventId()
                )
                .isPresent()) {
            throw new BusinessRuleException(
                    "The customer has already reviewed this event."
            );
        }

        return event;
    }

    private CustomerOrder findAndValidateOrder(
            ReviewCreateRequest request
    ) {
        CustomerOrder order = orderRepository
                .findById(request.orderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer order",
                                "orderId",
                                request.orderId()
                        )
                );

        if (!order.getCustomer().getUserId()
                .equals(request.customerId())) {
            throw new BusinessRuleException(
                    "The customer does not own this order."
            );
        }

        if (!"COMPLETED".equalsIgnoreCase(
                order.getOrderStatus()
        )) {
            throw new BusinessRuleException(
                    "Only completed orders can be reviewed."
            );
        }

        if (reviewRepository
                .findByCustomerUserIdAndCustomerOrderOrderId(
                        request.customerId(),
                        request.orderId()
                )
                .isPresent()) {
            throw new BusinessRuleException(
                    "The customer has already reviewed this order."
            );
        }

        return order;
    }

    private void validateTarget(ReviewCreateRequest request) {
        boolean hasEvent = request.eventId() != null;
        boolean hasOrder = request.orderId() != null;

        if (hasEvent == hasOrder) {
            throw new BusinessRuleException(
                    "Exactly one review target must be supplied: event or order."
            );
        }
    }

    private String determineSentiment(Integer rating) {
        if (rating >= 4) {
            return "POSITIVE";
        }

        if (rating <= 2) {
            return "NEGATIVE";
        }

        return "NEUTRAL";
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.isBlank()) {
            return null;
        }

        return comment.trim();
    }
}