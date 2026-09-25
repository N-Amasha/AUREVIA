package com.aurevia.event.repository;

import com.aurevia.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventRepository
        extends JpaRepository<Event, Integer> {

    Optional<Event> findByEventBookingEventBookingId(
            Integer eventBookingId
    );

    List<Event>
    findByCoordinatorEmployeeIdOrderByEventDateAsc(
            Integer coordinatorId
    );

    List<Event> findByEventStatusIgnoreCase(
            String eventStatus
    );

    List<Event> findByEventDateBetweenOrderByEventDateAsc(
            LocalDate startDate,
            LocalDate endDate
    );
}