package com.aurevia.user.repository;

import com.aurevia.user.entity.Chef;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChefRepository extends JpaRepository<Chef, Integer> {

    Optional<Chef> findByEmployeeUserAccountEmailIgnoreCase(
            String email
    );

    List<Chef> findBySpecializationContainingIgnoreCase(
            String specialization
    );
}