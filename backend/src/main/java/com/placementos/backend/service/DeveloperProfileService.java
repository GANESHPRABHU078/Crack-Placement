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
import java.util.*;

@Service
public class DeveloperProfileService {

    private final DeveloperProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    // Thresholds for topic mastery (topic -> expected solved count)
    private static final Map<String, Integer> TOPIC_THRESHOLDS = new LinkedHashMap<>();
    static {
        TOPIC_THRESHOLDS.put("Array", 20);
        TOPIC_THRESHOLDS.put("String", 15);
        TOPIC_THRESHOLDS.put("Hash Table", 12);
        TOPIC_THRESHOLDS.put("Dynamic Programming", 10);
        TOPIC_THRESHOLDS.put("Math", 10);
        TOPIC_THRESHOLDS.put("Tree", 10);
        TOPIC_THRESHOLDS.put("Depth-First Search", 8);
        TOPIC_THRESHOLDS.put("Breadth-First Search", 8);
        TOPIC_THRESHOLDS.put("Graph", 8);
        TOPIC_THRESHOLDS.put("Binary Search", 8);
        TOPIC_THRESHOLDS.put("Sorting", 8);
        TOPIC_THRESHOLDS.put("Greedy", 8);
        TOPIC_THRESHOLDS.put("Two Pointers", 8);
        TOPIC_THRESHOLDS.put("Sliding Window", 6);
        TOPIC_THRESHOLDS.put("Stack", 6);
        TOPIC_THRESHOLDS.put("Recursion", 6);
        TOPIC_THRESHOLDS.put("Backtracking", 5);
        TOPIC_THRESHOLDS.put("Linked List", 5);
        TOPIC_THRESHOLDS.put("Heap (Priority Queue)", 5);
        TOPIC_THRESHOLDS.put("Bit Manipulation", 5);
    }

    public DeveloperProfileService(DeveloperProfileRepository profileRepository,
                                   UserRepository userRepository,
                                   ObjectMapper objectMapper) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    // ── Link & Sync ──────────────────────────────────────────────────────────

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
        syncLeetCodeTopics(profile, leetcodeUser);

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
        if (user.getLeetcodeUsername() != null) {
            syncLeetCode(profile, user.getLeetcodeUsername());
            syncLeetCodeTopics(profile, user.getLeetcodeUsername());
        }

        profile.setDeveloperScore(calculateScore(profile));
        profile.setDeveloperLevel(determineLevel(profile.getDeveloperScore()));
        profile.setLastSyncedAt(LocalDateTime.now());

