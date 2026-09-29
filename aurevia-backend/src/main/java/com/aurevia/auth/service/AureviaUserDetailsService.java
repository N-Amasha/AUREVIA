package com.aurevia.auth.service;

import com.aurevia.security.AureviaUserPrincipal;
import com.aurevia.user.entity.UserAccount;
import com.aurevia.user.repository.UserAccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AureviaUserDetailsService
        implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;
    private final UserRoleService userRoleService;

    public AureviaUserDetailsService(
            UserAccountRepository userAccountRepository,
            UserRoleService userRoleService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.userRoleService = userRoleService;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        if (email == null || email.isBlank()) {
            throw new UsernameNotFoundException(
                    "Email is required."
            );
        }

        UserAccount userAccount = userAccountRepository
                .findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User account not found."
                        )
                );

        String role = userRoleService.resolveRole(userAccount);

        return new AureviaUserPrincipal(
                userAccount,
                role
        );
    }
}