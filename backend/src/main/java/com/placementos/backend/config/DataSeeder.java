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
        if (practiceTopicRepository.count() < 15 || practiceProblemRepository.count() < 90) {
            practiceProblemRepository.deleteAll();
            practiceTopicRepository.deleteAll();
            seedPracticeContent();
            log.info("Seeded 90+ real-world practice problems.");
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
        // Essential Curated Topics
        PracticeTopic arrays = practiceTopicRepository.save(topic(1, "Arrays", "arrays", "Master indexing, prefix sums, and frequency counts.", "array", "#f97316"));
        PracticeTopic strings = practiceTopicRepository.save(topic(2, "Strings", "strings", "Practice parsing, hashing, and substring problems.", "string", "#38bdf8"));
        PracticeTopic twoPointers = practiceTopicRepository.save(topic(3, "Two Pointers", "two-pointers", "Solve pair-sum, partitioning, and palindrome checks.", "two-pointers", "#f43f5e"));
        PracticeTopic slidingWindow = practiceTopicRepository.save(topic(4, "Sliding Window", "sliding-window", "Maximize/minimize values within a moving window boundary.", "sliding-window", "#0ea5e9"));
        PracticeTopic stack = practiceTopicRepository.save(topic(5, "Stack & Queues", "stack", "Monotonic stacks, deques, and expression evaluation.", "stack", "#a855f7"));
        PracticeTopic linkedList = practiceTopicRepository.save(topic(6, "Linked List", "linked-list", "Master pointer movement, reversal, and cycle detection.", "linked-list", "#10b981"));
        PracticeTopic binarySearch = practiceTopicRepository.save(topic(7, "Binary Search", "binary-search", "Apply BS to ranges and answer-search problems.", "binary-search", "#06b6d4"));
        PracticeTopic trees = practiceTopicRepository.save(topic(8, "Trees", "trees", "Traversals, construction, and reasoning about BSTs.", "tree", "#22c55e"));
        PracticeTopic tries = practiceTopicRepository.save(topic(9, "Tries & Heaps", "trie", "Prefix trees and Top-K frequency patterns.", "brain", "#f59e0b"));
        PracticeTopic backtracking = practiceTopicRepository.save(topic(10, "Backtracking", "backtracking", "Generate combinations and permutations recursively.", "brain", "#d97706"));
        PracticeTopic graphs = practiceTopicRepository.save(topic(11, "Graphs", "graphs", "DFS, BFS, Topological Sort, and Shortest Paths.", "graph", "#ef4444"));
        PracticeTopic dp1 = practiceTopicRepository.save(topic(12, "Dynamic Programming", "dynamic-programming", "1D/2D memoization and tabulation mastery.", "brain", "#8b5cf6"));
        PracticeTopic greedy = practiceTopicRepository.save(topic(13, "Greedy & Intervals", "greedy", "Optimal local choices and overlapping ranges.", "crosshair", "#ec4899"));
        PracticeTopic bits = practiceTopicRepository.save(topic(14, "Bit Manipulation", "bit-manipulation", "Low-level optimization and unique set problems.", "zap", "#6366f1"));
        PracticeTopic math = practiceTopicRepository.save(topic(15, "Math & Geometry", "math", "Number theory, primes, and geometry basics.", "calculator", "#64748b"));

        // 70+ Industry-Standard Problems (Blind 75 & Top 100)
        practiceProblemRepository.saveAll(List.of(
            // Arrays (1-7)
            problem(1, arrays, "Two Sum", Easy, LeetCode, "https://leetcode.com/problems/two-sum/", "Hash map lookup for complement values."),
            problem(2, arrays, "Best Time to Buy and Sell Stock", Easy, LeetCode, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Track minimum price and max profit in one pass."),
            problem(3, arrays, "Contains Duplicate", Easy, LeetCode, "https://leetcode.com/problems/contains-duplicate/", "Use a hash set to detect duplicate elements."),
            problem(4, arrays, "Product of Array Except Self", Medium, LeetCode, "https://leetcode.com/problems/product-of-array-except-self/", "Prefix and suffix product strategy."),
            problem(5, arrays, "Maximum Subarray (Kadane's)", Medium, LeetCode, "https://leetcode.com/problems/maximum-subarray/", "Dynamic subarray sum tracking."),
            problem(6, arrays, "Maximum Product Subarray", Medium, LeetCode, "https://leetcode.com/problems/maximum-product-subarray/", "Track both max and min products."),
            problem(7, arrays, "Merge Sorted Array", Easy, LeetCode, "https://leetcode.com/problems/merge-sorted-array/", "Merge from the back to avoid extra space."),

            // Strings (8-14)
            problem(8, strings, "Valid Anagram", Easy, LeetCode, "https://leetcode.com/problems/valid-anagram/", "Compare frequency counts efficiently."),
            problem(9, strings, "Group Anagrams", Medium, LeetCode, "https://leetcode.com/problems/group-anagrams/", "Map sorted versions of strings to group them."),
            problem(10, strings, "Valid Palindrome", Easy, LeetCode, "https://leetcode.com/problems/valid-palindrome/", "Clean strings and check symmetric characters."),
            problem(11, strings, "Longest Palindromic Substring", Medium, LeetCode, "https://leetcode.com/problems/longest-palindromic-substring/", "Expand from center for each character."),
            problem(12, strings, "Longest Repeating Character Replacement", Medium, LeetCode, "https://leetcode.com/problems/longest-repeating-character-replacement/", "Sliding window with frequency tracking."),
            problem(13, strings, "Palindromic Substrings", Medium, LeetCode, "https://leetcode.com/problems/palindromic-substrings/", "Count palindromes using expansion logic."),
            problem(14, strings, "Reverse a String", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/reverse-a-string/1", "Classic string manipulation warmup.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Two Pointers (15-21)
            problem(15, twoPointers, "3Sum", Medium, LeetCode, "https://leetcode.com/problems/3sum/", "Sort and use two pointers to find unique triplets."),
            problem(16, twoPointers, "Container With Most Water", Medium, LeetCode, "https://leetcode.com/problems/container-with-most-water/", "A greedy approach using two pointers starting from ends."),
            problem(17, twoPointers, "Trapping Rain Water", Hard, LeetCode, "https://leetcode.com/problems/trapping-rain-water/", "Calculate elevation trap using pointers."),
            problem(18, twoPointers, "Remove Element", Easy, LeetCode, "https://leetcode.com/problems/remove-element/", "Overwrite elements using two-pointer strategy."),
            problem(19, twoPointers, "Squaring a Sorted Array", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1", "Compare squares from both ends of the array."),
            problem(20, twoPointers, "Valid Palindrome II", Easy, LeetCode, "https://leetcode.com/problems/valid-palindrome-ii/", "One deletion allowed check."),
            problem(21, twoPointers, "Two Sum II - Input Array Is Sorted", Medium, LeetCode, "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "Standard two-pointer search."),

            // Sliding Window (22-28)
            problem(22, slidingWindow, "Longest Substring Without Repeating Characters", Medium, LeetCode, "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "Dynamic window with unique character tracking."),
            problem(23, slidingWindow, "Minimum Window Substring", Hard, LeetCode, "https://leetcode.com/problems/minimum-window-substring/", "Complex window logic with character mapping."),
            problem(24, slidingWindow, "Sliding Window Maximum", Hard, LeetCode, "https://leetcode.com/problems/sliding-window-maximum/", "Use a deque to find max in window efficiently."),
            problem(25, slidingWindow, "Permutation in String", Medium, LeetCode, "https://leetcode.com/problems/permutation-in-string/", "Fixed window frequency check."),
            problem(26, slidingWindow, "Minimum Size Subarray Sum", Medium, LeetCode, "https://leetcode.com/problems/minimum-size-subarray-sum/", "Expand/contract window to meet sum target."),
            problem(27, slidingWindow, "Longest Subarray with sum at most K", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/longest-subarray-with-sum-at-most-k/1", "Classic GFG sliding window problem."),
            problem(28, slidingWindow, "Subarrays with K Different Integers", Hard, LeetCode, "https://leetcode.com/problems/subarrays-with-k-different-integers/", "Exact K counts using window subtraction.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Stack & Queues (29-35)
            problem(29, stack, "Valid Parentheses", Easy, LeetCode, "https://leetcode.com/problems/valid-parentheses/", "Use a stack for matching nested brackets."),
            problem(30, stack, "Min Stack", Medium, LeetCode, "https://leetcode.com/problems/min-stack/", "Keep track of min value alongside standard stack."),
            problem(31, stack, "Evaluate Reverse Polish Notation", Medium, LeetCode, "https://leetcode.com/problems/evaluate-reverse-polish-notation/", "Stack-based arithmetic simulation."),
            problem(32, stack, "Daily Temperatures", Medium, LeetCode, "https://leetcode.com/problems/daily-temperatures/", "Monotonic stack to find next warmer day."),
            problem(33, stack, "Next Greater Element I", Easy, LeetCode, "https://leetcode.com/problems/next-greater-element-i/", "Map monotonic stack results for O(1) lookup."),
            problem(34, stack, "Largest Rectangle in Histogram", Hard, LeetCode, "https://leetcode.com/problems/largest-rectangle-in-histogram/", "Monotonic stack identifying boundary heights."),
            problem(35, stack, "Implement Queue using Stacks", Easy, LeetCode, "https://leetcode.com/problems/implement-queue-using-stacks/", "Push vs Pop optimization strategies."),

            // Linked List (36-42)
            problem(36, linkedList, "Reverse Linked List", Easy, LeetCode, "https://leetcode.com/problems/reverse-linked-list/", "Standard iterative pointer rewiring."),
            problem(37, linkedList, "Linked List Cycle", Easy, LeetCode, "https://leetcode.com/problems/linked-list-cycle/", "Floyd's Tortoise and Hare detection."),
            problem(38, linkedList, "Merge Two Sorted Lists", Easy, LeetCode, "https://leetcode.com/problems/merge-two-sorted-lists/", "Recursive or iterative sorted merge."),
            problem(39, linkedList, "Remove Nth Node From End of List", Medium, LeetCode, "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", "Two pointers with fixed gap traversal."),
            problem(40, linkedList, "Reorder List", Medium, LeetCode, "https://leetcode.com/problems/reorder-list/", "Find middle, reverse half, and merge."),
            problem(41, linkedList, "Copy List with Random Pointer", Medium, LeetCode, "https://leetcode.com/problems/copy-list-with-random-pointer/", "Iteration with deep copy or hash map mapping."),
            problem(42, linkedList, "Add Two Numbers", Medium, LeetCode, "https://leetcode.com/problems/add-two-numbers/", "Digit-by-digit simulation with carry handling.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Binary Search (43-49)
            problem(43, binarySearch, "Search in Rotated Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/search-in-rotated-sorted-array/", "BS identifying sorted halves in rotation."),
            problem(44, binarySearch, "Search a 2D Matrix", Medium, LeetCode, "https://leetcode.com/problems/search-a-2d-matrix/", "Treat 2D matrix as flattened 1D array for BS."),
            problem(45, binarySearch, "Koko Eating Bananas", Medium, LeetCode, "https://leetcode.com/problems/koko-eating-bananas/", "BS on answer: search for minimum speed."),
            problem(46, binarySearch, "Median of Two Sorted Arrays", Hard, LeetCode, "https://leetcode.com/problems/median-of-two-sorted-arrays/", "Advanced BS partitioning logic."),
            problem(47, binarySearch, "Find Minimum in Rotated Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", "Detect rotation pivot using BS."),
            problem(48, binarySearch, "Square Root of an integer", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/square-root/1", "BS within [0, x] range."),
            problem(49, binarySearch, "Binary Search", Easy, LeetCode, "https://leetcode.com/problems/binary-search/", "The foundational sorted search algorithm."),

            // Trees (50-56)
            problem(50, trees, "Invert Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/invert-binary-tree/", "Classic recursive swap of left and right children."),
            problem(51, trees, "Maximum Depth of Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/maximum-depth-of-binary-tree/", "Calculate tree height using recursion."),
            problem(52, trees, "Same Tree", Easy, LeetCode, "https://leetcode.com/problems/same-tree/", "Recursive structural equality check."),
            problem(53, trees, "Binary Tree Level Order Traversal", Medium, LeetCode, "https://leetcode.com/problems/binary-tree-level-order-traversal/", "BFS by processing nodes level by level."),
            problem(54, trees, "Lowest Common Ancestor of a BST", Medium, LeetCode, "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", "Ancestor detection using BST properties."),
            problem(55, trees, "Validate Binary Search Tree", Medium, LeetCode, "https://leetcode.com/problems/validate-binary-search-tree/", "Range verification for all nodes."),
            problem(56, trees, "Binary Tree Maximum Path Sum", Hard, LeetCode, "https://leetcode.com/problems/binary-tree-maximum-path-sum/", "Track global max sum during recursive post-order traversal.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Tries & Heaps (57-63)
            problem(57, tries, "Kth Largest Element in an Array", Medium, LeetCode, "https://leetcode.com/problems/kth-largest-element-in-an-array/", "Use a min-heap to track largest K elements."),
            problem(58, tries, "Top K Frequent Elements", Medium, LeetCode, "https://leetcode.com/problems/top-k-frequent-elements/", "Heap combined with frequency hash map."),
            problem(59, tries, "Find Median from Data Stream", Hard, LeetCode, "https://leetcode.com/problems/find-median-from-data-stream/", "Two heaps logic for real-time median tracking."),
            problem(60, tries, "Implement Trie (Prefix Tree)", Medium, LeetCode, "https://leetcode.com/problems/implement-trie-prefix-tree/", "Node-based prefix structure implementation."),
            problem(61, tries, "Merge k Sorted Lists", Hard, LeetCode, "https://leetcode.com/problems/merge-k-sorted-lists/", "Min-heap consolidating k sorted inputs."),
            problem(62, tries, "Word Search II", Hard, LeetCode, "https://leetcode.com/problems/word-search-ii/", "Optimized backtracking using a Trie for prefix lookup."),
            problem(63, tries, "Design Add and Search Words Data Structure", Medium, LeetCode, "https://leetcode.com/problems/design-add-and-search-words-data-structure/", "Trie with wildcard dot matching."),

            // Backtracking (64-70)
            problem(64, backtracking, "Subsets", Medium, LeetCode, "https://leetcode.com/problems/subsets/", "Recursive decision tree: include or exclude element."),
            problem(65, backtracking, "Combinations", Medium, LeetCode, "https://leetcode.com/problems/combinations/", "Generate fixed-size groups within range."),
            problem(66, backtracking, "Permutations", Medium, LeetCode, "https://leetcode.com/problems/permutations/", "Generate all possible orderings of an array."),
            problem(67, backtracking, "Combination Sum", Medium, LeetCode, "https://leetcode.com/problems/combination-sum/", "Explore combinations matching target with reuse allowed."),
            problem(68, backtracking, "Word Search", Medium, LeetCode, "https://leetcode.com/problems/word-search/", "DFS grid traversal with backtracking verification."),
            problem(69, backtracking, "N-Queens", Hard, LeetCode, "https://leetcode.com/problems/n-queens/", "The vertical/diagonal placement problem on chessboard."),
            problem(70, backtracking, "Sudoku Solver", Hard, LeetCode, "https://leetcode.com/problems/sudoku-solver/", "Recursive grid completion with validation checks.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Graphs (71-77)
            problem(71, graphs, "Number of Islands", Medium, LeetCode, "https://leetcode.com/problems/number-of-islands/", "Count components using DFS or BFS grid traversal."),
            problem(72, graphs, "Clone Graph", Medium, LeetCode, "https://leetcode.com/problems/clone-graph/", "Deep copy using node-mapping and BFS/DFS."),
            problem(73, graphs, "Course Schedule", Medium, LeetCode, "https://leetcode.com/problems/course-schedule/", "Detect cycles in dependency graph (topological sort)."),
            problem(74, graphs, "Rotting Oranges", Medium, LeetCode, "https://leetcode.com/problems/rotting-oranges/", "Multi-source BFS identifying time to reach all nodes."),
            problem(75, graphs, "Pacific Atlantic Water Flow", Medium, LeetCode, "https://leetcode.com/problems/pacific-atlantic-water-flow/", "Reachability analysis from borders using DFS."),
            problem(76, graphs, "Word Ladder", Hard, LeetCode, "https://leetcode.com/problems/word-ladder/", "Shortest path in state-change graph via BFS."),
            problem(77, graphs, "Alien Dictionary", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/alien-dictionary/1", "Topological sort on character order constraints."),

            // Dynamic Programming (78-84)
            problem(78, dp1, "Climbing Stairs", Easy, LeetCode, "https://leetcode.com/problems/climbing-stairs/", "Simple 1D recurrence relationship (Fibonacci)."),
            problem(79, dp1, "House Robber", Medium, LeetCode, "https://leetcode.com/problems/house-robber/", "Decision making: rob current vs skipping."),
            problem(80, dp1, "Coin Change", Medium, LeetCode, "https://leetcode.com/problems/coin-change/", "Find minimum coins to reach target amount."),
            problem(81, dp1, "Longest Increasing Subsequence", Medium, LeetCode, "https://leetcode.com/problems/longest-increasing-subsequence/", "Standard DP or BS-optimized sequence analysis."),
            problem(82, dp1, "Longest Common Subsequence", Medium, LeetCode, "https://leetcode.com/problems/longest-common-subsequence/", "2D matrix approach to sequence matching."),
            problem(83, dp1, "0-1 Knapsack Problem", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", "Foundational DP selection logic."),
            problem(84, dp1, "Unique Paths", Medium, LeetCode, "https://leetcode.com/problems/unique-paths/", "Calculating grid reachability permutations."),

            // Bonus: Bits & Greedy (85-91)
            problem(85, bits, "Single Number", Easy, LeetCode, "https://leetcode.com/problems/single-number/", "Find unique element using XOR properties."),
            problem(86, bits, "Number of 1 Bits", Easy, LeetCode, "https://leetcode.com/problems/number-of-1-bits/", "Count set bits using bit manipulation."),
            problem(87, bits, "Counting Bits", Easy, LeetCode, "https://leetcode.com/problems/counting-bits/", "Generate bit counts for O(n) scale."),
            problem(88, greedy, "Jump Game", Medium, LeetCode, "https://leetcode.com/problems/jump-game/", "Greedy evaluation of reachability to end."),
            problem(89, greedy, "Gas Station", Medium, LeetCode, "https://leetcode.com/problems/gas-station/", "Greedy search for starting point in circuit."),
            problem(90, greedy, "Non-overlapping Intervals", Medium, LeetCode, "https://leetcode.com/problems/non-overlapping-intervals/", "Greedy interval selection by end time."),
            problem(91, math, "Happy Number", Easy, LeetCode, "https://leetcode.com/problems/happy-number/", "Cycle detection logic for number transformation.")
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
        saveCompanyProfile(2, "TCS", "Easy to Medium", "TCS", "#2563eb", 3, 1, 2, 90, "Aptitude-heavy screening with implementation-focused coding", "Build comfort with arrays, strings, stack basics, and simple linked list problems.", List.of("Arrays", "Strings", "Stack & Queues", "Linked List"), List.of("Array rotation and subarray variants", "String prefix and pattern problems", "Stack basics"), List.of("Two Sum", "Valid Anagram", "Implement Queue using Stacks", "Reverse Linked List"), topicsByName, problemsByTitle);
        saveCompanyProfile(3, "Infosys", "Easy to Medium", "INF", "#0ea5e9", 3, 1, 3, 95, "Quant, coding, then technical interview on core DSA", "Prioritize stack and trees after warming up with arrays and strings.", List.of("Arrays", "Strings", "Stack & Queues", "Trees"), List.of("Valid parentheses", "Prefix comparison", "Tree traversal"), List.of("Valid Parentheses", "Maximum Depth of Binary Tree", "Binary Tree Level Order Traversal"), topicsByName, problemsByTitle);
        saveCompanyProfile(4, "Google", "Medium to Hard", "GOO", "#ef4444", 5, 2, 6, 180, "Online assessment followed by algorithmic interviews and deep problem solving", "Invest in arrays, graphs, dynamic programming, and binary search under timed sets.", List.of("Arrays", "Graphs", "Dynamic Programming", "Binary Search"), List.of("Graph traversal and connected components", "DP state transitions", "Binary search on answer"), List.of("Merge Sorted Array", "Number of Islands", "Course Schedule", "House Robber", "Search in Rotated Sorted Array"), topicsByName, problemsByTitle);
        saveCompanyProfile(5, "Microsoft", "Medium", "MS", "#2563eb", 4, 1, 4, 135, "Coding round followed by DSA-focused interviews with implementation and communication emphasis", "Cover trees and linked lists early, then use strings and dynamic programming to build interview stamina.", List.of("Trees", "Linked List", "Strings", "Dynamic Programming"), List.of("Tree traversal", "Linked list pointer movement", "String hashing", "Simple recurrences"), List.of("Maximum Depth of Binary Tree", "Reverse Linked List", "Add Two Numbers", "Longest Substring Without Repeating Characters", "Climbing Stairs"), topicsByName, problemsByTitle);
        saveCompanyProfile(6, "Adobe", "Medium", "ADB", "#dc2626", 4, 1, 4, 140, "Online coding round, algorithmic interviews, and computer science fundamentals discussion", "Mix string and dynamic programming practice with tree and graph rounds to mirror Adobe's balance of implementation and reasoning.", List.of("Strings", "Dynamic Programming", "Trees", "Graphs"), List.of("Minimum window substring variants", "Tree level traversal", "Cycle detection in dependency graphs"), List.of("Minimum Window Substring", "Binary Tree Level Order Traversal", "Course Schedule", "House Robber"), topicsByName, problemsByTitle);
        saveCompanyProfile(7, "Flipkart", "Medium", "FLP", "#2563eb", 4, 2, 5, 150, "Assessment with implementation-heavy coding followed by DSA and low-level design discussion", "Train arrays, greedy, and graph thinking alongside linked list implementation drills.", List.of("Arrays", "Greedy & Intervals", "Graphs", "Linked List"), List.of("Merge overlapping intervals", "Order scheduling with dependencies", "Linked list arithmetic"), List.of("Product of Array Except Self", "Course Schedule", "Add Two Numbers", "Product of Array Except Self"), topicsByName, problemsByTitle);
        saveCompanyProfile(8, "Zoho", "Easy to Medium", "ZHO", "#16a34a", 4, 1, 3, 120, "Aptitude plus coding rounds with strong emphasis on clean implementation and basics", "Stay sharp on arrays, strings, stack/queues, and binary search because Zoho often rewards clarity over trickiness.", List.of("Arrays", "Strings", "Stack & Queues", "Binary Search"), List.of("Array scanning problems", "Substring and string cleanup", "Queue simulation", "Search on sorted data"), List.of("Two Sum", "Valid Anagram", "Implement Queue using Stacks", "Search in Rotated Sorted Array"), topicsByName, problemsByTitle);
        saveCompanyProfile(9, "Walmart", "Medium", "WMT", "#1d4ed8", 4, 1, 4, 140, "Online coding followed by DSA rounds and practical backend-oriented discussions", "Invest in graphs, trees, and dynamic programming, then add sliding window practice for operations-style problem solving.", List.of("Graphs", "Trees", "Dynamic Programming", "Sliding Window"), List.of("Island counting and BFS", "Binary tree traversal", "DP optimization under constraints"), List.of("Number of Islands", "Binary Tree Level Order Traversal", "House Robber", "Rotting Oranges"), topicsByName, problemsByTitle);
        saveCompanyProfile(10, "Atlassian", "Medium to Hard", "ATL", "#0f766e", 5, 2, 5, 165, "Coding assessment, algorithm interviews, and strong emphasis on communication and problem clarity", "Practice arrays and strings under time pressure, then deepen graph and backtracking confidence for onsite-style questions.", List.of("Arrays", "Strings", "Graphs", "Backtracking"), List.of("Window-based string problems", "Connected components", "Generate valid states recursively"), List.of("Longest Substring Without Repeating Characters", "Minimum Window Substring", "Number of Islands", "Generate Parentheses"), topicsByName, problemsByTitle);
    }

    private PracticeTopic topic(int order, String name, String slug, String description, String iconName, String accentColor) {
        return PracticeTopic.builder().displayOrder(order).name(name).slug(slug).description(description).iconName(iconName).accentColor(accentColor).build();
    }

    private PracticeProblem problem(int order, PracticeTopic topic, String title, PracticeProblem.Difficulty difficulty, PracticeProblem.Platform platform, String url, String summary) {
        return PracticeProblem.builder().displayOrder(order).topic(topic).title(title).difficulty(difficulty).platform(platform).problemUrl(url).summary(summary).build();
    }

    private static final PracticeProblem.Difficulty Easy = PracticeProblem.Difficulty.Easy;
    private static final PracticeProblem.Difficulty Medium = PracticeProblem.Difficulty.Medium;
    private static final PracticeProblem.Difficulty Hard = PracticeProblem.Difficulty.Hard;
    private static final PracticeProblem.Platform LeetCode = PracticeProblem.Platform.LeetCode;
    private static final PracticeProblem.Platform GeeksForGeeks = PracticeProblem.Platform.GeeksForGeeks;

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
