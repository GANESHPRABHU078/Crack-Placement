package com.placementos.backend.config;

import com.placementos.backend.entity.*;
import com.placementos.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Configuration
public class RoadmapContentSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(RoadmapContentSeeder.class);
    private final RoadmapDefinitionRepository roadmapDefinitionRepository;
    private final RoadmapStageRepository roadmapStageRepository;
    private final RoadmapTopicRepository roadmapTopicRepository;
    private final RoadmapTopicResourceRepository roadmapTopicResourceRepository;
    private final RoadmapTrackRepository roadmapTrackRepository;
    private final RoadmapTrackResourceRepository roadmapTrackResourceRepository;
    private final RoadmapPlanItemRepository roadmapPlanItemRepository;

    public RoadmapContentSeeder(
            RoadmapDefinitionRepository roadmapDefinitionRepository,
            RoadmapStageRepository roadmapStageRepository,
            RoadmapTopicRepository roadmapTopicRepository,
            RoadmapTopicResourceRepository roadmapTopicResourceRepository,
            RoadmapTrackRepository roadmapTrackRepository,
            RoadmapTrackResourceRepository roadmapTrackResourceRepository,
            RoadmapPlanItemRepository roadmapPlanItemRepository
    ) {
        this.roadmapDefinitionRepository = roadmapDefinitionRepository;
        this.roadmapStageRepository = roadmapStageRepository;
        this.roadmapTopicRepository = roadmapTopicRepository;
        this.roadmapTopicResourceRepository = roadmapTopicResourceRepository;
        this.roadmapTrackRepository = roadmapTrackRepository;
        this.roadmapTrackResourceRepository = roadmapTrackResourceRepository;
        this.roadmapPlanItemRepository = roadmapPlanItemRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (roadmapDefinitionRepository.count() > 0) {
                log.info("Roadmap content already exists, skipping reseed.");
                return;
            }
            seedRoadmaps();
            log.info("Roadmap content seeded successfully.");
        } catch (Exception exception) {
            log.error("Roadmap content seeding failed, continuing without blocking startup.", exception);
        }
    }

    private void seedRoadmaps() {
        RoadmapDefinition dsa = saveRoadmap("dsa", "DSA", "Beginner to advanced problem solving for coding interviews.", "#f97316", "code", "14 weeks", "/practice", 1);
        addPlanItems(dsa, "daily", List.of(
                "Day 1 -> Arrays + solve 2 problems",
                "Day 2 -> Strings + solve 2 problems",
                "Day 3 -> Linked List fundamentals and one medium problem",
                "Day 4 -> Trees revision and traversal practice"
        ));
        addPlanItems(dsa, "weekly", List.of(
                "Week 1 -> Arrays and Strings",
                "Week 2 -> Linked List, Stack, Queue",
                "Week 3 -> Trees and Graphs",
                "Week 4 -> Dynamic Programming and mixed company sets"
        ));
        RoadmapStage dsaBeginner = saveStage(dsa, "b", "Beginner", "Core patterns and foundations.", 1);
        RoadmapStage dsaIntermediate = saveStage(dsa, "i", "Intermediate", "Tree and graph thinking.", 2);
        RoadmapStage dsaAdvanced = saveStage(dsa, "a", "Advanced", "Interview-deciding topics and revision.", 3);
        saveTopic(dsa, dsaBeginner, "arrays", "Arrays", "Traversal, prefix sums, sliding window, hashing.", "Easy", "/practice", 1,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaBeginner, "strings", "Strings", "Palindromes, substrings, maps, two pointers.", "Easy", "/practice", 2,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaBeginner, "linked-list", "Linked List", "Reverse, merge, cycle detection, pointer updates.", "Medium", "/practice", 3,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaIntermediate, "stack-queue", "Stack and Queue", "Monotonic stack, deque, evaluation patterns.", "Medium", "/practice", 1,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaIntermediate, "trees", "Trees and BST", "Traversals, recursion, path problems, LCA.", "Medium", "/practice", 2,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaIntermediate, "graphs", "Graphs", "BFS, DFS, shortest path intuition, topological sort.", "Hard", "/practice", 3,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("roadmap.sh", "https://roadmap.sh/")));
        saveTopic(dsa, dsaAdvanced, "dp", "Dynamic Programming", "State transitions, memoization, tabulation, optimization.", "Hard", "/practice", 1,
                resources(ext("LeetCode", "https://leetcode.com/problemset/"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/explore?page=1&sortBy=submissions")));
        saveTopic(dsa, dsaAdvanced, "company-sets", "Company Interview Sets", "Timed mixed practice and mock interview rounds.", "Hard", "/mock-interviews", 2,
                resources(internal("Mock Interviews", "/mock-interviews"), ext("LeetCode", "https://leetcode.com/problemset/")));

        RoadmapDefinition systemDesign = saveRoadmap("system-design", "System Design", "From fundamentals to real-world architecture case studies.", "#0ea5e9", "cpu", "10 weeks", "/mock-interviews", 2);
        addPlanItems(systemDesign, "daily", List.of(
                "Day 1 -> Scalability and latency basics",
                "Day 2 -> CAP theorem and consistency tradeoffs",
                "Day 3 -> Caching and database fundamentals",
                "Day 4 -> Design one small system"
        ));
        addPlanItems(systemDesign, "weekly", List.of(
                "Week 1 -> System design basics",
                "Week 2 -> Load balancing, caching, databases",
                "Week 3 -> Chat app and URL shortener",
                "Week 4 -> Streaming systems and revision"
        ));
        RoadmapStage sdBeginner = saveStage(systemDesign, "b", "Beginner", "Distributed-systems vocabulary first.", 1);
        RoadmapStage sdIntermediate = saveStage(systemDesign, "i", "Intermediate", "Core interview building blocks.", 2);
        RoadmapStage sdAdvanced = saveStage(systemDesign, "a", "Advanced", "Case studies and tradeoff explanations.", 3);
        saveTopic(systemDesign, sdBeginner, "scalability", "Scalability, Latency, CAP", "The tradeoffs every design interview starts with.", "Easy", "/mock-interviews", 1,
                resources(ext("ByteByteGo", "https://bytebytego.com/"), ext("System Design Primer", "https://github.com/donnemartin/system-design-primer")));
        saveTopic(systemDesign, sdBeginner, "availability", "Availability and Reliability", "Fault tolerance, replication, graceful degradation.", "Medium", "/mock-interviews", 2,
                resources(ext("System Design Primer", "https://github.com/donnemartin/system-design-primer"), ext("roadmap.sh", "https://roadmap.sh/")));
        saveTopic(systemDesign, sdIntermediate, "load-balancing", "Load Balancing and API Gateway", "Traffic distribution, reverse proxy, routing, sticky sessions.", "Medium", "/mock-interviews", 1,
                resources(ext("System Design Primer", "https://github.com/donnemartin/system-design-primer"), ext("ByteByteGo", "https://bytebytego.com/")));
        saveTopic(systemDesign, sdIntermediate, "cache-db", "Caching and Databases", "Redis, SQL vs NoSQL, replication, indexes.", "Medium", "/mock-interviews", 2,
                resources(ext("System Design Primer", "https://github.com/donnemartin/system-design-primer"), ext("GeeksforGeeks", "https://www.geeksforgeeks.org/")));
        saveTopic(systemDesign, sdAdvanced, "chat-app", "Design a Chat App", "Presence, ordering, fanout, storage, scaling.", "Hard", "/mock-interviews", 1,
                resources(ext("System Design Primer", "https://github.com/donnemartin/system-design-primer"), internal("Mock Interviews", "/mock-interviews")));
        saveTopic(systemDesign, sdAdvanced, "url-shortener", "URL Shortener and Netflix-style Systems", "Read-heavy systems, CDN, observability, and scale.", "Hard", "/mock-interviews", 2,
                resources(ext("ByteByteGo", "https://bytebytego.com/"), ext("roadmap.sh", "https://roadmap.sh/")));

        RoadmapDefinition languages = saveRoadmap("languages", "Programming Languages", "Java, Python, and JavaScript tracks with basics to advanced concepts.", "#22c55e", "layers", "12 weeks", "/practice", 3);
        addPlanItems(languages, "daily", List.of(
                "Day 1 -> Syntax and loops",
                "Day 2 -> Functions and collections",
                "Day 3 -> OOP and abstraction",
                "Day 4 -> Async, threads, or runtime concepts"
        ));
        addPlanItems(languages, "weekly", List.of(
                "Week 1 -> Basics",
                "Week 2 -> OOP",
                "Week 3 -> Advanced concepts",
                "Week 4 -> Exercises and mini project"
        ));
        RoadmapStage langBasics = saveStage(languages, "b", "Basics", "Syntax fluency and control flow.", 1);
        RoadmapStage langOop = saveStage(languages, "i", "OOP", "Clean structure and abstraction.", 2);
        RoadmapStage langAdvanced = saveStage(languages, "a", "Advanced", "Interview-ready runtime concepts.", 3);
        saveTrack(languages, "java", "Java", 1, List.of(
                ext("Oracle Java Tutorials", "https://docs.oracle.com/javase/tutorial/"),
                ext("Spring Guides", "https://spring.io/guides")
        ));
        saveTrack(languages, "python", "Python", 2, List.of(
                ext("Python Tutorial", "https://docs.python.org/3/tutorial/"),
                ext("GeeksforGeeks Python", "https://www.geeksforgeeks.org/python-programming-language-tutorial/")
        ));
        saveTrack(languages, "javascript", "JavaScript", 3, List.of(
                ext("javascript.info", "https://javascript.info/"),
                ext("MDN", "https://developer.mozilla.org/")
        ));
        saveTopic(languages, langBasics, "syntax", "Syntax, Variables, Loops", "Build day-to-day fluency in core syntax.", "Easy", "/practice", 1,
                resources(ext("freeCodeCamp", "https://www.freecodecamp.org/learn/"), ext("Oracle Java Tutorials", "https://docs.oracle.com/javase/tutorial/")));
        saveTopic(languages, langOop, "oop", "Classes, Objects, Inheritance", "Encapsulation, interfaces, abstraction, polymorphism.", "Medium", "/practice", 1,
                resources(ext("Java Tutorials", "https://docs.oracle.com/javase/tutorial/"), ext("Python Docs", "https://docs.python.org/3/tutorial/")));
        saveTopic(languages, langAdvanced, "threads-async", "Multithreading and Async", "Java threads, Python concurrency, JS async and await.", "Hard", "/practice", 1,
                resources(ext("MDN", "https://developer.mozilla.org/"), ext("Node Learn", "https://nodejs.org/en/learn")));
        saveTopic(languages, langAdvanced, "language-projects", "Practice Exercises", "Mini projects and coding exercises in your chosen language.", "Medium", "/practice", 2,
                resources(ext("freeCodeCamp", "https://www.freecodecamp.org/learn/"), ext("Spring Guides", "https://spring.io/guides")));

        RoadmapDefinition webDev = saveRoadmap("web-dev", "Web Development", "Frontend and backend learning path for full-stack placement prep.", "#a855f7", "globe", "12 weeks", "/courses", 4);
        addPlanItems(webDev, "daily", List.of(
                "Day 1 -> HTML and forms",
                "Day 2 -> CSS layouts and responsiveness",
                "Day 3 -> JavaScript DOM and APIs",
                "Day 4 -> React and backend integration"
        ));
        addPlanItems(webDev, "weekly", List.of(
                "Week 1 -> Frontend basics",
                "Week 2 -> React",
                "Week 3 -> APIs, auth, databases",
                "Week 4 -> Deployment and projects"
        ));
        RoadmapStage webFrontend = saveStage(webDev, "f", "Frontend", "Responsive UI and modern web apps.", 1);
        RoadmapStage webBackend = saveStage(webDev, "b", "Backend", "APIs, databases, and auth.", 2);
        RoadmapStage webAdvanced = saveStage(webDev, "a", "Advanced", "Project delivery and portfolio polish.", 3);
        saveTopic(webDev, webFrontend, "html-css-js", "HTML, CSS, JavaScript", "Semantic tags, responsive design, DOM, fetch API.", "Easy", "/courses", 1,
                resources(ext("MDN", "https://developer.mozilla.org/"), ext("freeCodeCamp", "https://www.freecodecamp.org/learn/")));
        saveTopic(webDev, webFrontend, "react", "React and Frontend Architecture", "Components, routing, state, and API integration.", "Medium", "/courses", 2,
                resources(ext("roadmap.sh", "https://roadmap.sh/"), ext("MDN", "https://developer.mozilla.org/")));
        saveTopic(webDev, webBackend, "apis", "REST APIs, Auth, Databases", "Controllers, validation, JWT, persistence, deployment.", "Medium", "/jobs", 1,
                resources(ext("Spring Guides", "https://spring.io/guides"), ext("Node Learn", "https://nodejs.org/en/learn")));
        saveTopic(webDev, webAdvanced, "deploy", "Deployment and Full-stack Projects", "Ship production-style projects and present them well.", "Hard", "/resume-builder", 1,
                resources(ext("roadmap.sh", "https://roadmap.sh/"), ext("freeCodeCamp", "https://www.freecodecamp.org/learn/")));
    }

    private RoadmapDefinition saveRoadmap(String id, String title, String subtitle, String color, String iconName, String duration, String primaryRoute, int order) {
        RoadmapDefinition roadmap = new RoadmapDefinition();
        roadmap.setId(id);
        roadmap.setTitle(title);
        roadmap.setSubtitle(subtitle);
        roadmap.setColor(color);
        roadmap.setIconName(iconName);
        roadmap.setDuration(duration);
        roadmap.setPrimaryRoute(primaryRoute);
        roadmap.setDisplayOrder(order);
        return roadmapDefinitionRepository.save(roadmap);
    }

    private RoadmapStage saveStage(RoadmapDefinition roadmap, String key, String label, String description, int order) {
        RoadmapStage stage = new RoadmapStage();
        stage.setRoadmap(roadmap);
        stage.setStageKey(key);
        stage.setLabel(label);
        stage.setDescription(description);
        stage.setDisplayOrder(order);
        return roadmapStageRepository.save(stage);
    }

    private void saveTopic(RoadmapDefinition roadmap, RoadmapStage stage, String key, String title, String summary, String difficulty, String route, int order, List<ResourceSeed> resources) {
        RoadmapTopic topic = new RoadmapTopic();
        topic.setRoadmap(roadmap);
        topic.setStage(stage);
        topic.setTopicKey(key);
        topic.setTitle(title);
        topic.setSummary(summary);
        topic.setDifficulty(difficulty);
        topic.setRoute(route);
        topic.setDisplayOrder(order);
        RoadmapTopic savedTopic = roadmapTopicRepository.save(topic);

        for (int i = 0; i < resources.size(); i++) {
            ResourceSeed resourceSeed = resources.get(i);
            RoadmapTopicResource resource = new RoadmapTopicResource();
            resource.setTopic(savedTopic);
            resource.setLabel(resourceSeed.label());
            resource.setUrl(resourceSeed.url());
            resource.setInternalLink(resourceSeed.internal());
            resource.setDisplayOrder(i + 1);
            roadmapTopicResourceRepository.save(resource);
        }
    }

    private void saveTrack(RoadmapDefinition roadmap, String key, String label, int order, List<ResourceSeed> resources) {
        RoadmapTrack track = new RoadmapTrack();
        track.setRoadmap(roadmap);
        track.setTrackKey(key);
        track.setLabel(label);
        track.setDisplayOrder(order);
        RoadmapTrack savedTrack = roadmapTrackRepository.save(track);

        for (int i = 0; i < resources.size(); i++) {
            ResourceSeed resourceSeed = resources.get(i);
            RoadmapTrackResource resource = new RoadmapTrackResource();
            resource.setTrack(savedTrack);
            resource.setLabel(resourceSeed.label());
            resource.setUrl(resourceSeed.url());
            resource.setDisplayOrder(i + 1);
            roadmapTrackResourceRepository.save(resource);
        }
    }

    private void addPlanItems(RoadmapDefinition roadmap, String type, List<String> items) {
        for (int i = 0; i < items.size(); i++) {
            RoadmapPlanItem item = new RoadmapPlanItem();
            item.setRoadmap(roadmap);
            item.setPlanType(type);
            item.setItemText(items.get(i));
            item.setDisplayOrder(i + 1);
            roadmapPlanItemRepository.save(item);
        }
    }

    private List<ResourceSeed> resources(ResourceSeed... items) {
        return List.of(items);
    }

    private ResourceSeed ext(String label, String url) {
        return new ResourceSeed(label, url, false);
    }

    private ResourceSeed internal(String label, String url) {
        return new ResourceSeed(label, url, true);
    }

    private record ResourceSeed(String label, String url, boolean internal) {}
}
