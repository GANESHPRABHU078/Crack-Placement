package com.placementos.backend.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<SecurityHeaderFilter> securityHeaderFilter() {
        FilterRegistrationBean<SecurityHeaderFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new SecurityHeaderFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }

    public static class SecurityHeaderFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                       FilterChain filterChain) throws ServletException, IOException {
            try {
                // Allow Google OAuth popups to work
                response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                
                // Additional security headers
                response.setHeader("X-Content-Type-Options", "nosniff");
                response.setHeader("X-Frame-Options", "SAMEORIGIN");
            } catch (Exception e) {
                // Log but don't fail if header setting fails
                e.printStackTrace();
            }
            
            filterChain.doFilter(request, response);
        }
    }
}
