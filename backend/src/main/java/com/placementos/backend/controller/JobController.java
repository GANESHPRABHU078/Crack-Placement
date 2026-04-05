import com.placementos.backend.entity.User;
import com.placementos.backend.repository.JobRepository;
import com.placementos.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobController(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(Authentication authentication) {
        User user = requireUser(authentication);
        Set<String> userSkills = user.getSkills().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<Job> allJobs = jobRepository.findAll();
        List<Map<String, Object>> recommendedJobs = new ArrayList<>();

        for (Job job : allJobs) {
            List<String> jobSkills = job.getSkills();
            if (jobSkills == null || jobSkills.isEmpty()) continue;

            List<String> matchingSkills = jobSkills.stream()
                    .filter(s -> userSkills.contains(s.toLowerCase()))
                    .collect(Collectors.toList());

            int matchPercent = (int) (((double) matchingSkills.size() / jobSkills.size()) * 100);
            
            // Boost score if title matches primary goal
            if (user.getPrimaryGoal() != null && job.getTitle().toLowerCase().contains(user.getPrimaryGoal().toLowerCase())) {
                matchPercent = Math.min(100, matchPercent + 15);
            }

            Map<String, Object> recommendation = new HashMap<>();
            recommendation.put("job", job);
            recommendation.put("matchPercent", matchPercent);
            recommendation.put("matchingSkills", matchingSkills);
            recommendation.put("missingSkills", jobSkills.stream()
                    .filter(s -> !userSkills.contains(s.toLowerCase()))
                    .collect(Collectors.toList()));

            recommendedJobs.add(recommendation);
        }

        // Sort by match percent descending
        recommendedJobs.sort((a, b) -> (Integer) b.get("matchPercent") - (Integer) a.get("matchPercent"));

        return ResponseEntity.ok(recommendedJobs);
    }

    private User requireUser(Authentication authentication) {
        if (authentication == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAll(@RequestParam(required = false) String type) {
        if (type != null) {
            return ResponseEntity.ok(jobRepository.findByType(Job.JobType.valueOf(type)));
        }
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/new")
    public ResponseEntity<List<Job>> getNew() {
        return ResponseEntity.ok(jobRepository.findByIsNewTrue());
    }

    @PostMapping
    public ResponseEntity<Job> create(@RequestBody Job job) {
        return ResponseEntity.ok(jobRepository.save(job));
    }

    @java.lang.SuppressWarnings("all")
    @lombok.Generated
    public JobController(final JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }
}
