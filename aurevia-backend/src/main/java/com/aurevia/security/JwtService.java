package com.aurevia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMilliseconds;

    public JwtService(
            @Value("${app.jwt.secret}") String encodedSecret,
            @Value("${app.jwt.expiration-ms}") long expirationMilliseconds
    ) {
        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(encodedSecret)
        );
        this.expirationMilliseconds = expirationMilliseconds;
    }

    public String generateToken(
            AureviaUserPrincipal principal
    ) {
        Date issuedAt = new Date();
        Date expiresAt = new Date(
                issuedAt.getTime() + expirationMilliseconds
        );

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("userId", principal.getUserId())
                .claim("role", principal.getRole())
                .claim("firstName", principal.getFirstName())
                .claim("lastName", principal.getLastName())
                .issuedAt(issuedAt)
                .expiration(expiresAt)
                .signWith(signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject().equalsIgnoreCase(
                    userDetails.getUsername()
            );
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    public long getExpirationMilliseconds() {
        return expirationMilliseconds;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}