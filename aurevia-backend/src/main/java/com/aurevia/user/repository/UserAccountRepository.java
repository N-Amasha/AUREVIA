package com.aurevia.user.repository;

import com.aurevia.user.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository
        extends JpaRepository<UserAccount, Integer> {

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}