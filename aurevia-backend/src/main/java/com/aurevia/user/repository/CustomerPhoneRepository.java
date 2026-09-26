package com.aurevia.user.repository;

import com.aurevia.user.entity.CustomerPhone;
import com.aurevia.user.entity.CustomerPhoneId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerPhoneRepository
        extends JpaRepository<CustomerPhone, CustomerPhoneId> {

    List<CustomerPhone> findByCustomerUserIdOrderByIdPhoneNumberAsc(
            Integer userId
    );

    Optional<CustomerPhone> findByIdPhoneNumber(String phoneNumber);

    boolean existsByIdPhoneNumber(String phoneNumber);
}