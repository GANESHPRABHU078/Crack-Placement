package com.placementos.backend.controller;

import com.placementos.backend.entity.DeveloperProfile;
import com.placementos.backend.service.DeveloperProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/developer")
public class DeveloperProfileController {

    private final DeveloperProfileService profileService;

    public DeveloperProfileController(DeveloperProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<DeveloperProfile> getProfile(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(profileService.getProfile(userId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/link")
    public ResponseEntity<DeveloperProfile> linkProfile(@RequestBody Map<String, String> request) {
        try {
            Long userId = Long.parseLong(request.get("userId"));
            String github = request.get("github");
            String leetcode = request.get("leetcode");
            return ResponseEntity.ok(profileService.linkAndSync(userId, github, leetcode));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<DeveloperProfile> syncProfile(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(profileService.sync(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<Map<String, Object>> getTopicAnalysis(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(profileService.getTopicAnalysis(userId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
