package com.placementos.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RenderCorsFilter extends OncePerRequestFilter {

    private final Set<String> allowedOrigins;
    private final Set<String> allowedOriginPatterns;

    public RenderCorsFilter(@Value("${app.cors.allowed-origins:https://crackplacement.vercel.app,https://*.vercel.app,http://localhost:5173,http://localhost:3000}") String allowedOrigins) {
        Set<String> configuredOrigins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .collect(Collectors.toSet());
        this.allowedOrigins = configuredOrigins.stream()
                .filter(origin -> !origin.contains("*"))
                .collect(Collectors.toSet());
        this.allowedOriginPatterns = configuredOrigins.stream()
                .filter(origin -> origin.contains("*"))
                .collect(Collectors.toSet());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");

        if (origin != null && isAllowedOrigin(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin,X-Requested-With");
            response.setHeader("Access-Control-Max-Age", "3600");
        }

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowedOrigin(String origin) {
        if (allowedOrigins.contains(origin)) {
            return true;
        }

        return allowedOriginPatterns.stream().anyMatch(pattern -> matchesPattern(origin, pattern));
    }

    private boolean matchesPattern(String origin, String pattern) {
        String regex = pattern
                .replace(".", "\\.")
                .replace("*", ".*");
        return origin.matches(regex);
    }
}