        return profileRepository.save(profile);
    }

    // ── Get Profile ──────────────────────────────────────────────────────────

    public DeveloperProfile getProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not linked"));
    }

    // ── Topic Analysis ───────────────────────────────────────────────────────

    public Map<String, Object> getTopicAnalysis(Long userId) throws Exception {
        DeveloperProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not linked"));

        // Parse stored topic stats
        Map<String, Integer> topicCounts = new LinkedHashMap<>();
        if (profile.getLeetcodeTopicStats() != null && !profile.getLeetcodeTopicStats().isBlank()) {
            JsonNode node = objectMapper.readTree(profile.getLeetcodeTopicStats());
            node.fields().forEachRemaining(e -> topicCounts.put(e.getKey(), e.getValue().asInt()));
        }

        List<Map<String, Object>> topics = new ArrayList<>();
        List<String> weakTopics = new ArrayList<>();
        List<String> strongTopics = new ArrayList<>();
        List<String> mediumTopics = new ArrayList<>();
        List<String> insights = new ArrayList<>();
        List<Map<String, String>> recommendations = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : TOPIC_THRESHOLDS.entrySet()) {
            String topic = entry.getKey();
            int expected = entry.getValue();
            int solved = topicCounts.getOrDefault(topic, 0);

            String strength;
            if (solved >= expected) {
                strength = "Strong";
                strongTopics.add(topic);
            } else if (solved >= expected / 2) {
                strength = "Medium";
                mediumTopics.add(topic);
            } else {
                strength = "Weak";
                weakTopics.add(topic);
            }

            Map<String, Object> t = new LinkedHashMap<>();
            t.put("topic", topic);
            t.put("solved", solved);
            t.put("expected", expected);
            t.put("strength", strength);
            t.put("percentage", Math.min(100, expected > 0 ? (int) ((solved * 100.0) / expected) : 0));
            topics.add(t);
        }

        // Generate insights
        if (!strongTopics.isEmpty()) {
            insights.add("You are strong in: " + String.join(", ", strongTopics.subList(0, Math.min(3, strongTopics.size()))));
        }
        for (String weak : weakTopics.subList(0, Math.min(3, weakTopics.size()))) {
            insights.add("You need improvement in: " + weak);
        }

        // Difficulty insight
        int total = profile.getLeetcodeTotalSolved();
        int easy = profile.getLeetcodeEasySolved();
        int medium = profile.getLeetcodeMediumSolved();
        int hard = profile.getLeetcodeHardSolved();
        if (total > 0) {
            double easyPct = (easy * 100.0) / total;
            if (easyPct > 70) {
                insights.add("You are mostly solving Easy problems. Try more Medium/Hard problems to level up!");
            } else if (hard > 0 && (double) hard / total > 0.2) {
                insights.add("Excellent! You are tackling Hard problems consistently.");
            } else {
                insights.add("Good progress! Try solving more Hard problems to sharpen your skills.");
            }
        }

        // Recommendations for weak topics
        Map<String, String[]> topicLinks = new HashMap<>();
        topicLinks.put("Array", new String[]{"https://leetcode.com/tag/array/", "https://www.geeksforgeeks.org/arrays/"});
        topicLinks.put("String", new String[]{"https://leetcode.com/tag/string/", "https://www.geeksforgeeks.org/string-data-structure/"});
        topicLinks.put("Hash Table", new String[]{"https://leetcode.com/tag/hash-table/", "https://www.geeksforgeeks.org/hashing-data-structure/"});
        topicLinks.put("Dynamic Programming", new String[]{"https://leetcode.com/tag/dynamic-programming/", "https://www.geeksforgeeks.org/dynamic-programming/"});
        topicLinks.put("Tree", new String[]{"https://leetcode.com/tag/tree/", "https://www.geeksforgeeks.org/binary-tree-data-structure/"});
        topicLinks.put("Graph", new String[]{"https://leetcode.com/tag/graph/", "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"});
        topicLinks.put("Binary Search", new String[]{"https://leetcode.com/tag/binary-search/", "https://www.geeksforgeeks.org/binary-search/"});
        topicLinks.put("Backtracking", new String[]{"https://leetcode.com/tag/backtracking/", "https://www.geeksforgeeks.org/backtracking-algorithms/"});
        topicLinks.put("Greedy", new String[]{"https://leetcode.com/tag/greedy/", "https://www.geeksforgeeks.org/greedy-algorithms/"});
        topicLinks.put("Two Pointers", new String[]{"https://leetcode.com/tag/two-pointers/", "https://www.geeksforgeeks.org/two-pointers-technique/"});
        topicLinks.put("Depth-First Search", new String[]{"https://leetcode.com/tag/depth-first-search/", "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/"});
        topicLinks.put("Breadth-First Search", new String[]{"https://leetcode.com/tag/breadth-first-search/", "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/"});

        int count = 0;
        for (String weak : weakTopics) {
            if (count >= 5) break;
            String[] links = topicLinks.getOrDefault(weak, new String[]{"https://leetcode.com/problemset/", "https://www.geeksforgeeks.org/"});
            Map<String, String> rec = new LinkedHashMap<>();
            rec.put("topic", weak);
            rec.put("leetcode", links[0]);
            rec.put("gfg", links[1]);
            recommendations.add(rec);
            count++;
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("topics", topics);
        result.put("weakTopics", weakTopics);
        result.put("strongTopics", strongTopics);
        result.put("mediumTopics", mediumTopics);
        result.put("insights", insights);
        result.put("recommendations", recommendations);
        result.put("difficultyBreakdown", Map.of(
                "easy", easy,
                "medium", medium,
                "hard", hard,
                "total", total
        ));
        result.put("overallStrength", weakTopics.size() < 5 ? "Strong" : weakTopics.size() < 10 ? "Medium" : "Weak");
        return result;
    }

    // ── Private Sync Methods ─────────────────────────────────────────────────

    private void syncLeetCodeTopics(DeveloperProfile profile, String username) {
        if (username == null || username.isBlank()) return;

        String query = "{\"query\": \"query userTagProblemsSolved($username: String!) { matchedUser(username: $username) { tagProblemCounts { advanced { tagName problemsSolved } intermediate { tagName problemsSolved } fundamental { tagName problemsSolved } } } }\", \"variables\": {\"username\": \"" + username + "\"}}";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://leetcode.com/graphql"))
                    .header("Content-Type", "application/json")
                    .header("Referer", "https://leetcode.com")
                    .POST(HttpRequest.BodyPublishers.ofString(query))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode tagCounts = root.path("data").path("matchedUser").path("tagProblemCounts");

                Map<String, Integer> topicMap = new LinkedHashMap<>();
                for (String category : new String[]{"fundamental", "intermediate", "advanced"}) {
                    JsonNode arr = tagCounts.path(category);
                    for (JsonNode item : arr) {
                        String name = item.path("tagName").asText();
                        int solved = item.path("problemsSolved").asInt();
                        if (solved > 0) topicMap.merge(name, solved, Integer::sum);
                    }
                }
                profile.setLeetcodeTopicStats(objectMapper.writeValueAsString(topicMap));
            }
        } catch (Exception ex) {
            // Non-critical: skip topic sync silently
            System.err.println("Topic sync skipped: " + ex.getMessage());
        }
    }

    private void syncGitHub(DeveloperProfile profile, String username) throws Exception {
        if (username == null || username.isBlank()) return;

        HttpRequest userReq = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/" + username))
                .GET().build();

        HttpResponse<String> userRes = httpClient.send(userReq, HttpResponse.BodyHandlers.ofString());
        if (userRes.statusCode() == 200) {
            JsonNode node = objectMapper.readTree(userRes.body());
            profile.setGithubRepos(node.path("public_repos").asInt());
            profile.setGithubFollowers(node.path("followers").asInt());
        }

        HttpRequest reposReq = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/" + username + "/repos?per_page=100"))
                .GET().build();

        HttpResponse<String> reposRes = httpClient.send(reposReq, HttpResponse.BodyHandlers.ofString());
        if (reposRes.statusCode() == 200) {
            JsonNode repos = objectMapper.readTree(reposRes.body());
            int stars = 0;
            Map<String, Integer> languages = new HashMap<>();
            for (JsonNode repo : repos) {
                stars += repo.path("stargazers_count").asInt();
                String lang = repo.path("language").asText();
                if (lang != null && !lang.equals("null") && !lang.isBlank()) {
                    languages.merge(lang, 1, Integer::sum);
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
                    if ("All".equals(diff))    profile.setLeetcodeTotalSolved(count);
                    else if ("Easy".equals(diff))   profile.setLeetcodeEasySolved(count);
                    else if ("Medium".equals(diff)) profile.setLeetcodeMediumSolved(count);
                    else if ("Hard".equals(diff))   profile.setLeetcodeHardSolved(count);
                }
            }
        }
    }

    // ── Score & Level ────────────────────────────────────────────────────────

    private int calculateScore(DeveloperProfile profile) {
        int score = profile.getGithubRepos() * 10
                + profile.getGithubStars() * 50
                + profile.getGithubFollowers() * 5
                + profile.getLeetcodeEasySolved() * 1
                + profile.getLeetcodeMediumSolved() * 3
                + profile.getLeetcodeHardSolved() * 7;
        if (profile.getLeetcodeRanking() > 0 && profile.getLeetcodeRanking() < 100000) score += 500;
        else if (profile.getLeetcodeRanking() > 0 && profile.getLeetcodeRanking() < 500000) score += 200;
        return Math.min(score, 1000);
    }

    private String determineLevel(int score) {
        if (score >= 800) return "Advanced";
        if (score >= 400) return "Intermediate";
        return "Beginner";
    }
}
