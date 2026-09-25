package com.aurevia.user.repository;

import com.aurevia.user.entity.EventCoordinator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventCoordinatorRepository
        extends JpaRepository<EventCoordinator, Integer> {

    Optional<EventCoordinator> findByEmployeeUserAccountEmailIgnoreCase(
            String email
    );

    List<EventCoordinator> findByCoordinationLevelIgnoreCase(
            String coordinationLevel
    );
}