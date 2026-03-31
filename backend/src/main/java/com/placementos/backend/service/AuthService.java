package com.placementos.backend.service;

import com.placementos.backend.dto.*;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.UserRepository;
import com.placementos.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered.");

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .college(req.getCollege())
                .branch(req.getBranch())
                .gradYear(req.getGradYear())
                .primaryGoal(req.getPrimaryGoal())
                .build();

        user = userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());
        return toResponse(token, user);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtils.generateToken(user.getEmail());
        return toResponse(token, user);
    }

    private AuthResponse toResponse(String token, User user) {
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(),
                user.getXp(), user.getLevel(), user.getLeague(), user.getCurrentStreak(),
                user.getProblemsSolved(), user.getGlobalRank());
    }
}
