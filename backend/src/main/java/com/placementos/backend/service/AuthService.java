package com.placementos.backend.service;

import com.placementos.backend.dto.AuthResponse;
import com.placementos.backend.dto.LoginRequest;
import com.placementos.backend.dto.RegisterRequest;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementos.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class AuthService {
    private static final String DEFAULT_GOAL = "Crack top company interviews";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${app.google.client-id:}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.objectMapper = objectMapper;
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

        if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return buildResponse(user);
        }

        // Support legacy plaintext passwords that may already exist in production.
        if (req.getPassword().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            User upgradedUser = userRepository.save(user);
            return buildResponse(upgradedUser);
        }

        throw new BadCredentialsException("Invalid email or password");
    }

    public AuthResponse googleSignIn(String credential) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new IllegalStateException("Google sign-in is not configured on the server.");
        }

        JsonNode payload = fetchGoogleTokenPayload(credential);
        String audience = payload.path("aud").asText("");
        if (!googleClientId.equals(audience)) {
            throw new BadCredentialsException("Google credential audience mismatch.");
        }

        if (!payload.path("email_verified").asBoolean(false)) {
            throw new BadCredentialsException("Google account email is not verified.");
        }

        String email = payload.path("email").asText("");
        if (email.isBlank()) {
            throw new BadCredentialsException("Google account email is missing.");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> createGoogleUser(payload, email));
        return buildResponse(user);
    }

    private User createGoogleUser(JsonNode payload, String email) {
        String firstName = payload.path("given_name").asText("").trim();
        String lastName = payload.path("family_name").asText("").trim();
        String fullName = payload.path("name").asText("").trim();

        if (firstName.isBlank() && !fullName.isBlank()) {
            String[] parts = fullName.split("\\s+", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "User";
        }

        if (firstName.isBlank()) {
            firstName = "Google";
        }
        if (lastName.isBlank()) {
            lastName = "User";
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .primaryGoal(DEFAULT_GOAL)
                .build();

        return userRepository.save(user);
    }

    private JsonNode fetchGoogleTokenPayload(String credential) {
        try {
            String encodedCredential = URLEncoder.encode(credential, StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodedCredential))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new BadCredentialsException("Google credential could not be verified.");
            }

            return objectMapper.readTree(response.body());
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("Failed to verify Google sign-in.", ex);
        }
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
