package com.aurevia.user.repository;

import com.aurevia.user.entity.HrManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HrManagerRepository
        extends JpaRepository<HrManager, Integer> {

    Optional<HrManager> findByEmployeeUserAccountEmailIgnoreCase(
            String email
    );

    List<HrManager> findByHrLevelIgnoreCase(String hrLevel);
}