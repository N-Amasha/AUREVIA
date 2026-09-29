package com.aurevia.security;

import com.aurevia.user.entity.UserAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AureviaUserPrincipal implements UserDetails {

    private final Integer userId;
    private final String email;
    private final String passwordHash;
    private final String firstName;
    private final String lastName;
    private final String role;

    public AureviaUserPrincipal(
            UserAccount userAccount,
            String role
    ) {
        this.userId = userAccount.getUserId();
        this.email = userAccount.getEmail();
        this.passwordHash = userAccount.getPasswordHash();
        this.firstName = userAccount.getFirstName();
        this.lastName = userAccount.getLastName();
        this.role = role;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}