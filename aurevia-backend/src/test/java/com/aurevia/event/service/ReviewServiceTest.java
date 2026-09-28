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
import com.aurevia.reservation.entity.EventBooking;
import com.aurevia.user.entity.Customer;
import com.aurevia.user.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CustomerOrderRepository orderRepository;

    @Mock
    private ReviewMapper reviewMapper;

    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        reviewService = new ReviewService(
                reviewRepository,
                customerRepository,
                eventRepository,
                orderRepository,
                reviewMapper
        );
    }

    @Test
    void shouldCreateEventReview() {
        Customer customer = mock(Customer.class);
        Event event = mock(Event.class);
        EventBooking booking = mock(EventBooking.class);
        Review savedReview = mock(Review.class);
        ReviewResponse response = eventResponse();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));
        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(event.getEventBooking()).thenReturn(booking);
        when(booking.getCustomer()).thenReturn(customer);
        when(customer.getUserId()).thenReturn(1);
        when(event.getEventStatus()).thenReturn("COMPLETED");
        when(reviewRepository
                .findByCustomerUserIdAndEventEventId(1, 1))
                .thenReturn(Optional.empty());
        when(reviewRepository.saveAndFlush(any(Review.class)))
                .thenReturn(savedReview);
        when(reviewMapper.toResponse(savedReview))
                .thenReturn(response);

        assertEquals(
                response,
                reviewService.createReview(eventRequest())
        );
    }

    @Test
    void shouldCreateOrderReview() {
        Customer customer = mock(Customer.class);
        CustomerOrder order = mock(CustomerOrder.class);
        Review savedReview = mock(Review.class);
        ReviewResponse response = orderResponse();

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));
        when(order.getCustomer()).thenReturn(customer);
        when(customer.getUserId()).thenReturn(1);
        when(order.getOrderStatus()).thenReturn("COMPLETED");
        when(reviewRepository
                .findByCustomerUserIdAndCustomerOrderOrderId(
                        1,
                        1
                ))
                .thenReturn(Optional.empty());
        when(reviewRepository.saveAndFlush(any(Review.class)))
                .thenReturn(savedReview);
        when(reviewMapper.toResponse(savedReview))
                .thenReturn(response);

        assertEquals(
                response,
                reviewService.createReview(orderRequest())
        );
    }

    @Test
    void shouldRejectRequestWithoutTarget() {
        ReviewCreateRequest request =
                new ReviewCreateRequest(
                        1,
                        null,
                        null,
                        5,
                        "Excellent."
                );

        assertThrows(
                BusinessRuleException.class,
                () -> reviewService.createReview(request)
        );
    }

    @Test
    void shouldRejectRequestWithBothTargets() {
        ReviewCreateRequest request =
                new ReviewCreateRequest(
                        1,
                        1,
                        1,
                        5,
                        "Excellent."
                );

        assertThrows(
                BusinessRuleException.class,
                () -> reviewService.createReview(request)
        );
    }

    @Test
    void shouldRejectMissingCustomer() {
        when(customerRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> reviewService.createReview(eventRequest())
        );
    }

    @Test
    void shouldRejectDuplicateEventReview() {
        Customer customer = mock(Customer.class);
        Event event = mock(Event.class);
        EventBooking booking = mock(EventBooking.class);

        when(customerRepository.findById(1))
                .thenReturn(Optional.of(customer));
        when(eventRepository.findById(1))
                .thenReturn(Optional.of(event));
        when(event.getEventBooking()).thenReturn(booking);
        when(booking.getCustomer()).thenReturn(customer);
        when(customer.getUserId()).thenReturn(1);
        when(event.getEventStatus()).thenReturn("COMPLETED");
        when(reviewRepository
                .findByCustomerUserIdAndEventEventId(1, 1))
                .thenReturn(Optional.of(mock(Review.class)));

        assertThrows(
                BusinessRuleException.class,
                () -> reviewService.createReview(eventRequest())
        );
    }

    @Test
    void shouldReturnReviewById() {
        Review review = mock(Review.class);
        ReviewResponse response = eventResponse();

        when(reviewRepository.findById(1))
                .thenReturn(Optional.of(review));
        when(reviewMapper.toResponse(review))
                .thenReturn(response);

        assertEquals(response, reviewService.getReviewById(1));
    }

    @Test
    void shouldReturnReviewsBySentiment() {
        Review review = mock(Review.class);
        ReviewResponse response = eventResponse();

        when(reviewRepository
                .findBySentimentIgnoreCase("POSITIVE"))
                .thenReturn(List.of(review));
        when(reviewMapper.toResponse(review))
                .thenReturn(response);

        assertEquals(
                List.of(response),
                reviewService.getReviewsBySentiment(
                        " POSITIVE "
                )
        );
    }

    private ReviewCreateRequest eventRequest() {
        return new ReviewCreateRequest(
                1,
                1,
                null,
                5,
                "Excellent event coordination."
        );
    }

    private ReviewCreateRequest orderRequest() {
        return new ReviewCreateRequest(
                1,
                null,
                1,
                4,
                "Delicious meal."
        );
    }

    private ReviewResponse eventResponse() {
        return new ReviewResponse(
                1,
                1,
                "Amaya Perera",
                1,
                "Perera Wedding Reception",
                null,
                LocalDateTime.of(2026, 11, 11, 10, 0),
                5,
                "Excellent event coordination.",
                "POSITIVE"
        );
    }

    private ReviewResponse orderResponse() {
        return new ReviewResponse(
                6,
                1,
                "Amaya Perera",
                null,
                null,
                1,
                LocalDateTime.of(2026, 9, 28, 9, 0),
                4,
                "Delicious meal.",
                "POSITIVE"
        );
    }
}