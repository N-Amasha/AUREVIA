package com.aurevia.event.repository;

import com.aurevia.event.entity.EventService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface EventServiceRepository
        extends JpaRepository<EventService, Integer> {

    List<EventService>
    findByEventEventIdOrderByServiceDateAscStartTimeAsc(
            Integer eventId
    );

    List<EventService> findByVendorVendorId(
            Integer vendorId
    );

    List<EventService> findByServiceStatusIgnoreCase(
            String serviceStatus
    );

    @Query("""
            SELECT COALESCE(SUM(es.cost), 0)
            FROM EventService es
            WHERE es.event.eventId = :eventId
            """)
    BigDecimal calculateEventServiceCost(
            @Param("eventId") Integer eventId
    );
}