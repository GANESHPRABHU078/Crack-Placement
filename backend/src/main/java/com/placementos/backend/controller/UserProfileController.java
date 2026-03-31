package com.placementos.backend.controller;

import com.placementos.backend.entity.User;
import com.placementos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getProfile(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody User profile, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        user.setFirstName(profile.getFirstName());
        user.setLastName(profile.getLastName());
        user.setCollege(profile.getCollege());
        user.setBranch(profile.getBranch());
        user.setGradYear(profile.getGradYear());
        user.setPrimaryGoal(profile.getPrimaryGoal());
        return ResponseEntity.ok(userRepository.save(user));
    }
}
