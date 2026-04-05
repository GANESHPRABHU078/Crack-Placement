package com.placementos.backend.controller;

import com.placementos.backend.entity.User;
import com.placementos.backend.repository.SubmissionRepository;
import com.placementos.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public SubmissionController(SubmissionRepository submissionRepository, UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/heatmap")
    public ResponseEntity<Map<String, Integer>> getHeatmapData(Authentication authentication) {
        User user = requireUser(authentication);
        
        // Fetch data for the last 365 days
        LocalDateTime startDate = LocalDateTime.now().minusDays(365).withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<Object[]> results = submissionRepository.getDailyAcceptedSubmissionCounts(user.getId(), startDate, com.placementos.backend.entity.Submission.Status.Accepted.name());
        
        Map<String, Integer> heatmap = new LinkedHashMap<>();
        for (Object[] result : results) {
            if (result == null || result.length < 2 || result[0] == null || result[1] == null) continue;
            String date = result[0].toString();
            Integer count = ((Number) result[1]).intValue();
            heatmap.put(date, count);
        }
        
        return ResponseEntity.ok(heatmap);
    }

    private User requireUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required.");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "User not found."));
    }
}
