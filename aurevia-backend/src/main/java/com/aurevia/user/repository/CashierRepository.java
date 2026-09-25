package com.aurevia.user.repository;

import com.aurevia.user.entity.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CashierRepository
        extends JpaRepository<Cashier, Integer> {

    Optional<Cashier> findByEmployeeUserAccountEmailIgnoreCase(
            String email
    );

    Optional<Cashier> findByCounterNumberIgnoreCase(
            String counterNumber
    );
}