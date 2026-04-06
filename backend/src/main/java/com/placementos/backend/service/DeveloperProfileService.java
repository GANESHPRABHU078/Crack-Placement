package com.placementos.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementos.backend.entity.DeveloperProfile;
import com.placementos.backend.entity.User;
import com.placementos.backend.repository.DeveloperProfileRepository;
import com.placementos.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DeveloperProfileService {

    private final DeveloperProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public DeveloperProfileService(DeveloperProfileRepository profileRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Transactional
    public DeveloperProfile linkAndSync(Long userId, String githubUser, String leetcodeUser) throws Exception {
        User user = userRepository.findById(userId).orElseThrow();
        user.setGithubUsername(githubUser);
        user.setLeetcodeUsername(leetcodeUser);
        userRepository.save(user);

        DeveloperProfile profile = profileRepository.findByUserId(userId)
                .orElse(DeveloperProfile.builder().user(user).build());

        syncGitHub(profile, githubUser);
        syncLeetCode(profile, leetcodeUser);
        
        profile.setDeveloperScore(calculateScore(profile));
        profile.setDeveloperLevel(determineLevel(profile.getDeveloperScore()));
        profile.setLastSyncedAt(LocalDateTime.now());

        return profileRepository.save(profile);
    }

    @Transactional
    public DeveloperProfile sync(Long userId) throws Exception {
        User user = userRepository.findById(userId).orElseThrow();
        DeveloperProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not linked"));

        if (user.getGithubUsername() != null) syncGitHub(profile, user.getGithubUsername());
        if (user.getLeetcodeUsername() != null) syncLeetCode(profile, user.getLeetcodeUsername());

        profile.setDeveloperScore(calculateScore(profile));
        profile.setDeveloperLevel(determineLevel(profile.getDeveloperScore()));
        profile.setLastSyncedAt(LocalDateTime.now());

        return profileRepository.save(profile);
    }

    private void syncGitHub(DeveloperProfile profile, String username) throws Exception {
        if (username == null || username.isBlank()) return;

        // Fetch basic info
        HttpRequest userReq = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/" + username))
                .GET()
                .build();
        
        HttpResponse<String> userRes = httpClient.send(userReq, HttpResponse.BodyHandlers.ofString());
        if (userRes.statusCode() == 200) {
            JsonNode node = objectMapper.readTree(userRes.body());
            profile.setGithubRepos(node.path("public_repos").asInt());
            profile.setGithubFollowers(node.path("followers").asInt());
        }

        // Fetch repos for stars and languages
        HttpRequest reposReq = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/" + username + "/repos?per_page=100"))
                .GET()
                .build();

        HttpResponse<String> reposRes = httpClient.send(reposReq, HttpResponse.BodyHandlers.ofString());
        if (reposRes.statusCode() == 200) {
            JsonNode repos = objectMapper.readTree(reposRes.body());
            int stars = 0;
            Map<String, Integer> languages = new HashMap<>();
            
            for (JsonNode repo : repos) {
                stars += repo.path("stargazers_count").asInt();
                String lang = repo.path("language").asText();
                if (lang != null && !lang.equals("null")) {
                    languages.put(lang, languages.getOrDefault(lang, 0) + 1);
                }
            }
            profile.setGithubStars(stars);
            profile.setGithubLanguages(objectMapper.writeValueAsString(languages));
        }
    }

    private void syncLeetCode(DeveloperProfile profile, String username) throws Exception {
        if (username == null || username.isBlank()) return;

        String query = "{\"query\": \"query getUserProfile($username: String!) { matchedUser(username: $username) { submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } profile { ranking } } }\", \"variables\": {\"username\": \"" + username + "\"}}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://leetcode.com/graphql"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(query))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode userNode = root.path("data").path("matchedUser");
            
            if (!userNode.isMissingNode()) {
                profile.setLeetcodeRanking(userNode.path("profile").path("ranking").asInt());
                JsonNode stats = userNode.path("submitStats").path("acSubmissionNum");
                for (JsonNode stat : stats) {
                    String diff = stat.path("difficulty").asText();
                    int count = stat.path("count").asInt();
                    if ("All".equals(diff)) profile.setLeetcodeTotalSolved(count);
                    else if ("Easy".equals(diff)) profile.setLeetcodeEasySolved(count);
                    else if ("Medium".equals(diff)) profile.setLeetcodeMediumSolved(count);
                    else if ("Hard".equals(diff)) profile.setLeetcodeHardSolved(count);
                }
            }
        }
    }

    private int calculateScore(DeveloperProfile profile) {
        // Base points for github
        int score = profile.getGithubRepos() * 10;
        score += profile.getGithubStars() * 50;
        score += profile.getGithubFollowers() * 5;

        // Base points for leetcode
        score += profile.getLeetcodeEasySolved() * 1;
        score += profile.getLeetcodeMediumSolved() * 3;
        score += profile.getLeetcodeHardSolved() * 7;
        
        // Bonus for consistency/ranking
        if (profile.getLeetcodeRanking() > 0 && profile.getLeetcodeRanking() < 100000) score += 500;
        else if (profile.getLeetcodeRanking() > 0 && profile.getLeetcodeRanking() < 500000) score += 200;

        return Math.min(score, 1000); // Cap at 1000
    }

    private String determineLevel(int score) {
        if (score >= 800) return "Advanced";
        if (score >= 400) return "Intermediate";
        return "Beginner";
    }
}
