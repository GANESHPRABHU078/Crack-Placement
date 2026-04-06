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
    private final ProjectIdeaRepository projectIdeaRepository;
    private final ProjectStepRepository projectStepRepository;
    private final PracticeProgressRepository practiceProgressRepository;

    public DataSeeder(
            JobRepository jobRepository,
            AptitudeQuestionRepository aptitudeQuestionRepository,
            InterviewExperienceRepository interviewExperienceRepository,
            MockInterviewRepository mockInterviewRepository,
            PracticeTopicRepository practiceTopicRepository,
            PracticeProblemRepository practiceProblemRepository,
            CompanyPrepProfileRepository companyPrepProfileRepository,
            ProjectIdeaRepository projectIdeaRepository,
            ProjectStepRepository projectStepRepository,
            PracticeProgressRepository practiceProgressRepository
    ) {
        this.jobRepository = jobRepository;
        this.aptitudeQuestionRepository = aptitudeQuestionRepository;
        this.interviewExperienceRepository = interviewExperienceRepository;
        this.mockInterviewRepository = mockInterviewRepository;
        this.practiceTopicRepository = practiceTopicRepository;
        this.practiceProblemRepository = practiceProblemRepository;
        this.companyPrepProfileRepository = companyPrepProfileRepository;
        this.projectIdeaRepository = projectIdeaRepository;
        this.projectStepRepository = projectStepRepository;
        this.practiceProgressRepository = practiceProgressRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (jobRepository.count() < 20) {
            jobRepository.deleteAll();
            jobRepository.flush();
            seedJobs();
            log.info("Seeded real 2026 job openings.");
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
        if (practiceTopicRepository.count() < 15 || practiceProblemRepository.count() < 300) {
            // Drop dependent entities first to avoid foreign key constraints during delete
            practiceProgressRepository.deleteAll();
            practiceProgressRepository.flush();
            
            companyPrepProfileRepository.deleteAll();
            companyPrepProfileRepository.flush();
            
            practiceProblemRepository.deleteAll();
            practiceProblemRepository.flush();
            
            practiceTopicRepository.deleteAll();
            practiceTopicRepository.flush();
            
            seedPracticeContent();
            log.info("Seeded 300+ real-world practice problems.");
        } else {
            log.info("Practice content already exists, skipping reseed.");
        }
        
        if (companyPrepProfileRepository.count() == 0) {
            seedCompanyPrepContent();
            log.info("Synced company prep content.");
        } else {
            log.info("Company prep content already exists, skipping.");
        }

        if (projectIdeaRepository.count() == 0) {
            seedProjectIdeas();
            log.info("Seeded 15+ real-world project ideas.");
        }
    }

    private void seedJobs() {
        List<Job> jobs = Arrays.asList(
            // --- FULL-TIME SDE-1 ROLES (2025/2026 GRADS) ---
            Job.builder().title("SDE-I (Trust Sensitive Content)").company("Amazon").logoEmoji("📦").location("Chennai, India").type(Job.JobType.FullTime).salary("18-32 LPA").skills(Arrays.asList("Java", "OOD", "Python", "DSA")).isNew(true).applyLink("https://www.amazon.jobs/en/jobs/10382563/sde-i-trust-sensitive-content-intelligence").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer (Early Career)").company("Google").logoEmoji("🔍").location("Bengaluru, India").type(Job.JobType.FullTime).salary("28-45 LPA").skills(Arrays.asList("Java", "C++", "Distributed Systems", "DSA")).isNew(true).applyLink("https://careers.google.com/jobs/results/95785531123606214-software-engineer-persistent-disk-phd-early-career-2026").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer (New Grad)").company("Microsoft").logoEmoji("💻").location("Hyderabad, India").type(Job.JobType.FullTime).salary("16-28 LPA").skills(Arrays.asList("C#", ".NET", "Azure", "TypeScript")).isNew(true).applyLink("https://jobs.careers.microsoft.com/global/en/search?lc=India&exp=Students%20and%20graduates&q=Software%20Engineer").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Graduate Software Engineer (2026)").company("Atlassian").logoEmoji("🇦").location("Bengaluru, India").type(Job.JobType.FullTime).salary("22-35 LPA").skills(Arrays.asList("React", "Java", "Go", "Design Patterns")).isNew(true).applyLink("https://www.atlassian.com/company/careers/all-jobs?city=Bengaluru&team=Engineering").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer I").company("Adobe").logoEmoji("🅰️").location("Noida, India").type(Job.JobType.FullTime).salary("15-26 LPA").skills(Arrays.asList("C++", "Graphics", "Algorithms")).isNew(true).applyLink("https://adobe.wd5.myworkdayjobs.com/university_grads").postedAt(LocalDateTime.now().minusDays(1)).build(),
            Job.builder().title("Backend SDE-I").company("Zomato").logoEmoji("🛵").location("Gurugram, India").type(Job.JobType.FullTime).salary("12-22 LPA").skills(Arrays.asList("Python", "Golang", "Redis", "Microservices")).isNew(true).applyLink("https://www.zomato.com/careers/jobs?category=Engineering").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("SDE-I (Logistics)").company("Swiggy").logoEmoji("🍱").location("Bengaluru, India").type(Job.JobType.FullTime).salary("14-25 LPA").skills(Arrays.asList("Java", "Spring Boot", "Kafka")).isNew(false).applyLink("https://careers.swiggy.com/#/engineering").postedAt(LocalDateTime.now().minusDays(2)).build(),
            Job.builder().title("Software Engineer (Backend)").company("PhonePe").logoEmoji("💜").location("Pune/Remote").type(Job.JobType.FullTime).salary("16-28 LPA").skills(Arrays.asList("Java", "PostgreSQL", "Kafka")).isNew(true).applyLink("https://www.phonepe.com/careers/jobs/").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer (Fintech)").company("Razorpay").logoEmoji("💳").location("Bengaluru, India").type(Job.JobType.FullTime).salary("15-24 LPA").skills(Arrays.asList("PHP", "Golang", "Payments API")).isNew(true).applyLink("https://razorpay.com/jobs/jobs-all/").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer I").company("Uber").logoEmoji("🚗").location("Hyderabad, India").type(Job.JobType.FullTime).salary("22-38 LPA").skills(Arrays.asList("Java", "Go", "System Design")).isNew(true).applyLink("https://www.uber.com/global/en/careers/list/?location=IND--India").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Technical Graduate").company("Cisco").logoEmoji("🌉").location("Bengaluru, India").type(Job.JobType.FullTime).salary("14-25 LPA").skills(Arrays.asList("Networking", "C", "Python")).isNew(true).applyLink("https://jobs.cisco.com/jobs/SearchJobs/?21171=%5B164%5D&21181=%5B186%5D").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer 1").company("Wells Fargo").logoEmoji("🏦").location("Hyderabad, India").type(Job.JobType.FullTime).salary("12-20 LPA").skills(Arrays.asList("Java", "Spring", "SQL")).isNew(false).applyLink("https://www.wellsfargojobs.com/en/search-jobs/?k=Software%20Engineer&l=India").postedAt(LocalDateTime.now().minusWeeks(1)).build(),
            Job.builder().title("Software Engineer").company("JP Morgan Chase").logoEmoji("🏙️").location("Bengaluru, India").type(Job.JobType.FullTime).salary("15-24 LPA").skills(Arrays.asList("Java", "React", "Cloud")).isNew(true).applyLink("https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/requisitions?keyword=SWE&location=India").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("New Analyst (Technology)").company("Goldman Sachs").logoEmoji("💰").location("Bengaluru, India").type(Job.JobType.FullTime).salary("20-35 LPA").skills(Arrays.asList("Java", "C++", "Finance Algorithms")).isNew(true).applyLink("https://www.goldmansachs.com/careers/students/programs/india/new-analyst-program.html").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineer").company("Intuit").logoEmoji("📑").location("Bengaluru, India").type(Job.JobType.FullTime).salary("20-32 LPA").skills(Arrays.asList("Java", "AWS", "Machine Learning")).isNew(true).applyLink("https://jobs.intuit.com/search-jobs?k=Software%20Engineer&l=India").postedAt(LocalDateTime.now()).build(),

            // --- INTERNSHIP ROLES (SUMMER 2025/2026) ---
            Job.builder().title("SWE Intern 2025").company("Google").logoEmoji("🔍").location("Bengaluru/Pune").type(Job.JobType.Internship).salary("80k-1.2L per mo").skills(Arrays.asList("Java/C++/Python", "DSA Mastery", "Curiosity")).isNew(true).applyLink("https://careers.google.com/jobs/results/?distance=50&hl=en_US&jex=INTERN&location=India&q=Software%20Engineer").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("SDE Intern 2025").company("Amazon").logoEmoji("📦").location("Remote/Bengaluru").type(Job.JobType.Internship).salary("60k-1L per mo").skills(Arrays.asList("C++", "Java", "Linux Foundations")).isNew(true).applyLink("https://www.amazon.jobs/en/search?base_query=Intern&loc_query=India").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Intern").company("Microsoft").logoEmoji("💻").location("Hyderabad, India").type(Job.JobType.Internship).salary("1L+ per mo").skills(Arrays.asList("C#", "Algorithm Design", "Collaboration")).isNew(true).applyLink("https://jobs.careers.microsoft.com/global/en/search?lc=India&exp=Students%20and%20graduates&q=Intern").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Product Intern (Technical)").company("Adobe").logoEmoji("🅰️").location("Bengaluru/Noida").type(Job.JobType.Internship).salary("70k-1L per mo").skills(Arrays.asList("Web Technologies", "Java", "Creative Problem Solving")).isNew(true).applyLink("https://adobe.wd5.myworkdayjobs.com/university_grads?locations=939e6ad291f04f218731118f62f3ca69").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Technical Intern").company("Cisco").logoEmoji("🌉").location("Bengaluru, India").type(Job.JobType.Internship).salary("50k-80k per mo").skills(Arrays.asList("Python", "Networks", "Embedded Systems")).isNew(true).applyLink("https://jobs.cisco.com/jobs/SearchJobs/?21171=%5B169482%5D&21181=%5B186%5D").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Developer Intern").company("Oracle").logoEmoji("🏢").location("Bengaluru/GIFT City").type(Job.JobType.Internship).salary("40k-70k per mo").skills(Arrays.asList("Java", "SQL", "Database Internals")).isNew(true).applyLink("https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/jobsearch/requisitions?keyword=Intern&location=India").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Intern (Summer 2025)").company("JP Morgan Chase").logoEmoji("🏙️").location("Mumbai/Hyderabad").type(Job.JobType.Internship).salary("75k-90k per mo").skills(Arrays.asList("Java", "Spring Boot", "Analytical Thinking")).isNew(true).applyLink("https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/requisitions?keyword=Intern&location=India").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Summer Analyst (Tech)").company("Goldman Sachs").logoEmoji("💰").location("Bengaluru/Hyderabad").type(Job.JobType.Internship).salary("1L+ per mo").skills(Arrays.asList("Algorithms", "Finance Math", "Development")).isNew(true).applyLink("https://www.goldmansachs.com/careers/students/programs/india/summer-analyst-program.html").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Engineering Intern").company("Salesforce").logoEmoji("☁️").location("Bengaluru/Gurugram").type(Job.JobType.Internship).salary("80k-1.2L per mo").skills(Arrays.asList("Cloud Computing", "Java/JS", "Problem Solving")).isNew(true).applyLink("https://salesforce.wd12.myworkdayjobs.com/External_Career_Site?q=Intern&locations=ed0615967f67100806495be24b230000").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Summer Analyst Intern").company("Morgan Stanley").logoEmoji("📉").location("Mumbai/Bengaluru").type(Job.JobType.Internship).salary("90k-1.1L per mo").skills(Arrays.asList("Java", "Scripting", "Quantitative Analysis")).isNew(true).applyLink("https://www.morganstanley.com/careers/students-graduates/programs/institutional-securities/technology/summer-analyst-india").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Analyst Intern").company("DE Shaw").logoEmoji("📈").location("Hyderabad, India").type(Job.JobType.Internship).salary("1.5L+ per mo").skills(Arrays.asList("Python", "Optimization", "High Performance Systems")).isNew(true).applyLink("https://www.deshawindia.com/careers/internships").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Product Development Intern").company("Sprinklr").logoEmoji("🔴").location("Bengaluru/Gurugram").type(Job.JobType.Internship).salary("80k+ per mo").skills(Arrays.asList("Java", "Scale Systems", "DSA")).isNew(true).applyLink("https://www.sprinklr.com/careers/jobs/").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Quant Intern").company("Tower Research").logoEmoji("🗼").location("Gurugram/Remote").type(Job.JobType.Internship).salary("2L+ per mo").skills(Arrays.asList("C++", "Python", "Probabilistic Thinking")).isNew(true).applyLink("https://www.tower-research.com/careers").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Engineering Intern").company("Arcesium").logoEmoji("🌐").location("Hyderabad/Remote").type(Job.JobType.Internship).salary("60k-90k per mo").skills(Arrays.asList("Java", "Distributed Systems", "SQL")).isNew(true).applyLink("https://www.arcesium.com/careers/").postedAt(LocalDateTime.now()).build(),
            Job.builder().title("Software Engineering Intern").company("PayPal").logoEmoji("🅿️").location("Bengaluru/Chennai").type(Job.JobType.Internship).salary("60k-85k per mo").skills(Arrays.asList("Java", "Security", "Web Services")).isNew(true).applyLink("https://jobsearch.paypal-corp.com/en-US/search?keywords=Intern&location=India").postedAt(LocalDateTime.now()).build()
        );
        jobRepository.saveAll(jobs);
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

        // 300+ Industry-Standard Problems (Blind 75 & Top 100)
        practiceProblemRepository.saveAll(List.of(
            // Arrays (1-21)
            problem(1, arrays, "Two Sum", Easy, LeetCode, "https://leetcode.com/problems/two-sum/", "Hash map lookup for complement values."),
            problem(2, arrays, "Best Time to Buy and Sell Stock", Easy, LeetCode, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Track minimum price and max profit in one pass."),
            problem(3, arrays, "Contains Duplicate", Easy, LeetCode, "https://leetcode.com/problems/contains-duplicate/", "Use a hash set to detect duplicate elements."),
            problem(4, arrays, "Product of Array Except Self", Medium, LeetCode, "https://leetcode.com/problems/product-of-array-except-self/", "Prefix and suffix product strategy."),
            problem(5, arrays, "Maximum Subarray (Kadane's)", Medium, LeetCode, "https://leetcode.com/problems/maximum-subarray/", "Dynamic subarray sum tracking."),
            problem(6, arrays, "Maximum Product Subarray", Medium, LeetCode, "https://leetcode.com/problems/maximum-product-subarray/", "Track both max and min products."),
            problem(7, arrays, "Merge Sorted Array", Easy, LeetCode, "https://leetcode.com/problems/merge-sorted-array/", "Merge from the back to avoid extra space."),
            problem(8, arrays, "Sort Colors", Medium, LeetCode, "https://leetcode.com/problems/sort-colors/", "Dutch National Flag algorithm for three-way partitioning."),
            problem(9, arrays, "Majority Element", Easy, LeetCode, "https://leetcode.com/problems/majority-element/", "Boyer-Moore Voting Algorithm."),
            problem(10, arrays, "Move Zeroes", Easy, LeetCode, "https://leetcode.com/problems/move-zeroes/", "In-place shift zeroes to the end."),
            problem(11, arrays, "Rotate Array", Medium, LeetCode, "https://leetcode.com/problems/rotate-array/", "Reverse parts of the array to rotate."),
            problem(12, arrays, "Find the Duplicate Number", Medium, LeetCode, "https://leetcode.com/problems/find-the-duplicate-number/", "Floyd's Cycle-Finding Algorithm on indices."),
            problem(13, arrays, "Set Matrix Zeroes", Medium, LeetCode, "https://leetcode.com/problems/set-matrix-zeroes/", "Use first row and column as markers."),
            problem(14, arrays, "Spiral Matrix", Medium, LeetCode, "https://leetcode.com/problems/spiral-matrix/", "Layer-by-layer traversal order."),
            problem(15, arrays, "Pascal's Triangle", Easy, LeetCode, "https://leetcode.com/problems/pascals-triangle/", "Generate rows based on previous row sums."),
            problem(16, arrays, "4Sum", Medium, LeetCode, "https://leetcode.com/problems/4sum/", "Reduce to 3Sum using sorting and nested loops."),
            problem(17, arrays, "Missing Number", Easy, LeetCode, "https://leetcode.com/problems/missing-number/", "XOR or sum-based mathematical approach."),
            problem(18, arrays, "First Missing Positive", Hard, LeetCode, "https://leetcode.com/problems/first-missing-positive/", "In-place hashing with array indices."),
            problem(19, arrays, "Subarray Sum Equals K", Medium, LeetCode, "https://leetcode.com/problems/subarray-sum-equals-k/", "Prefix sums with frequency hash map."),
            problem(20, arrays, "Longest Consecutive Sequence", Medium, LeetCode, "https://leetcode.com/problems/longest-consecutive-sequence/", "Hash set with intelligent start detection."),
            problem(21, arrays, "Max Consecutive Ones", Easy, LeetCode, "https://leetcode.com/problems/max-consecutive-ones/", "Simple counter for binary sequences."),

            // Strings (22-42)
            problem(22, strings, "Valid Anagram", Easy, LeetCode, "https://leetcode.com/problems/valid-anagram/", "Compare frequency counts efficiently."),
            problem(23, strings, "Group Anagrams", Medium, LeetCode, "https://leetcode.com/problems/group-anagrams/", "Map sorted versions of strings to group them."),
            problem(24, strings, "Valid Palindrome", Easy, LeetCode, "https://leetcode.com/problems/valid-palindrome/", "Clean strings and check symmetric characters."),
            problem(25, strings, "Longest Palindromic Substring", Medium, LeetCode, "https://leetcode.com/problems/longest-palindromic-substring/", "Expand from center for each character."),
            problem(26, strings, "Longest Repeating Character Replacement", Medium, LeetCode, "https://leetcode.com/problems/longest-repeating-character-replacement/", "Sliding window with frequency tracking."),
            problem(27, strings, "Palindromic Substrings", Medium, LeetCode, "https://leetcode.com/problems/palindromic-substrings/", "Count palindromes using expansion logic."),
            problem(28, strings, "Reverse a String", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/reverse-a-string/1", "Classic string manipulation warmup."),
            problem(29, strings, "Longest Common Prefix", Easy, LeetCode, "https://leetcode.com/problems/longest-common-prefix/", "Horizontal or vertical scanning."),
            problem(30, strings, "Reverse Words in a String", Medium, LeetCode, "https://leetcode.com/problems/reverse-words-in-a-string/", "Tokenize and reverse word order."),
            problem(31, strings, "String to Integer (atoi)", Medium, LeetCode, "https://leetcode.com/problems/string-to-integer-atoi/", "Handle whitespace, signs, and overflow."),
            problem(32, strings, "Multiply Strings", Medium, LeetCode, "https://leetcode.com/problems/multiply-strings/", "Digit-by-digit simulation (no BigInt)."),
            problem(33, strings, "Count and Say", Medium, LeetCode, "https://leetcode.com/problems/count-and-say/", "Recursive string generation based on counts."),
            problem(34, strings, "Zigzag Conversion", Medium, LeetCode, "https://leetcode.com/problems/zigzag-conversion/", "Row-based string building."),
            problem(35, strings, "Repeated String Match", Medium, LeetCode, "https://leetcode.com/problems/repeated-string-match/", "Minimum repetitions for substring matching."),
            problem(36, strings, "Valid Parentheses", Easy, LeetCode, "https://leetcode.com/problems/valid-parentheses/", "Matching nested brackets using a stack."),
            problem(37, strings, "Decode String", Medium, LeetCode, "https://leetcode.com/problems/decode-string/", "Nested expansion using stack simulation."),
            problem(38, strings, "Basic Calculator II", Medium, LeetCode, "https://leetcode.com/problems/basic-calculator-ii/", "Arithmetic expression evaluation with precedence."),
            problem(39, strings, "Compare Version Numbers", Medium, LeetCode, "https://leetcode.com/problems/compare-version-numbers/", "Revision-by-revision numerical comparison."),
            problem(40, strings, "Longest Palindromic Concatenation", Medium, LeetCode, "https://leetcode.com/problems/longest-palindrome-by-concatenating-two-letter-words/", "Pair matching with two-letter strings."),
            problem(41, strings, "Word Subsets", Medium, LeetCode, "https://leetcode.com/problems/word-subsets/", "Maximum frequency map requirements."),
            problem(42, strings, "Reverse String II", Easy, LeetCode, "https://leetcode.com/problems/reverse-string-ii/", "Periodic reversal in chunks of K.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Two Pointers (43-63)
            problem(43, twoPointers, "3Sum", Medium, LeetCode, "https://leetcode.com/problems/3sum/", "Sort and use two pointers to find unique triplets."),
            problem(44, twoPointers, "Container With Most Water", Medium, LeetCode, "https://leetcode.com/problems/container-with-most-water/", "A greedy approach using two pointers starting from ends."),
            problem(45, twoPointers, "Trapping Rain Water", Hard, LeetCode, "https://leetcode.com/problems/trapping-rain-water/", "Calculate elevation trap using pointers."),
            problem(46, twoPointers, "Remove Element", Easy, LeetCode, "https://leetcode.com/problems/remove-element/", "Overwrite elements using two-pointer strategy."),
            problem(47, twoPointers, "Squaring a Sorted Array", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1", "Compare squares from both ends of the array."),
            problem(48, twoPointers, "Valid Palindrome II", Easy, LeetCode, "https://leetcode.com/problems/valid-palindrome-ii/", "One deletion allowed check."),
            problem(49, twoPointers, "Two Sum II - Input Array Is Sorted", Medium, LeetCode, "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "Standard two-pointer search."),
            problem(50, twoPointers, "3Sum Closest", Medium, LeetCode, "https://leetcode.com/problems/3sum-closest/", "Variation of 3Sum with proximity tracking."),
            problem(51, twoPointers, "Sort Colors", Medium, LeetCode, "https://leetcode.com/problems/sort-colors/", "Partitioning with low/mid/high pointers."),
            problem(52, twoPointers, "Remove Duplicates from Sorted Array II", Medium, LeetCode, "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/", "Allow at most two duplicates in-place."),
            problem(53, twoPointers, "Sorted Squares", Easy, LeetCode, "https://leetcode.com/problems/squares-of-a-sorted-array/", "Merge logic with squared values."),
            problem(54, twoPointers, "Intersection of Two Arrays", Easy, LeetCode, "https://leetcode.com/problems/intersection-of-two-arrays/", "Two pointers on sorted arrays or hash sets."),
            problem(55, twoPointers, "Reverse Vowels of a String", Easy, LeetCode, "https://leetcode.com/problems/reverse-vowels-of-a-string/", "Symmetric vowel swapping."),
            problem(56, twoPointers, "Merge Sorted Array", Easy, LeetCode, "https://leetcode.com/problems/merge-sorted-array/", "Filling from the back of the destination array."),
            problem(57, twoPointers, "Interval List Intersections", Medium, LeetCode, "https://leetcode.com/problems/interval-list-intersections/", "Pointer management across two lists of intervals."),
            problem(58, twoPointers, "Backspace String Compare", Easy, LeetCode, "https://leetcode.com/problems/backspace-string-compare/", "Traverse from back to handle deletions in O(1) space."),
            problem(59, twoPointers, "Minimum Size Subarray Sum", Medium, LeetCode, "https://leetcode.com/problems/minimum-size-subarray-sum/", "Two pointers defining a dynamic range."),
            problem(60, twoPointers, "Pairs with Specific Difference", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/pairs-with-specific-difference/1", "Binary search or two-pointer approach on sorted data."),
            problem(61, twoPointers, "Middle of the Linked List", Easy, LeetCode, "https://leetcode.com/problems/middle-of-the-linked-list/", "Fast and slow pointer movement."),
            problem(62, twoPointers, "Linked List Cycle II", Medium, LeetCode, "https://leetcode.com/problems/linked-list-cycle-ii/", "Find the entry point of the cycle."),
            problem(63, twoPointers, "Bag of Tokens", Medium, LeetCode, "https://leetcode.com/problems/bag-of-tokens/", "Greedy strategy with two pointers."),

            // Sliding Window (64-84)
            problem(64, slidingWindow, "Longest Substring Without Repeating Characters", Medium, LeetCode, "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "Dynamic window with unique character tracking."),
            problem(65, slidingWindow, "Minimum Window Substring", Hard, LeetCode, "https://leetcode.com/problems/minimum-window-substring/", "Complex window logic with character mapping."),
            problem(66, slidingWindow, "Sliding Window Maximum", Hard, LeetCode, "https://leetcode.com/problems/sliding-window-maximum/", "Use a deque to find max in window efficiently."),
            problem(67, slidingWindow, "Permutation in String", Medium, LeetCode, "https://leetcode.com/problems/permutation-in-string/", "Fixed window frequency check."),
            problem(68, slidingWindow, "Minimum Size Subarray Sum", Medium, LeetCode, "https://leetcode.com/problems/minimum-size-subarray-sum/", "Expand/contract window to meet sum target."),
            problem(69, slidingWindow, "Longest Subarray with sum at most K", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/longest-subarray-with-sum-at-most-k/1", "Classic GFG sliding window problem."),
            problem(70, slidingWindow, "Subarrays with K Different Integers", Hard, LeetCode, "https://leetcode.com/problems/subarrays-with-k-different-integers/", "Exact K counts using window subtraction."),
            problem(71, slidingWindow, "Fruit Into Baskets", Medium, LeetCode, "https://leetcode.com/problems/fruit-into-baskets/", "At most two types of elements in window."),
            problem(72, slidingWindow, "Max Consecutive Ones III", Medium, LeetCode, "https://leetcode.com/problems/max-consecutive-ones-iii/", "Allowing K flips within window."),
            problem(73, slidingWindow, "Grumpy Bookstore Owner", Medium, LeetCode, "https://leetcode.com/problems/grumpy-bookstore-owner/", "Maximize satisfaction during a fixed window boost."),
            problem(74, slidingWindow, "Longest Repeating Character Replacement", Medium, LeetCode, "https://leetcode.com/problems/longest-repeating-character-replacement/", "Track max frequency in window."),
            problem(75, slidingWindow, "Number of Subarrays with Bounded Maximum", Medium, LeetCode, "https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/", "Count subarrays where max falls in range."),
            problem(76, slidingWindow, "Maximum Points You Can Obtain from Cards", Medium, LeetCode, "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", "Sliding window on the remaining inner cards."),
            problem(77, slidingWindow, "Longest Continuous Subarray With Absolute Diff <= Limit", Medium, LeetCode, "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/", "Monotonic deques for min/max tracking."),
            problem(78, slidingWindow, "Minimum Swaps to Group All 1's Together", Medium, LeetCode, "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together/", "Fixed window size equal to total 1s."),
            problem(79, slidingWindow, "Longest Substring with At Most K Distinct Characters", Medium, LeetCode, "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/", "Dynamic window with character map."),
            problem(80, slidingWindow, "Smallest window in a string containing all characters of another string", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1", "Complex GFG window counterpart."),
            problem(81, slidingWindow, "Repeated DNA Sequences", Medium, LeetCode, "https://leetcode.com/problems/repeated-dna-sequences/", "Hash-based fixed window sequence detection."),
            problem(82, slidingWindow, "Longest Substring with At Most Two Distinct Characters", Medium, LeetCode, "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/", "Classic variation of K-distinct."),
            problem(83, slidingWindow, "Max Sum of Subarray of size K", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1", "Foundational fixed window sum."),
            problem(84, slidingWindow, "Binary Subarrays With Sum", Medium, LeetCode, "https://leetcode.com/problems/binary-subarrays-with-sum/", "Window-based sum tracking in binary array."),

            // Stack & Queues (85-105)
            problem(85, stack, "Valid Parentheses", Easy, LeetCode, "https://leetcode.com/problems/valid-parentheses/", "Use a stack for matching nested brackets."),
            problem(86, stack, "Min Stack", Medium, LeetCode, "https://leetcode.com/problems/min-stack/", "Keep track of min value alongside standard stack."),
            problem(87, stack, "Evaluate Reverse Polish Notation", Medium, LeetCode, "https://leetcode.com/problems/evaluate-reverse-polish-notation/", "Stack-based arithmetic simulation."),
            problem(88, stack, "Daily Temperatures", Medium, LeetCode, "https://leetcode.com/problems/daily-temperatures/", "Monotonic stack to find next warmer day."),
            problem(89, stack, "Next Greater Element I", Easy, LeetCode, "https://leetcode.com/problems/next-greater-element-i/", "Map monotonic stack results for O(1) lookup."),
            problem(90, stack, "Largest Rectangle in Histogram", Hard, LeetCode, "https://leetcode.com/problems/largest-rectangle-in-histogram/", "Monotonic stack identifying boundary heights."),
            problem(91, stack, "Implement Queue using Stacks", Easy, LeetCode, "https://leetcode.com/problems/implement-queue-using-stacks/", "Push vs Pop optimization strategies."),
            problem(92, stack, "Trapping Rain Water", Hard, LeetCode, "https://leetcode.com/problems/trapping-rain-water/", "Stack-based calculation of trapped volume."),
            problem(93, stack, "Decode String", Medium, LeetCode, "https://leetcode.com/problems/decode-string/", "Nested expansion using stack simulation."),
            problem(94, stack, "Simplify Path", Medium, LeetCode, "https://leetcode.com/problems/simplify-path/", "Process path components with stack push/pop."),
            problem(95, stack, "Next Greater Element II", Medium, LeetCode, "https://leetcode.com/problems/next-greater-element-ii/", "Circular array monotonic stack."),
            problem(96, stack, "Asteroid Collision", Medium, LeetCode, "https://leetcode.com/problems/asteroid-collision/", "Simulate collisions using stack lifo."),
            problem(97, stack, "Remove All Adjacent Duplicates in String II", Medium, LeetCode, "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/", "Count-based stack removal."),
            problem(98, stack, "Basic Calculator", Hard, LeetCode, "https://leetcode.com/problems/basic-calculator/", "Handle parenthetical arithmetic with stacks."),
            problem(99, stack, "Score of Parentheses", Medium, LeetCode, "https://leetcode.com/problems/score-of-parentheses/", "Calculating score based on nesting depth."),
            problem(100, stack, "Circular Queue Implementation", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/circular-queue-implementation/1", "Mastering ring buffer pointers."),
            problem(101, stack, "Stock Span Problem", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1", "Classic monotonic stack application."),
            problem(102, stack, "Online Stock Span", Medium, LeetCode, "https://leetcode.com/problems/online-stock-span/", "Stateful stack tracking for stream data."),
            problem(103, stack, "Validate Stack Sequences", Medium, LeetCode, "https://leetcode.com/problems/validate-stack-sequences/", "Simulation of push/pop operations."),
            problem(104, stack, "Remove K Digits", Medium, LeetCode, "https://leetcode.com/problems/remove-k-digits/", "Greedy removal using monotonic stack logic."),
            problem(105, stack, "Flatten Nested List Iterator", Medium, LeetCode, "https://leetcode.com/problems/flatten-nested-list-iterator/", "Stack-based lazy evaluation of lists.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Linked List (106-126)
            problem(106, linkedList, "Reverse Linked List", Easy, LeetCode, "https://leetcode.com/problems/reverse-linked-list/", "Standard iterative pointer rewiring."),
            problem(107, linkedList, "Linked List Cycle", Easy, LeetCode, "https://leetcode.com/problems/linked-list-cycle/", "Floyd's Tortoise and Hare detection."),
            problem(108, linkedList, "Merge Two Sorted Lists", Easy, LeetCode, "https://leetcode.com/problems/merge-two-sorted-lists/", "Recursive or iterative sorted merge."),
            problem(109, linkedList, "Remove Nth Node From End of List", Medium, LeetCode, "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", "Two pointers with fixed gap traversal."),
            problem(110, linkedList, "Reorder List", Medium, LeetCode, "https://leetcode.com/problems/reorder-list/", "Find middle, reverse half, and merge."),
            problem(111, linkedList, "Copy List with Random Pointer", Medium, LeetCode, "https://leetcode.com/problems/copy-list-with-random-pointer/", "Iteration with deep copy or hash map mapping."),
            problem(112, linkedList, "Add Two Numbers", Medium, LeetCode, "https://leetcode.com/problems/add-two-numbers/", "Digit-by-digit simulation with carry handling."),
            problem(113, linkedList, "Intersection of Two Linked Lists", Easy, LeetCode, "https://leetcode.com/problems/intersection-of-two-linked-lists/", "Align pointers by calculating length difference."),
            problem(114, linkedList, "Palindrome Linked List", Easy, LeetCode, "https://leetcode.com/problems/palindrome-linked-list/", "Reverse second half and compare with first half."),
            problem(115, linkedList, "Linked List Cycle II", Medium, LeetCode, "https://leetcode.com/problems/linked-list-cycle-ii/", "Identify the start of the loop cycle."),
            problem(116, linkedList, "Odd Even Linked List", Medium, LeetCode, "https://leetcode.com/problems/odd-even-linked-list/", "Group nodes by index parity in-place."),
            problem(117, linkedList, "Sort List", Medium, LeetCode, "https://leetcode.com/problems/sort-list/", "Implement Merge Sort on linked structure."),
            problem(118, linkedList, "Reverse Nodes in k-Group", Hard, LeetCode, "https://leetcode.com/problems/reverse-nodes-in-k-group/", "Recursive chunked reversal logic."),
            problem(119, linkedList, "Rotate List", Medium, LeetCode, "https://leetcode.com/problems/rotate-list/", "Connect tail to head and find the new break point."),
            problem(120, linkedList, "Partition List", Medium, LeetCode, "https://leetcode.com/problems/partition-list/", "Maintain two separate chains for less/greater values."),
            problem(121, linkedList, "Merge k Sorted Lists", Hard, LeetCode, "https://leetcode.com/problems/merge-k-sorted-lists/", "Use a min-priority queue for k-way merge."),
            problem(122, linkedList, "LRU Cache", Medium, LeetCode, "https://leetcode.com/problems/lru-cache/", "Combine hash map with a doubly linked list."),
            problem(123, linkedList, "Flatten a Multilevel Doubly Linked List", Medium, LeetCode, "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/", "DFS traversal for depth-first flattening."),
            problem(124, linkedList, "Swap Nodes in Pairs", Medium, LeetCode, "https://leetcode.com/problems/swap-nodes-in-pairs/", "Recursive swapping of adjacent node blocks."),
            problem(125, linkedList, "Reverse Linked List II", Medium, LeetCode, "https://leetcode.com/problems/reverse-linked-list-ii/", "Reverse a sub-portion identified by indices."),
            problem(126, linkedList, "Middle of the Linked List", Easy, LeetCode, "https://leetcode.com/problems/middle-of-the-linked-list/", "Fast and slow pointer approach for midpoint.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Binary Search (127-147)
            problem(127, binarySearch, "Search in Rotated Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/search-in-rotated-sorted-array/", "BS identifying sorted halves in rotation."),
            problem(128, binarySearch, "Search a 2D Matrix", Medium, LeetCode, "https://leetcode.com/problems/search-a-2d-matrix/", "Treat 2D matrix as flattened 1D array for BS."),
            problem(129, binarySearch, "Koko Eating Bananas", Medium, LeetCode, "https://leetcode.com/problems/koko-eating-bananas/", "BS on answer: search for minimum speed."),
            problem(130, binarySearch, "Median of Two Sorted Arrays", Hard, LeetCode, "https://leetcode.com/problems/median-of-two-sorted-arrays/", "Advanced BS partitioning logic."),
            problem(131, binarySearch, "Find Minimum in Rotated Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", "Detect rotation pivot using BS."),
            problem(132, binarySearch, "Square Root of an integer", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/square-root/1", "BS within [0, x] range."),
            problem(133, binarySearch, "Binary Search", Easy, LeetCode, "https://leetcode.com/problems/binary-search/", "The foundational sorted search algorithm."),
            problem(134, binarySearch, "Find First and Last Position of Element in Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", "Two binary searches for low/high bounds."),
            problem(135, binarySearch, "Search Insert Position", Easy, LeetCode, "https://leetcode.com/problems/search-insert-position/", "Find position to maintain sorted order."),
            problem(136, binarySearch, "Single Element in a Sorted Array", Medium, LeetCode, "https://leetcode.com/problems/single-element-in-a-sorted-array/", "BS using even/odd index logic."),
            problem(137, binarySearch, "Capacity To Ship Packages Within D Days", Medium, LeetCode, "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", "BS on weight capacity answer space."),
            problem(138, binarySearch, "Split Array Largest Sum", Hard, LeetCode, "https://leetcode.com/problems/split-array-largest-sum/", "BS on the sum range to minimize max."),
            problem(139, binarySearch, "Aggressive Cows", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/aggressive-cows/1", "Classical BS on distance approach."),
            problem(140, binarySearch, "Allocate Minimum Number of Pages", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1", "Complex GFG book allocation problem."),
            problem(141, binarySearch, "H-Index II", Medium, LeetCode, "https://leetcode.com/problems/h-index-ii/", "Find citation threshold using sorted data."),
            problem(142, binarySearch, "Valid Perfect Square", Easy, LeetCode, "https://leetcode.com/problems/valid-perfect-square/", "BS on the range [1, num]."),
            problem(143, binarySearch, "Find Peak Element", Medium, LeetCode, "https://leetcode.com/problems/find-peak-element/", "Iterative BS to find local maxima."),
            problem(144, binarySearch, "Peak Index in a Mountain Array", Medium, LeetCode, "https://leetcode.com/problems/peak-index-in-a-mountain-array/", "Single peak detection in uni-modal array."),
            problem(145, binarySearch, "Smallest Letter Greater Than Target", Easy, LeetCode, "https://leetcode.com/problems/find-smallest-letter-greater-than-target/", "BS on characters with wrap-around."),
            problem(146, binarySearch, "Find K Closest Elements", Medium, LeetCode, "https://leetcode.com/problems/find-k-closest-elements/", "BS to find window start location."),
            problem(147, binarySearch, "Search in Rotated Sorted Array II", Medium, LeetCode, "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/", "Handling duplicates in rotated BS."),

            // Trees (148-168)
            problem(148, trees, "Invert Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/invert-binary-tree/", "Classic recursive swap of left and right children."),
            problem(149, trees, "Maximum Depth of Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/maximum-depth-of-binary-tree/", "Calculate tree height using recursion."),
            problem(150, trees, "Same Tree", Easy, LeetCode, "https://leetcode.com/problems/same-tree/", "Recursive structural equality check."),
            problem(151, trees, "Binary Tree Level Order Traversal", Medium, LeetCode, "https://leetcode.com/problems/binary-tree-level-order-traversal/", "BFS by processing nodes level by level."),
            problem(152, trees, "Lowest Common Ancestor of a BST", Medium, LeetCode, "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", "Ancestor detection using BST properties."),
            problem(153, trees, "Validate Binary Search Tree", Medium, LeetCode, "https://leetcode.com/problems/validate-binary-search-tree/", "Range verification for all nodes."),
            problem(154, trees, "Binary Tree Maximum Path Sum", Hard, LeetCode, "https://leetcode.com/problems/binary-tree-maximum-path-sum/", "Track global max sum during recursive post-order traversal."),
            problem(155, trees, "Symmetric Tree", Easy, LeetCode, "https://leetcode.com/problems/symmetric-tree/", "Recursive mirror-image verification."),
            problem(156, trees, "Binary Tree Zigzag Level Order Traversal", Medium, LeetCode, "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", "BFS with alternating level scan direction."),
            problem(157, trees, "Construct Binary Tree from Preorder and Inorder Traversal", Medium, LeetCode, "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", "Recursive mapping to rebuild tree structure."),
            problem(158, trees, "Populating Next Right Pointers in Each Node", Medium, LeetCode, "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", "Iterative level logic without extra space."),
            problem(159, trees, "Subtree of Another Tree", Easy, LeetCode, "https://leetcode.com/problems/subtree-of-another-tree/", "Recursive check for identical tree branches."),
            problem(160, trees, "Binary Tree Right Side View", Medium, LeetCode, "https://leetcode.com/problems/binary-tree-right-side-view/", "DFS/BFS identifying last node of each level."),
            problem(161, trees, "Diameter of Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/diameter-of-binary-tree/", "Calculate longest path through any node."),
            problem(162, trees, "Balanced Binary Tree", Easy, LeetCode, "https://leetcode.com/problems/balanced-binary-tree/", "Height-balanced verification for all nodes."),
            problem(163, trees, "Path Sum", Easy, LeetCode, "https://leetcode.com/problems/path-sum/", "Check if root-to-leaf path equals target."),
            problem(164, trees, "Path Sum II", Medium, LeetCode, "https://leetcode.com/problems/path-sum-ii/", "Find all root-to-leaf paths equaling target."),
            problem(165, trees, "All Nodes Distance K in Binary Tree", Medium, LeetCode, "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/", "Multi-source BFS from target node."),
            problem(166, trees, "Serialize and Deserialize Binary Tree", Hard, LeetCode, "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", "String encoding/decoding of tree nodes."),
            problem(167, trees, "Count Good Nodes in Binary Tree", Medium, LeetCode, "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", "DFS tracking max value along the path."),
            problem(168, trees, "Binary Tree Inorder Traversal", Easy, LeetCode, "https://leetcode.com/problems/binary-tree-inorder-traversal/", "Standard left-root-right visit order.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Tries & Heaps (169-189)
            problem(169, tries, "Kth Largest Element in an Array", Medium, LeetCode, "https://leetcode.com/problems/kth-largest-element-in-an-array/", "Use a min-heap to track largest K elements."),
            problem(170, tries, "Top K Frequent Elements", Medium, LeetCode, "https://leetcode.com/problems/top-k-frequent-elements/", "Heap combined with frequency hash map."),
            problem(171, tries, "Find Median from Data Stream", Hard, LeetCode, "https://leetcode.com/problems/find-median-from-data-stream/", "Two heaps logic for real-time median tracking."),
            problem(172, tries, "Implement Trie (Prefix Tree)", Medium, LeetCode, "https://leetcode.com/problems/implement-trie-prefix-tree/", "Node-based prefix structure implementation."),
            problem(173, tries, "Merge k Sorted Lists", Hard, LeetCode, "https://leetcode.com/problems/merge-k-sorted-lists/", "Min-heap consolidating k sorted inputs."),
            problem(174, tries, "Word Search II", Hard, LeetCode, "https://leetcode.com/problems/word-search-ii/", "Optimized backtracking using a Trie for prefix lookup."),
            problem(175, tries, "Design Add and Search Words Data Structure", Medium, LeetCode, "https://leetcode.com/problems/design-add-and-search-words-data-structure/", "Trie with wildcard dot matching."),
            problem(176, tries, "Task Scheduler", Medium, LeetCode, "https://leetcode.com/problems/task-scheduler/", "Greedy frequency management with cooldowns."),
            problem(177, tries, "Sort Characters By Frequency", Medium, LeetCode, "https://leetcode.com/problems/sort-characters-by-frequency/", "Frequency map with priority queue sorting."),
            problem(178, tries, "Kth Smallest Element in a Sorted Matrix", Medium, LeetCode, "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/", "Heap or advanced BS on matrix range."),
            problem(179, tries, "Reorganize String", Medium, LeetCode, "https://leetcode.com/problems/reorganize-string/", "Heap-based adjacent char prevention."),
            problem(180, tries, "Find K Closest Elements", Medium, LeetCode, "https://leetcode.com/problems/find-k-closest-elements/", "Heap or two pointers search logic."),
            problem(181, tries, "Last Stone Weight", Easy, LeetCode, "https://leetcode.com/problems/last-stone-weight/", "Max-heap simulation of stone smashing."),
            problem(182, tries, "Map Sum Pairs", Medium, LeetCode, "https://leetcode.com/problems/map-sum-pairs/", "Trie where each node stores prefix sums."),
            problem(183, tries, "Top K Frequent Words", Medium, LeetCode, "https://leetcode.com/problems/top-k-frequent-words/", "Heap with lexical tie-breaking rules."),
            problem(184, tries, "Kth Largest Element in a Stream", Easy, LeetCode, "https://leetcode.com/problems/kth-largest-element-in-a-stream/", "Fixed-size min-heap for stream data."),
            problem(185, tries, "Smallest Range Covering Elements from K Lists", Hard, LeetCode, "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/", "Min-heap tracking current front of k lists."),
            problem(186, tries, "Replace Words", Medium, LeetCode, "https://leetcode.com/problems/replace-words/", "Trie-based prefix replacement."),
            problem(187, tries, "Construct Quad Tree", Medium, LeetCode, "https://leetcode.com/problems/construct-quad-tree/", "Non-linear trie structure for grid data."),
            problem(188, tries, "Serialize and Deserialize BST", Medium, LeetCode, "https://leetcode.com/problems/serialize-and-deserialize-bst/", "Efficient BST-specific string coding."),
            problem(189, tries, "Find K Pairs with Smallest Sums", Medium, LeetCode, "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/", "Heap consolidating k pair combinations."),

            // Backtracking (190-210)
            problem(190, backtracking, "Subsets", Medium, LeetCode, "https://leetcode.com/problems/subsets/", "Recursive decision tree: include or exclude element."),
            problem(191, backtracking, "Combinations", Medium, LeetCode, "https://leetcode.com/problems/combinations/", "Generate fixed-size groups within range."),
            problem(192, backtracking, "Permutations", Medium, LeetCode, "https://leetcode.com/problems/permutations/", "Generate all possible orderings of an array."),
            problem(193, backtracking, "Combination Sum", Medium, LeetCode, "https://leetcode.com/problems/combination-sum/", "Explore combinations matching target with reuse allowed."),
            problem(194, backtracking, "Word Search", Medium, LeetCode, "https://leetcode.com/problems/word-search/", "DFS grid traversal with backtracking verification."),
            problem(195, backtracking, "N-Queens", Hard, LeetCode, "https://leetcode.com/problems/n-queens/", "The vertical/diagonal placement problem on chessboard."),
            problem(196, backtracking, "Sudoku Solver", Hard, LeetCode, "https://leetcode.com/problems/sudoku-solver/", "Recursive grid completion with validation checks."),
            problem(197, backtracking, "Generate Parentheses", Medium, LeetCode, "https://leetcode.com/problems/generate-parentheses/", "Backtrack while maintaining valid balance counts."),
            problem(198, backtracking, "Letter Combinations of a Phone Number", Medium, LeetCode, "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", "Recursive mapping of digit sequences."),
            problem(199, backtracking, "Combination Sum II", Medium, LeetCode, "https://leetcode.com/problems/combination-sum-ii/", "Handle duplicates with sorting and skip logic."),
            problem(200, backtracking, "Permutations II", Medium, LeetCode, "https://leetcode.com/problems/permutations-ii/", "Unique orderings tracking with frequency map."),
            problem(201, backtracking, "Palindrome Partitioning", Medium, LeetCode, "https://leetcode.com/problems/palindrome-partitioning/", "Recursive slicing for palindromic segments."),
            problem(202, backtracking, "Combination Sum III", Medium, LeetCode, "https://leetcode.com/problems/combination-sum-iii/", "K-sized groups of specific sum target."),
            problem(203, backtracking, "Restore IP Addresses", Medium, LeetCode, "https://leetcode.com/problems/restore-ip-addresses/", "Four-part slicing with numerical range checks."),
            problem(204, backtracking, "Path with Maximum Gold", Medium, LeetCode, "https://leetcode.com/problems/path-with-maximum-gold/", "DFS in grid with value summation and back-marking."),
            problem(205, backtracking, "Beautiful Arrangement", Medium, LeetCode, "https://leetcode.com/problems/beautiful-arrangement/", "Conditional permutation exploration."),
            problem(206, backtracking, "Word Break II", Hard, LeetCode, "https://leetcode.com/problems/word-break-ii/", "String segmentation with memoized backtracking."),
            problem(207, backtracking, "Subsets II", Medium, LeetCode, "https://leetcode.com/problems/subsets-ii/", "Handling duplicate elements in power set generation."),
            problem(208, backtracking, "Smallest Sufficient Team", Hard, LeetCode, "https://leetcode.com/problems/smallest-sufficient-team/", "State-space search for skill coverage."),
            problem(209, backtracking, "Target Sum", Medium, LeetCode, "https://leetcode.com/problems/target-sum/", "DFS explore with sign options (+/-)."),
            problem(210, backtracking, "Matchsticks to Square", Medium, LeetCode, "https://leetcode.com/problems/matchsticks-to-square/", "Partitioning problem into 4 equal sum groups.")
        ));

        practiceProblemRepository.saveAll(List.of(
            // Graphs (211-231)
            problem(211, graphs, "Number of Islands", Medium, LeetCode, "https://leetcode.com/problems/number-of-islands/", "Count components using DFS or BFS grid traversal."),
            problem(212, graphs, "Clone Graph", Medium, LeetCode, "https://leetcode.com/problems/clone-graph/", "Deep copy using node-mapping and BFS/DFS."),
            problem(213, graphs, "Course Schedule", Medium, LeetCode, "https://leetcode.com/problems/course-schedule/", "Detect cycles in dependency graph (topological sort)."),
            problem(214, graphs, "Rotting Oranges", Medium, LeetCode, "https://leetcode.com/problems/rotting-oranges/", "Multi-source BFS identifying time to reach all nodes."),
            problem(215, graphs, "Pacific Atlantic Water Flow", Medium, LeetCode, "https://leetcode.com/problems/pacific-atlantic-water-flow/", "Reachability analysis from borders using DFS."),
            problem(216, graphs, "Word Ladder", Hard, LeetCode, "https://leetcode.com/problems/word-ladder/", "Shortest path in state-change graph via BFS."),
            problem(217, graphs, "Alien Dictionary", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/alien-dictionary/1", "Topological sort on character order constraints."),
            problem(218, graphs, "Course Schedule II", Medium, LeetCode, "https://leetcode.com/problems/course-schedule-ii/", "Return valid ordering for tasks with dependencies."),
            problem(219, graphs, "Redundant Connection", Medium, LeetCode, "https://leetcode.com/problems/redundant-connection/", "Union-Find to identify cycle-causing edges."),
            problem(220, graphs, "Connected Components Count", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/number-of-provinces/1", "Count isolated groups in adjacency structure."),
            problem(221, graphs, "Graph Valid Tree", Medium, LeetCode, "https://leetcode.com/discuss/general-discussion/655708/graph-valid-tree", "Check for connectivity and cycle absence."),
            problem(222, graphs, "Word Ladder II", Hard, LeetCode, "https://leetcode.com/problems/word-ladder-ii/", "Find all shortest transformation sequences."),
            problem(223, graphs, "Surrounded Regions", Medium, LeetCode, "https://leetcode.com/problems/surrounded-regions/", "Boundary-originated DFS to identify captured cells."),
            problem(224, graphs, "Reconstruct Itinerary", Hard, LeetCode, "https://leetcode.com/problems/reconstruct-itinerary/", "Hierholzer's algorithm for Eulerian path."),
            problem(225, graphs, "Min Cost to Connect All Points", Medium, LeetCode, "https://leetcode.com/problems/min-cost-to-connect-all-points/", "Kruskal's or Prim's algorithm for MST."),
            problem(226, graphs, "Network Delay Time", Medium, LeetCode, "https://leetcode.com/problems/network-delay-time/", "Dijkstra's for single-source shortest path."),
            problem(227, graphs, "Swim in Rising Water", Hard, LeetCode, "https://leetcode.com/problems/swim-in-rising-water/", "Modified Dijkstra on elevation grid."),
            problem(228, graphs, "Longest Increasing Path in a Matrix", Hard, LeetCode, "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", "DFS with memoization on grid cells."),
            problem(229, graphs, "Cheapest Flights Within K Stops", Medium, LeetCode, "https://leetcode.com/problems/cheapest-flights-within-k-stops/", "Bellman-Ford or BFS with level limiting."),
            problem(230, graphs, "Path with Minimum Effort", Medium, LeetCode, "https://leetcode.com/problems/path-with-minimum-effort/", "Binary Search on effort or Dijkstra."),
            problem(231, graphs, "Bipartite Graph Check", Medium, LeetCode, "https://leetcode.com/problems/is-graph-bipartite/", "Check 2-colorability using BFS/DFS."),

            // Dynamic Programming (232-252)
            problem(232, dp1, "Climbing Stairs", Easy, LeetCode, "https://leetcode.com/problems/climbing-stairs/", "Simple 1D recurrence relationship (Fibonacci)."),
            problem(233, dp1, "House Robber", Medium, LeetCode, "https://leetcode.com/problems/house-robber/", "Decision making: rob current vs skipping."),
            problem(234, dp1, "Coin Change", Medium, LeetCode, "https://leetcode.com/problems/coin-change/", "Find minimum coins to reach target amount."),
            problem(235, dp1, "Longest Increasing Subsequence", Medium, LeetCode, "https://leetcode.com/problems/longest-increasing-subsequence/", "Standard DP or BS-optimized sequence analysis."),
            problem(236, dp1, "Longest Common Subsequence", Medium, LeetCode, "https://leetcode.com/problems/longest-common-subsequence/", "2D matrix approach to sequence matching."),
            problem(237, dp1, "0-1 Knapsack Problem", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", "Foundational DP selection logic."),
            problem(238, dp1, "Unique Paths", Medium, LeetCode, "https://leetcode.com/problems/unique-paths/", "Calculating grid reachability permutations."),
            problem(239, dp1, "Word Break", Medium, LeetCode, "https://leetcode.com/problems/word-break/", "Check if string can be segmented into words."),
            problem(240, dp1, "Decode Ways", Medium, LeetCode, "https://leetcode.com/problems/decode-ways/", "Counting valid numeric-to-char mapped strings."),
            problem(241, dp1, "House Robber II", Medium, LeetCode, "https://leetcode.com/problems/house-robber-ii/", "DP on circular constraints (rob first or last)."),
            problem(242, dp1, "Palindromic Substrings", Medium, LeetCode, "https://leetcode.com/problems/palindromic-substrings/", "Count all substrings that are palindromes."),
            problem(243, dp1, "Longest Palindromic Substring", Medium, LeetCode, "https://leetcode.com/problems/longest-palindromic-substring/", "Find the largest symmetric string fragment."),
            problem(244, dp1, "Maximum Product Subarray", Medium, LeetCode, "https://leetcode.com/problems/maximum-product-subarray/", "Track min/max products due to negatives."),
            problem(245, dp1, "Partition Equal Subset Sum", Medium, LeetCode, "https://leetcode.com/problems/partition-equal-subset-sum/", "Subset sum variant of 0-1 knapsack."),
            problem(246, dp1, "Edit Distance", Hard, LeetCode, "https://leetcode.com/problems/edit-distance/", "Min operations to convert one string to another."),
            problem(247, dp1, "Best Time to Buy and Sell Stock with Cooldown", Medium, LeetCode, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", "State machine DP for stock trading."),
            problem(248, dp1, "Coin Change II", Medium, LeetCode, "https://leetcode.com/problems/coin-change-ii/", "Count total combinations to make target sum."),
            problem(249, dp1, "Target Sum", Medium, LeetCode, "https://leetcode.com/problems/target-sum/", "Plus/minus selection logic for target reach."),
            problem(250, dp1, "Interleaving String", Medium, LeetCode, "https://leetcode.com/problems/interleaving-string/", "2D DP validation of interleaved characters."),
            problem(251, dp1, "Distinct Subsequences", Hard, LeetCode, "https://leetcode.com/problems/distinct-subsequences/", "Count occurrences of S in T as subsequence."),
            problem(252, dp1, "Burst Balloons", Hard, LeetCode, "https://leetcode.com/problems/burst-balloons/", "Interval DP for maximizing balloon points."),

            // Bit Manipulation (253-273)
            problem(253, bits, "Single Number", Easy, LeetCode, "https://leetcode.com/problems/single-number/", "Find unique element using XOR properties."),
            problem(254, bits, "Number of 1 Bits", Easy, LeetCode, "https://leetcode.com/problems/number-of-1-bits/", "Count set bits using bit manipulation."),
            problem(255, bits, "Counting Bits", Easy, LeetCode, "https://leetcode.com/problems/counting-bits/", "Generate bit counts for O(n) scale."),
            problem(256, bits, "Missing Number", Easy, LeetCode, "https://leetcode.com/problems/missing-number/", "Find single outlier using XOR range logic."),
            problem(257, bits, "Reverse Bits", Easy, LeetCode, "https://leetcode.com/problems/reverse-bits/", "Binary digit reversal simulation."),
            problem(258, bits, "Sum of Two Integers", Medium, LeetCode, "https://leetcode.com/problems/sum-of-two-integers/", "Arithmetic using XOR and bitwise carries."),
            problem(259, bits, "Single Number II", Medium, LeetCode, "https://leetcode.com/problems/single-number-ii/", "Find outlier occurring once vs others thrice."),
            problem(260, bits, "Single Number III", Medium, LeetCode, "https://leetcode.com/problems/single-number-iii/", "Identify two unique elements with bit masks."),
            problem(261, bits, "Binary Watch", Easy, LeetCode, "https://leetcode.com/problems/binary-watch/", "Permute possible bit-based time displays."),
            problem(262, bits, "Bitwise AND of Numbers Range", Medium, LeetCode, "https://leetcode.com/problems/bitwise-and-of-numbers-range/", "Observe prefix stability in range AND."),
            problem(263, bits, "Power of Two", Easy, LeetCode, "https://leetcode.com/problems/power-of-two/", "Property: n & (n-1) == 0."),
            problem(264, bits, "Number Complement", Easy, LeetCode, "https://leetcode.com/problems/number-complement/", "Flipping all bits in significant range."),
            problem(265, bits, "Total Hamming Distance", Medium, LeetCode, "https://leetcode.com/problems/total-hamming-distance/", "Summation of bit differences across all pairs."),
            problem(266, bits, "Hamming Distance", Easy, LeetCode, "https://leetcode.com/problems/hamming-distance/", "Simple XOR result bit counting."),
            problem(267, bits, "Max Product of Word Lengths", Medium, LeetCode, "https://leetcode.com/problems/maximum-product-of-word-lengths/", "Word presence masking for overlap check."),
            problem(268, bits, "Bitwise Alternating Bits", Easy, LeetCode, "https://leetcode.com/problems/binary-number-with-alternating-bits/", "Verify 0/1 pattern using bit shifts."),
            problem(269, bits, "Decode XORed Array", Easy, LeetCode, "https://leetcode.com/problems/decode-xored-array/", "Invert XOR encoding to restore original."),
            problem(270, bits, "Sort Integers by The Number of 1 Bits", Easy, LeetCode, "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/", "Composite sorting based on bit counts."),
            problem(271, bits, "Find the Difference", Easy, LeetCode, "https://leetcode.com/problems/find-the-difference/", "XOR character arrays to find added char."),
            problem(272, bits, "Maximum XOR of Two Numbers in an Array", Medium, LeetCode, "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", "Greedy trie-based search for max XOR."),
            problem(273, bits, "UTF-8 Validation", Medium, LeetCode, "https://leetcode.com/problems/utf-8-validation/", "Checking standard binary encoding rules."),

            // Greedy & Intervals (274-294)
            problem(274, greedy, "Jump Game", Medium, LeetCode, "https://leetcode.com/problems/jump-game/", "Greedy evaluation of reachability to end."),
            problem(275, greedy, "Gas Station", Medium, LeetCode, "https://leetcode.com/problems/gas-station/", "Greedy search for starting point in circuit."),
            problem(276, greedy, "Non-overlapping Intervals", Medium, LeetCode, "https://leetcode.com/problems/non-overlapping-intervals/", "Greedy interval selection by end time."),
            problem(277, greedy, "Merge Intervals", Medium, LeetCode, "https://leetcode.com/problems/merge-intervals/", "Consolidate overlapping numeric ranges."),
            problem(278, greedy, "Insert Interval", Medium, LeetCode, "https://leetcode.com/problems/insert-interval/", "Re-merge after adding a new interval."),
            problem(279, greedy, "Minimum Number of Arrows to Burst Balloons", Medium, LeetCode, "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/", "Point coverage logic with greedy sorting."),
            problem(280, greedy, "Task Scheduler", Medium, LeetCode, "https://leetcode.com/problems/task-scheduler/", "Frequency-first scheduling with idle management."),
            problem(281, greedy, "Hand of Straights", Medium, LeetCode, "https://leetcode.com/problems/hand-of-straights/", "Greedy formation of sequential card groups."),
            problem(282, greedy, "Jump Game II", Medium, LeetCode, "https://leetcode.com/problems/jump-game-ii/", "Minimize total hops via greedy reach window."),
            problem(283, greedy, "Partition Labels", Medium, LeetCode, "https://leetcode.com/problems/partition-labels/", "Maximize disjoint string partitions."),
            problem(284, greedy, "Valid Parenthesis String", Medium, LeetCode, "https://leetcode.com/problems/valid-parenthesis-string/", "Flexible balancing with wildcards."),
            problem(285, greedy, "Assign Cookies", Easy, LeetCode, "https://leetcode.com/problems/assign-cookies/", "Minimize dissatisfaction by greedily matching."),
            problem(286, greedy, "Lemonade Change", Easy, LeetCode, "https://leetcode.com/problems/lemonade-change/", "Greedy bill prioritization for change."),
            problem(287, greedy, "Queue Reconstruction by Height", Medium, LeetCode, "https://leetcode.com/problems/queue-reconstruction-by-height/", "Greedy insertion based on constraints."),
            problem(288, greedy, "Candy Distribution", Hard, LeetCode, "https://leetcode.com/problems/candy/", "Two-pass greedy neighbor matching."),
            problem(289, greedy, "Meeting Rooms", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/meetings-rooms/1", "Check for any interval overlap."),
            problem(290, greedy, "Meeting Rooms II", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/meeting-rooms-ii/1", "Calculate max concurrent overlaps."),
            problem(291, greedy, "Fractional Knapsack", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1", "Greedy ratio selection for continuous weight."),
            problem(292, greedy, "Job Sequencing", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1", "Deadline sorting with slot management."),
            problem(293, greedy, "Police and Thieves", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/police-and-thieves--1587115620/1", "Max matching between two arrays with distance."),
            problem(294, greedy, "Minimum Platforms", Medium, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1", "Sorted arrival/departure sweep logic."),

            // Math & Geometry (295-315)
            problem(295, math, "Happy Number", Easy, LeetCode, "https://leetcode.com/problems/happy-number/", "Cycle detection logic for number transformation."),
            problem(296, math, "Plus One", Easy, LeetCode, "https://leetcode.com/problems/plus-one/", "Simulate addition on integer array."),
            problem(297, math, "Pow(x, n)", Medium, LeetCode, "https://leetcode.com/problems/powx-n/", "Logarithmic exponentiation algorithm."),
            problem(298, math, "Multiply Strings", Medium, LeetCode, "https://leetcode.com/problems/multiply-strings/", "Large number simulation (column-wise)."),
            problem(299, math, "Rotate Image", Medium, LeetCode, "https://leetcode.com/problems/rotate-image/", "In-place matrix rotation via transpose."),
            problem(300, math, "Spiral Matrix", Medium, LeetCode, "https://leetcode.com/problems/spiral-matrix/", "Boundary-focused layer traversal."),
            problem(301, math, "Set Matrix Zeroes", Medium, LeetCode, "https://leetcode.com/problems/set-matrix-zeroes/", "Using first row/col as markers."),
            problem(302, math, "Count Primes", Medium, LeetCode, "https://leetcode.com/problems/count-primes/", "Efficient prime hunting using Sieve."),
            problem(303, math, "Factorial Trailing Zeroes", Easy, LeetCode, "https://leetcode.com/problems/factorial-trailing-zeroes/", "Count powers of 5 in sequence."),
            problem(304, math, "Excel Sheet Column Title", Easy, LeetCode, "https://leetcode.com/problems/excel-sheet-column-title/", "Base-26 numeric conversion."),
            problem(305, math, "Excel Sheet Column Number", Easy, LeetCode, "https://leetcode.com/problems/excel-sheet-column-number/", "Convert A-Z to numeric index."),
            problem(306, math, "Valid Number", Hard, LeetCode, "https://leetcode.com/problems/valid-number/", "Finite state machine or complex parsing."),
            problem(307, math, "Integer to Roman", Medium, LeetCode, "https://leetcode.com/problems/integer-to-roman/", "Mapping numeric ranges to symbols."),
            problem(308, math, "Roman to Integer", Easy, LeetCode, "https://leetcode.com/problems/roman-to-integer/", "Cumulative subtraction/addition of symbols."),
            problem(309, math, "Palindrome Number", Easy, LeetCode, "https://leetcode.com/problems/palindrome-number/", "Reverse integer half and compare."),
            problem(310, math, "Reverse Integer", Medium, LeetCode, "https://leetcode.com/problems/reverse-integer/", "Digit extraction with overflow checks."),
            problem(311, math, "Sieve of Eratosthenes", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/sieve-of-eratosthenes5242/1", "Classic prime pre-calculation."),
            problem(312, math, "GCD and LCM", Easy, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/lcm-and-gcd4510/1", "Euclidean algorithm application."),
            problem(313, math, "Fibonacci Number", Easy, LeetCode, "https://leetcode.com/problems/fibonacci-number/", "Recursive or iterative sequence generation."),
            problem(314, math, "Closest Pair of Points", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/closest-pair-of-points/1", "Divide and conquer geometry."),
            problem(315, math, "Convex Hull", Hard, GeeksForGeeks, "https://www.geeksforgeeks.org/problems/convex-hull-jarvis-march-algorithm/1", "Jarvis March or Graham Scan algorithm.")
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
        saveCompanyProfile(7, "Flipkart", "Medium", "FLP", "#2563eb", 4, 2, 5, 150, "Assessment with implementation-heavy coding followed by DSA and low-level design discussion", "Train arrays, greedy, and graph thinking alongside linked list implementation drills.", List.of("Arrays", "Greedy & Intervals", "Graphs", "Linked List"), List.of("Merge overlapping intervals", "Order scheduling with dependencies", "Linked list arithmetic"), List.of("Product of Array Except Self", "Course Schedule", "Add Two Numbers", "Non-overlapping Intervals"), topicsByName, problemsByTitle);
        saveCompanyProfile(8, "Zoho", "Easy to Medium", "ZHO", "#16a34a", 4, 1, 3, 120, "Aptitude plus coding rounds with strong emphasis on clean implementation and basics", "Stay sharp on arrays, strings, stack/queues, and binary search because Zoho often rewards clarity over trickiness.", List.of("Arrays", "Strings", "Stack & Queues", "Binary Search"), List.of("Array scanning problems", "Substring and string cleanup", "Queue simulation", "Search on sorted data"), List.of("Two Sum", "Valid Anagram", "Implement Queue using Stacks", "Search in Rotated Sorted Array"), topicsByName, problemsByTitle);
        saveCompanyProfile(9, "Walmart", "Medium", "WMT", "#1d4ed8", 4, 1, 4, 140, "Online coding followed by DSA rounds and practical backend-oriented discussions", "Invest in graphs, trees, and dynamic programming, then add sliding window practice for operations-style problem solving.", List.of("Graphs", "Trees", "Dynamic Programming", "Sliding Window"), List.of("Island counting and BFS", "Binary tree traversal", "DP optimization under constraints"), List.of("Number of Islands", "Binary Tree Level Order Traversal", "House Robber", "Rotting Oranges"), topicsByName, problemsByTitle);
        saveCompanyProfile(10, "Atlassian", "Medium to Hard", "ATL", "#0f766e", 5, 2, 5, 165, "Coding assessment, algorithm interviews, and strong emphasis on communication and problem clarity", "Practice arrays and strings under time pressure, then deepen graph and backtracking confidence for onsite-style questions.", List.of("Arrays", "Strings", "Graphs", "Backtracking"), List.of("Window-based string problems", "Connected components", "Generate valid states recursively"), List.of("Longest Substring Without Repeating Characters", "Minimum Window Substring", "Number of Islands", "Word Search"), topicsByName, problemsByTitle);
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
    private void seedProjectIdeas() {
        // AI-Powered Customer Support Chatbot
        ProjectIdea chatbot = ProjectIdea.builder()
                .title("AI-Powered Support Chatbot")
                .description("Build an intelligent chatbot that uses NLP to handle customer queries and escalate to humans when needed.")
                .domain(ProjectIdea.ProjectDomain.AI_ML)
                .difficulty(ProjectIdea.ProjectDifficulty.INTERMEDIATE)
                .techStack(Arrays.asList("Python", "TensorFlow", "React", "WebSocket"))
                .estimatedTime("4-6 Weeks")
                .realWorldUseCase("Used by e-commerce platforms to reduce support ticket volume by 40%.")
                .resumeImpactScore(9)
                .githubLink("https://github.com/example/ai-chatbot")
                .build();
        projectIdeaRepository.save(chatbot);
        seedSteps(chatbot, Arrays.asList(
            "Set up a basic NLP model using BERT or GPT.",
            "Build a WebSocket-based real-time chat interface in React.",
            "Implement intent detection to route queries to specific departments.",
            "Integrate with a CRM like Salesforce or Zendesk via API."
        ));

        // Scalable Microservices E-commerce
        ProjectIdea ecommerce = ProjectIdea.builder()
                .title("Microservices E-commerce Suite")
                .description("Design and implement a distributed system for a high-traffic online store.")
                .domain(ProjectIdea.ProjectDomain.SYSTEM_DESIGN)
                .difficulty(ProjectIdea.ProjectDifficulty.ADVANCED)
                .techStack(Arrays.asList("Spring Boot", "Docker", "Kubernetes", "Kafka", "PostgreSQL"))
                .estimatedTime("8-12 Weeks")
                .realWorldUseCase("Infrastructure pattern used by Amazon and Netflix to handle regional independence.")
                .resumeImpactScore(10)
                .githubLink("https://github.com/example/micro-ecommerce")
                .build();
        projectIdeaRepository.save(ecommerce);
        seedSteps(ecommerce, Arrays.asList(
            "Decompose monolith into Order, Product, and Payment services.",
            "Implement API Gateway using Spring Cloud Gateway.",
            "Set up event-driven communication using Kafka for inventory updates.",
            "Deploy services to a Kubernetes cluster with persistent volumes."
        ));

        // Real-time Collaborative Document Editor
        ProjectIdea editor = ProjectIdea.builder()
                .title("Co-Edit: Real-time Editor")
                .description("A web-based document editor allowing multiple users to edit the same file simultaneously.")
                .domain(ProjectIdea.ProjectDomain.WEB_DEV)
                .difficulty(ProjectIdea.ProjectDifficulty.INTERMEDIATE)
                .techStack(Arrays.asList("Node.js", "Socket.io", "React", "Yjs (CRDTs)"))
                .estimatedTime("5-7 Weeks")
                .realWorldUseCase("Core technology behind Google Docs and Figma.")
                .resumeImpactScore(9)
                .githubLink("https://github.com/example/co-edit")
                .build();
        projectIdeaRepository.save(editor);
        seedSteps(editor, Arrays.asList(
            "Implement Conflict-free Replicated Data Types (CRDTs) for data consistency.",
            "Build a robust WebSocket server to broadcast changes across clients.",
            "Create a rich-text UI using Slate.js or Quill.js.",
            "Implement user presence indicators (avatars showing who is active)."
        ));

        // Placement Analytics Dashboard
        ProjectIdea analytics = ProjectIdea.builder()
                .title("Career Flow Analytics")
                .description("Visualize hiring trends, salary ranges, and skill requirements from millions of job postings.")
                .domain(ProjectIdea.ProjectDomain.DATA_SCIENCE)
                .difficulty(ProjectIdea.ProjectDifficulty.BEGINNER)
                .techStack(Arrays.asList("Python", "Pandas", "Scikit-Learn", "Chart.js"))
                .estimatedTime("3-4 Weeks")
                .realWorldUseCase("Insights used by HR managers to benchmark salaries and identify talent gaps.")
                .resumeImpactScore(8)
                .githubLink("https://github.com/example/career-analytics")
                .build();
        projectIdeaRepository.save(analytics);
        seedSteps(analytics, Arrays.asList(
            "Scrape job data from LinkedIn and Indeed using Selenium.",
            "Perform exploratory data analysis (EDA) to find correlations.",
            "Train a regression model to predict salary based on skills/location.",
            "Build a dashboard to visualize trends using React and Chart.js."
        ));

        // Fitness Tracker with Wearable Integration
        ProjectIdea fitness = ProjectIdea.builder()
                .title("FitTrack Pro")
                .description("A mobile-first application to track workouts, calories, and sync with Apple Health/Google Fit.")
                .domain(ProjectIdea.ProjectDomain.MOBILE_APP)
                .difficulty(ProjectIdea.ProjectDifficulty.INTERMEDIATE)
                .techStack(Arrays.asList("Flutter", "Firebase", "HealthKit API", "Node.js"))
                .estimatedTime("6-8 Weeks")
                .realWorldUseCase("Health monitoring apps for insurance and patient record tracking.")
                .resumeImpactScore(8)
                .githubLink("https://github.com/example/fittrack")
                .build();
        projectIdeaRepository.save(fitness);
        seedSteps(fitness, Arrays.asList(
            "Implement OAuth2 login with Google and Apple.",
            "Sync step and heart rate data from Health API to local DB.",
            "Build a workout logger with dynamic charts for weight progress.",
            "implement push notifications for daily hydration reminders."
        ));

        // Blockchain-based Certifier
        ProjectIdea blockchain = ProjectIdea.builder()
                .title("SafeCert: Blockchain Degrees")
                .description("Issue and verify academic certificates on the Ethereum blockchain to prevent fraud.")
                .domain(ProjectIdea.ProjectDomain.BLOCKCHAIN)
                .difficulty(ProjectIdea.ProjectDifficulty.ADVANCED)
                .techStack(Arrays.asList("Solidity", "Hardhat", "Ether.js", "React"))
                .estimatedTime("8-10 Weeks")
                .realWorldUseCase("Ensuring tamper-proof academic and professional credentials.")
                .resumeImpactScore(10)
                .githubLink("https://github.com/example/safecert")
                .build();
        projectIdeaRepository.save(blockchain);
        seedSteps(blockchain, Arrays.asList(
            "Write a Smart Contract in Solidity to store certificate hashes.",
            "Develop a verification portal for employers to check credential validity.",
            "Implement gas-optimized minting for bulk certificate issuance.",
            "Integrate MetaMask for digital identity verification."
        ));

        // AI/ML - Financial Fraud Detection
        ProjectIdea fraud = ProjectIdea.builder()
                .title("SafeGuard AI")
                .description("Advanced real-time anomaly detection system for credit card transactions using isolation forests.")
                .domain(ProjectIdea.ProjectDomain.AI_ML)
                .difficulty(ProjectIdea.ProjectDifficulty.ADVANCED)
                .techStack(Arrays.asList("Python", "Scikit-Learn", "FastAPI", "Redis"))
                .estimatedTime("8 Weeks")
                .realWorldUseCase("Used by fintech companies to prevent fraudulent transactions instantly.")
                .resumeImpactScore(9)
                .githubLink("https://github.com/example/safeguard-ai")
                .build();
        projectIdeaRepository.save(fraud);
        seedSteps(fraud, Arrays.asList(
            "Clean and normalize transaction datasets using Pandas.",
            "Train an Isolation Forest model for unsupervised anomaly detection.",
            "Build a low-latency API to serve predictions under 50ms.",
            "Implement a feedback loop for model retraining."
        ));

        // Distributed Systems - Raft KV Store
        ProjectIdea kvstore = ProjectIdea.builder()
                .title("Titan KV")
                .description("A distributed, highly available Key-Value store implementing the Raft consensus algorithm.")
                .domain(ProjectIdea.ProjectDomain.SYSTEM_DESIGN)
                .difficulty(ProjectIdea.ProjectDifficulty.ADVANCED)
                .techStack(Arrays.asList("Go", "gRPC", "Protobuf", "Etcd-Raft"))
                .estimatedTime("12 Weeks")
                .realWorldUseCase("Foundation for services like Kubernetes (etcd) and CockroachDB.")
                .resumeImpactScore(10)
                .githubLink("https://github.com/example/titan-kv")
                .build();
        projectIdeaRepository.save(kvstore);
        seedSteps(kvstore, Arrays.asList(
            "Implement basic RPC communication between nodes.",
            "Integrate the Raft consensus module for leader election.",
            "Build a persistent log store with snapshots and compaction.",
            "Expose a client API for consistent read/write operations."
        ));

        // Web Dev - Multi-tenant SaaS Dashboard
        ProjectIdea saas = ProjectIdea.builder()
                .title("Nexus Dashboard")
                .description("A production-ready multi-tenant analytics dashboard with real-time data visualization.")
                .domain(ProjectIdea.ProjectDomain.WEB_DEV)
                .difficulty(ProjectIdea.ProjectDifficulty.INTERMEDIATE)
                .techStack(Arrays.asList("Next.js", "TypeScript", "Tailwind CSS", "Supabase"))
                .estimatedTime("6 Weeks")
                .realWorldUseCase("Modern B2B analytics platforms.")
                .resumeImpactScore(8)
                .githubLink("https://github.com/example/nexus-saas")
                .build();
        projectIdeaRepository.save(saas);
        seedSteps(saas, Arrays.asList(
            "Implement multi-tenant auth with organization switching.",
            "Build dynamic charts using Recharts or D3.js.",
            "Enable real-time data sync using WebSockets or Supabase.",
            "Design a responsive, accessible UI with Dark Mode support."
        ));

        // Data Science - E-commerce Recommendation Engine
        ProjectIdea reco = ProjectIdea.builder()
                .title("Pulse Reco")
                .description("Personalized product recommendation engine using hybrid filtering and deep learning.")
                .domain(ProjectIdea.ProjectDomain.DATA_SCIENCE)
                .difficulty(ProjectIdea.ProjectDifficulty.INTERMEDIATE)
                .techStack(Arrays.asList("Python", "TensorFlow", "PostgreSQL", "Flask"))
                .estimatedTime("5 Weeks")
                .realWorldUseCase("Essential for e-commerce platforms like Amazon and Flipkart.")
                .resumeImpactScore(9)
                .githubLink("https://github.com/example/pulse-reco")
                .build();
        projectIdeaRepository.save(reco);
        seedSteps(reco, Arrays.asList(
            "Perform Exploratory Data Analysis (EDA) on user clickstreams.",
            "Build a hybrid filtering model (Collaborative + Content-based).",
            "Develop a recommendation service with Top-K item retrieval.",
            "A/B test the model against a baseline popularity strategy."
        ));

        // Blockchain - Decentralized Voting Protocol
        ProjectIdea voting = ProjectIdea.builder()
                .title("EtherVote")
                .description("Transparent and secure voting system built on Ethereum with Solidity smart contracts.")
                .domain(ProjectIdea.ProjectDomain.BLOCKCHAIN)
                .difficulty(ProjectIdea.ProjectDifficulty.ADVANCED)
                .techStack(Arrays.asList("Solidity", "Hardhat", "React", "Ethers.js"))
                .estimatedTime("6 Weeks")
                .realWorldUseCase("DAO governance and municipal voting trials.")
                .resumeImpactScore(9)
                .githubLink("https://github.com/example/ethervote")
                .build();
        projectIdeaRepository.save(voting);
        seedSteps(voting, Arrays.asList(
            "Write secure Solidity contracts for ballot management.",
            "Unit test contracts for edge cases and reentrancy.",
            "Build a web3 frontend to connect with MetaMask.",
            "Deploy to a testnet like Sepolia or Arbitrum Goerli."
        ));
    }

    private void seedSteps(ProjectIdea project, List<String> stepDescriptions) {
        for (int i = 0; i < stepDescriptions.size(); i++) {
            ProjectStep step = ProjectStep.builder()
                    .projectIdea(project)
                    .stepNumber(i + 1)
                    .title("Step " + (i + 1))
                    .description(stepDescriptions.get(i))
                    .build();
            projectStepRepository.save(step);
        }
    }
}

