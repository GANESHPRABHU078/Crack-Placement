package com.placementos.backend.config;

import com.placementos.backend.entity.*;
import com.placementos.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final JobRepository jobRepository;
    private final AptitudeQuestionRepository aptitudeQuestionRepository;
    private final InterviewExperienceRepository interviewExperienceRepository;
    private final MockInterviewRepository mockInterviewRepository;
    private final PracticeTopicRepository practiceTopicRepository;
    private final PracticeProblemRepository practiceProblemRepository;
    private final CompanyPrepProfileRepository companyPrepProfileRepository;

    public DataSeeder(
            JobRepository jobRepository,
            AptitudeQuestionRepository aptitudeQuestionRepository,
            InterviewExperienceRepository interviewExperienceRepository,
            MockInterviewRepository mockInterviewRepository,
            PracticeTopicRepository practiceTopicRepository,
            PracticeProblemRepository practiceProblemRepository,
            CompanyPrepProfileRepository companyPrepProfileRepository
    ) {
        this.jobRepository = jobRepository;
        this.aptitudeQuestionRepository = aptitudeQuestionRepository;
        this.interviewExperienceRepository = interviewExperienceRepository;
        this.mockInterviewRepository = mockInterviewRepository;
        this.practiceTopicRepository = practiceTopicRepository;
        this.practiceProblemRepository = practiceProblemRepository;
        this.companyPrepProfileRepository = companyPrepProfileRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (jobRepository.count() == 0) {
            seedJobs();
            log.info("Seeded jobs.");
        }
        if (aptitudeQuestionRepository.count() == 0) {
            seedAptitudeQuestions();
            log.info("Seeded aptitude questions.");
        }
        if (interviewExperienceRepository.count() == 0) {
            seedInterviewExperiences();
            log.info("Seeded interview experiences.");
        }
        if (mockInterviewRepository.count() == 0) {
            seedMockInterviews();
            log.info("Seeded mock interviews.");
        }
        if (practiceTopicRepository.count() == 0 || practiceProblemRepository.count() == 0) {
            seedPracticeContent();
            log.info("Seeded practice content.");
        } else {
            log.info("Practice content already exists, skipping reseed.");
        }
        
        if (companyPrepProfileRepository.count() == 0) {
            seedCompanyPrepContent();
            log.info("Synced company prep content.");
        } else {
            log.info("Company prep content already exists, skipping.");
        }
    }

    private void seedJobs() {
        Job j1 = Job.builder().title("SDE Intern").company("Microsoft").logoEmoji("\uD83D\uDD35").location("Hyderabad").type(Job.JobType.Internship).salary("Rs45K/mo").skills(Arrays.asList("C++", "Azure")).isNew(true).applyLink("https://careers.microsoft.com").postedAt(LocalDateTime.now()).build();
        Job j2 = Job.builder().title("Software Engineer").company("Google").logoEmoji("\uD83D\uDD34").location("Bangalore").type(Job.JobType.FullTime).salary("Rs25-45 LPA").skills(Arrays.asList("Java", "Go")).isNew(false).applyLink("https://careers.google.com").postedAt(LocalDateTime.now()).build();
        Job j3 = Job.builder().title("Backend Developer").company("Zoho").logoEmoji("\uD83D\uDFE0").location("Chennai").type(Job.JobType.FullTime).salary("Rs8-14 LPA").skills(Arrays.asList("Java", "Spring Boot", "MySQL")).isNew(true).applyLink("https://www.zoho.com/careers/").postedAt(LocalDateTime.now().minusHours(8)).build();
        jobRepository.saveAll(List.of(j1, j2, j3));
    }

    private void seedAptitudeQuestions() {
        AptitudeQuestion q1 = AptitudeQuestion.builder().category("Quantitative").question("A train travels 300 km at a uniform speed. If the speed had been 10 km/h more, the journey would have taken 1 hour less. Find the original speed.").options(Arrays.asList("40 km/h", "50 km/h", "60 km/h", "75 km/h")).correctAnswer(1).explanation("Let speed = x. Then 300/x - 300/(x+10) = 1, which gives x = 50.").difficultyLevel(1).build();
        AptitudeQuestion q2 = AptitudeQuestion.builder().category("Number System").question("What is the remainder when 7^100 is divided by 5?").options(Arrays.asList("1", "2", "3", "4")).correctAnswer(0).explanation("The powers of 7 mod 5 repeat every 4, so 7^100 has the same remainder as 7^4, which is 1.").difficultyLevel(2).build();
        aptitudeQuestionRepository.saveAll(List.of(q1, q2));
    }

    private void seedInterviewExperiences() {
        InterviewExperience e1 = InterviewExperience.builder().company("Amazon").role("SDE-1").description("R1: OA with 2 coding questions. R2: DSA round. R3: bar raiser. Strong focus on communication and edge cases.").date("March 2024").userName("Rahul Sharma").build();
        interviewExperienceRepository.save(e1);
    }

    private void seedMockInterviews() {
        MockInterview m1 = MockInterview.builder().topic("System Design").scheduledTime(LocalDateTime.now().plusDays(2)).status(MockInterview.InterviewStatus.Scheduled).build();
        mockInterviewRepository.save(m1);
    }

    private void seedPracticeContent() {
        PracticeTopic arrays = practiceTopicRepository.save(topic(1, "Arrays", "arrays", "Master indexing, prefix sums, sliding windows, and two-pointer patterns.", "array", "#f97316"));
        PracticeTopic strings = practiceTopicRepository.save(topic(2, "Strings", "strings", "Practice parsing, hashing, pattern matching, and substring problems.", "string", "#38bdf8"));
        PracticeTopic linkedList = practiceTopicRepository.save(topic(3, "Linked List", "linked-list", "Build confidence with pointer movement, reversal, and cycle detection.", "linked-list", "#10b981"));
        PracticeTopic stack = practiceTopicRepository.save(topic(4, "Stack", "stack", "Work on monotonic stacks, expression evaluation, and bracket validation.", "stack", "#a855f7"));
        PracticeTopic queue = practiceTopicRepository.save(topic(5, "Queue", "queue", "Cover BFS-style thinking, deques, and scheduling patterns.", "queue", "#f59e0b"));
        PracticeTopic trees = practiceTopicRepository.save(topic(6, "Trees", "trees", "Traverse, construct, and reason about binary trees and BSTs.", "tree", "#22c55e"));
        PracticeTopic graphs = practiceTopicRepository.save(topic(7, "Graphs", "graphs", "Train on DFS, BFS, topological sort, shortest path, and connectivity.", "graph", "#ef4444"));
        PracticeTopic dp = practiceTopicRepository.save(topic(8, "Dynamic Programming", "dynamic-programming", "Learn memoization, tabulation, state transitions, and optimization.", "brain", "#8b5cf6"));
        PracticeTopic sorting = practiceTopicRepository.save(topic(9, "Sorting & Searching", "sorting", "Understand comparison sorts and efficient search patterns.", "sorting", "#ec4899"));
        PracticeTopic binarySearch = practiceTopicRepository.save(topic(10, "Binary Search", "binary-search", "Apply binary search to direct lookups and answer-search problems.", "binary-search", "#06b6d4"));
        PracticeTopic twoPointers = practiceTopicRepository.save(topic(11, "Two Pointers", "two-pointers", "Solve pair-sum, partitioning, and palindrome checks.", "two-pointers", "#f43f5e"));
        PracticeTopic backtracking = practiceTopicRepository.save(topic(12, "Backtracking", "backtracking", "Generate combinations, permutations, and valid states recursively.", "brain", "#d97706"));

        practiceProblemRepository.saveAll(List.of(
                problem(1, arrays, "Two Sum", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/two-sum/", "Hash map lookup for complement values."),
                problem(2, arrays, "Best Time to Buy and Sell Stock", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Track minimum price and maximum profit in one pass."),
                problem(3, arrays, "Merge Intervals", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/merge-intervals/", "Sort by start time and merge overlapping intervals."),
                problem(4, strings, "Valid Anagram", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/valid-anagram/", "Compare frequency counts efficiently."),
                problem(5, strings, "Longest Substring Without Repeating Characters", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "Sliding window with character index tracking."),
                problem(6, strings, "Minimum Window Substring", PracticeProblem.Difficulty.Hard, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/minimum-window-substring/", "Expand and contract a valid window."),
                problem(7, linkedList, "Reverse Linked List", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/reverse-linked-list/", "Iterative pointer rewiring practice."),
                problem(8, linkedList, "Add Two Numbers", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/add-two-numbers/", "Digit-by-digit simulation with carry handling."),
                problem(9, stack, "Valid Parentheses", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/valid-parentheses/", "Use a stack for matching open and close brackets."),
                problem(10, stack, "Next Greater Element", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.GeeksForGeeks, "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1", "Monotonic stack pattern."),
                problem(11, queue, "Implement Queue using Stacks", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/implement-queue-using-stacks/", "Use two stacks to simulate queue operations."),
                problem(12, queue, "Rotting Oranges", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/rotting-oranges/", "Multi-source BFS on a grid."),
                problem(13, trees, "Maximum Depth of Binary Tree", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/maximum-depth-of-binary-tree/", "Classic recursive tree height."),
                problem(14, trees, "Binary Tree Level Order Traversal", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/binary-tree-level-order-traversal/", "Breadth-first traversal by level."),
                problem(15, graphs, "Number of Islands", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/number-of-islands/", "Count components using DFS or BFS."),
                problem(16, graphs, "Course Schedule", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/course-schedule/", "Topological sort and cycle detection."),
                problem(17, dp, "Climbing Stairs", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/climbing-stairs/", "Simple 1D dynamic programming recurrence."),
                problem(18, dp, "House Robber", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/house-robber/", "Decide between robbing current or skipping it."),
                problem(19, sorting, "Sort Colors", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/sort-colors/", "Dutch National Flag partitioning."),
                problem(20, binarySearch, "Search in Rotated Sorted Array", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/search-in-rotated-sorted-array/", "Binary search with rotated halves."),
                problem(21, twoPointers, "Move Zeroes", PracticeProblem.Difficulty.Easy, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/move-zeroes/", "Compact non-zero elements in place."),
                problem(22, backtracking, "Generate Parentheses", PracticeProblem.Difficulty.Medium, PracticeProblem.Platform.LeetCode, "https://leetcode.com/problems/generate-parentheses/", "Track available opening and closing brackets.")
        ));
    }

    private void seedCompanyPrepContent() {
        Map<String, PracticeTopic> topicsByName = practiceTopicRepository.findAll().stream().collect(Collectors.toMap(
                PracticeTopic::getName,
                Function.identity(),
                (existing, ignored) -> existing
        ));
        Map<String, PracticeProblem> problemsByTitle = practiceProblemRepository.findAll().stream().collect(Collectors.toMap(
                PracticeProblem::getTitle,
                Function.identity(),
                (existing, ignored) -> existing
        ));

        saveCompanyProfile(1, "Amazon", "Medium to Hard", "AMZ", "#f59e0b", 4, 2, 6, 150, "Online assessment, DSA rounds, bar raiser, leadership principles", "Focus on arrays, strings, graphs, and dynamic programming under timed practice.", List.of("Arrays", "Strings", "Graphs", "Dynamic Programming"), List.of("Two Sum / pair-based hash map problem", "Longest substring without repeating characters", "Graph traversal and course schedule patterns"), List.of("Two Sum", "Longest Substring Without Repeating Characters", "Course Schedule", "House Robber"), topicsByName, problemsByTitle);
        saveCompanyProfile(2, "TCS", "Easy to Medium", "TCS", "#2563eb", 3, 1, 2, 90, "Aptitude-heavy screening with implementation-focused coding", "Build comfort with arrays, strings, queue basics, and simple linked list problems.", List.of("Arrays", "Strings", "Queue", "Linked List"), List.of("Array rotation and subarray variants", "String prefix and pattern problems", "Queue basics"), List.of("Two Sum", "Valid Anagram", "Implement Queue using Stacks", "Reverse Linked List"), topicsByName, problemsByTitle);
        saveCompanyProfile(3, "Infosys", "Easy to Medium", "INF", "#0ea5e9", 3, 1, 3, 95, "Quant, coding, then technical interview on core DSA", "Prioritize stack and trees after warming up with arrays and strings.", List.of("Arrays", "Strings", "Stack", "Trees"), List.of("Valid parentheses", "Prefix comparison", "Tree traversal"), List.of("Valid Parentheses", "Maximum Depth of Binary Tree", "Binary Tree Level Order Traversal"), topicsByName, problemsByTitle);
        saveCompanyProfile(4, "Google", "Medium to Hard", "GOO", "#ef4444", 5, 2, 6, 180, "Online assessment followed by algorithmic interviews and deep problem solving", "Invest in arrays, graphs, dynamic programming, and binary search under timed sets.", List.of("Arrays", "Graphs", "Dynamic Programming", "Binary Search"), List.of("Graph traversal and connected components", "DP state transitions", "Binary search on answer"), List.of("Merge Intervals", "Number of Islands", "Course Schedule", "House Robber", "Search in Rotated Sorted Array"), topicsByName, problemsByTitle);
        saveCompanyProfile(5, "Microsoft", "Medium", "MS", "#2563eb", 4, 1, 4, 135, "Coding round followed by DSA-focused interviews with implementation and communication emphasis", "Cover trees and linked lists early, then use strings and dynamic programming to build interview stamina.", List.of("Trees", "Linked List", "Strings", "Dynamic Programming"), List.of("Tree traversal", "Linked list pointer movement", "String hashing", "Simple recurrences"), List.of("Maximum Depth of Binary Tree", "Reverse Linked List", "Add Two Numbers", "Longest Substring Without Repeating Characters", "Climbing Stairs"), topicsByName, problemsByTitle);
        saveCompanyProfile(6, "Adobe", "Medium", "ADB", "#dc2626", 4, 1, 4, 140, "Online coding round, algorithmic interviews, and computer science fundamentals discussion", "Mix string and dynamic programming practice with tree and graph rounds to mirror Adobe's balance of implementation and reasoning.", List.of("Strings", "Dynamic Programming", "Trees", "Graphs"), List.of("Minimum window substring variants", "Tree level traversal", "Cycle detection in dependency graphs"), List.of("Minimum Window Substring", "Binary Tree Level Order Traversal", "Course Schedule", "House Robber"), topicsByName, problemsByTitle);
        saveCompanyProfile(7, "Flipkart", "Medium", "FLP", "#2563eb", 4, 2, 5, 150, "Assessment with implementation-heavy coding followed by DSA and low-level design discussion", "Train arrays, sorting, and graph thinking alongside linked list implementation drills.", List.of("Arrays", "Sorting & Searching", "Graphs", "Linked List"), List.of("Merge overlapping intervals", "Order scheduling with dependencies", "Linked list arithmetic"), List.of("Merge Intervals", "Course Schedule", "Add Two Numbers", "Sort Colors"), topicsByName, problemsByTitle);
        saveCompanyProfile(8, "Zoho", "Easy to Medium", "ZHO", "#16a34a", 4, 1, 3, 120, "Aptitude plus coding rounds with strong emphasis on clean implementation and basics", "Stay sharp on arrays, strings, queues, and binary search because Zoho often rewards clarity over trickiness.", List.of("Arrays", "Strings", "Queue", "Binary Search"), List.of("Array scanning problems", "Substring and string cleanup", "Queue simulation", "Search on sorted data"), List.of("Two Sum", "Valid Anagram", "Implement Queue using Stacks", "Search in Rotated Sorted Array"), topicsByName, problemsByTitle);
        saveCompanyProfile(9, "Walmart", "Medium", "WMT", "#1d4ed8", 4, 1, 4, 140, "Online coding followed by DSA rounds and practical backend-oriented discussions", "Invest in graphs, trees, and dynamic programming, then add queue and BFS practice for operations-style problem solving.", List.of("Graphs", "Trees", "Dynamic Programming", "Queue"), List.of("Island counting and BFS", "Binary tree traversal", "DP optimization under constraints"), List.of("Number of Islands", "Binary Tree Level Order Traversal", "House Robber", "Rotting Oranges"), topicsByName, problemsByTitle);
        saveCompanyProfile(10, "Atlassian", "Medium to Hard", "ATL", "#0f766e", 5, 2, 5, 165, "Coding assessment, algorithm interviews, and strong emphasis on communication and problem clarity", "Practice arrays and strings under time pressure, then deepen graph and backtracking confidence for onsite-style questions.", List.of("Arrays", "Strings", "Graphs", "Backtracking"), List.of("Window-based string problems", "Connected components", "Generate valid states recursively"), List.of("Longest Substring Without Repeating Characters", "Minimum Window Substring", "Number of Islands", "Generate Parentheses"), topicsByName, problemsByTitle);
    }

    private PracticeTopic topic(int order, String name, String slug, String description, String iconName, String accentColor) {
        return PracticeTopic.builder().displayOrder(order).name(name).slug(slug).description(description).iconName(iconName).accentColor(accentColor).build();
    }

    private PracticeProblem problem(int order, PracticeTopic topic, String title, PracticeProblem.Difficulty difficulty, PracticeProblem.Platform platform, String url, String summary) {
        return PracticeProblem.builder().displayOrder(order).topic(topic).title(title).difficulty(difficulty).platform(platform).problemUrl(url).summary(summary).build();
    }

    @Transactional
    private void saveCompanyProfile(int displayOrder, String company, String aptitudeLevel, String logoText, String brandColor, int interviewRounds, int onlineAssessmentQuestions, int codingQuestions, int interviewDurationMinutes, String roundPattern, String prepPlan, List<String> focusAreaNames, List<String> askedQuestionTexts, List<String> recommendedProblemTitles, Map<String, PracticeTopic> topicsByName, Map<String, PracticeProblem> problemsByTitle) {
        CompanyPrepProfile profile = companyPrepProfileRepository.findByCompanyIgnoreCase(company)
                .orElseGet(() -> CompanyPrepProfile.builder().company(company).build());
        profile.setCompany(company);
        profile.setAptitudeLevel(aptitudeLevel);
        profile.setLogoText(logoText);
        profile.setBrandColor(brandColor);
        profile.setInterviewRounds(interviewRounds);
        profile.setOnlineAssessmentQuestions(onlineAssessmentQuestions);
        profile.setCodingQuestions(codingQuestions);
        profile.setInterviewDurationMinutes(interviewDurationMinutes);
        profile.setRoundPattern(roundPattern);
        profile.setPrepPlan(prepPlan);
        profile.setDisplayOrder(displayOrder);
        profile.getFocusAreas().clear();
        profile.getAskedQuestions().clear();
        profile.getRecommendedProblems().clear();
        for (int index = 0; index < focusAreaNames.size(); index++) {
            profile.getFocusAreas().add(CompanyPrepFocusArea.builder().profile(profile).topic(requiredTopic(topicsByName, focusAreaNames.get(index))).displayOrder(index + 1).build());
        }
        for (int index = 0; index < askedQuestionTexts.size(); index++) {
            profile.getAskedQuestions().add(CompanyPrepQuestion.builder().profile(profile).questionText(askedQuestionTexts.get(index)).displayOrder(index + 1).build());
        }
        for (int index = 0; index < recommendedProblemTitles.size(); index++) {
            profile.getRecommendedProblems().add(CompanyPrepRecommendation.builder().profile(profile).practiceProblem(requiredProblem(problemsByTitle, recommendedProblemTitles.get(index))).displayOrder(index + 1).build());
        }
        companyPrepProfileRepository.save(profile);
    }

    private PracticeTopic requiredTopic(Map<String, PracticeTopic> topicsByName, String topicName) {
        PracticeTopic topic = topicsByName.get(topicName);
        if (topic == null) {
            throw new IllegalStateException("Missing practice topic for company prep seed: " + topicName);
        }
        return topic;
    }

    private PracticeProblem requiredProblem(Map<String, PracticeProblem> problemsByTitle, String problemTitle) {
        PracticeProblem problem = problemsByTitle.get(problemTitle);
        if (problem == null) {
            throw new IllegalStateException("Missing practice problem for company prep seed: " + problemTitle);
        }
        return problem;
    }
}
