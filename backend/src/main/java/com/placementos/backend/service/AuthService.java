package com.placementos.backend.service;

import com.placementos.backend.dto.AuthResponse;
import com.placementos.backend.dto.LoginRequest;
import com.placementos.backend.dto.RegisterRequest;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.UserRepository;
import com.placementos.backend.security.JwtUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

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

        User savedUser = userRepository.save(user);
        return buildResponse(savedUser);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getXp(),
                user.getLevel(),
                user.getLeague(),
                user.getCurrentStreak(),
                user.getProblemsSolved(),
                user.getGlobalRank()
        );
    }
}
