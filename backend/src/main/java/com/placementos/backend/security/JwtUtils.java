package com.placementos.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    private Key key() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "JWT is not configured on the server. Set JWT_SECRET in backend environment variables."
            );
        }
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "JWT_SECRET must be at least 32 bytes long."
            );
        }
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
