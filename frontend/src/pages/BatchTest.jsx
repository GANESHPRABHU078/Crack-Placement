import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight, 
    Zap, 
    Target, 
    BookOpen, 
    Code,
    Timer,
    ArrowLeft,
    Shield,
    MessageSquare,
    Calculator,
    Sparkles,
    User,
    AlertTriangle,
    Loader,
    Radar,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified Radar Chart Component for Results
const RadarChart = ({ data, size = 400 }) => {
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    const points = data.map((d, i) => {
        const x = center + radius * (d.score / 100) * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + radius * (d.score / 100) * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
            {/* Background Polygons */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((lvl) => (
                <polygon
                    key={lvl}
                    points={data.map((_, i) => {
                        const x = center + radius * lvl * Math.cos(i * angleStep - Math.PI / 2);
                        const y = center + radius * lvl * Math.sin(i * angleStep - Math.PI / 2);
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#e0e6ed"
                    strokeWidth="1"
                />
            ))}
            {/* Axis Lines */}
            {data.map((_, i) => {
                const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
                const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
                return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e0e6ed" strokeWidth="1" />;
            })}
            {/* Labels */}
            {data.map((d, i) => {
                const x = center + (radius + 40) * Math.cos(i * angleStep - Math.PI / 2);
                const y = center + (radius + 20) * Math.sin(i * angleStep - Math.PI / 2);
                return (
                    <text key={i} x={x} y={y} fontSize="10" fontWeight="700" textAnchor="middle" fill="#666" className="uppercase tracking-tighter">
                        {d.name.split(' ')[0]}
                    </text>
                );
            })}
            {/* Data Polygon */}
            <motion.polygon
                points={points}
                fill="rgba(0, 82, 204, 0.1)"
                stroke="#0052cc"
                strokeWidth="3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </svg>
    );
};

// Mock questions for CoCubes (Authentic 2024-25 Patterns - Expanded 45 Qs)
const cocubesQuestions = [
    // Analytical, Reasoning & Verbal (45 Qs)
    { id: 1, section: 'Analytical, Reasoning & Verbal', question: 'If the sum of two numbers is 55 and the H.C.F. and L.C.M. are 5 and 120 respectively, then the sum of the reciprocals is:', options: ['55/601', '11/120', '5/120', '11/600'], correct: 1 },
    { id: 2, section: 'Analytical, Reasoning & Verbal', question: 'A can do a piece of work in 15 days and B in 20 days. Together for 4 days, work left?', options: ['1/4', '1/10', '7/15', '8/15'], correct: 3 },
    { id: 3, section: 'Analytical, Reasoning & Verbal', question: 'Find the odd one out: 3, 5, 7, 12, 17, 19', options: ['12', '7', '17', '19'], correct: 0 },
    { id: 4, section: 'Analytical, Reasoning & Verbal', question: 'If CODER is coded as DPEFS, then what is the code for SCANNER?', options: ['TDBOOFS', 'TDBOOES', 'TDCP PFS', 'TDBP PFS'], correct: 0 },
    { id: 5, section: 'Analytical, Reasoning & Verbal', question: 'A man walks 5km North, then turns right and walks 3km. How far from start?', options: ['5.83km', '8km', '4km', '2km'], correct: 0 },
    { id: 6, section: 'Analytical, Reasoning & Verbal', question: 'Point out the antonym for: BENEVOLENT', options: ['Kind', 'Malevolent', 'Generous', 'Friendly'], correct: 1 },
    { id: 7, section: 'Analytical, Reasoning & Verbal', question: 'If 12th Jan 2004 was Monday, what was 12th Jan 2005?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], correct: 1 },
    { id: 8, section: 'Analytical, Reasoning & Verbal', question: 'A sum of money doubles itself in 8 years at simple interest. What is the rate?', options: ['10%', '12.5%', '15%', '20%'], correct: 1 },
    { id: 9, section: 'Analytical, Reasoning & Verbal', question: 'Syllogism: All Cats are Dogs. Some Dogs are Rats. Conclusion?', options: ['Some Cats are Rats', 'No Cat is Rat', 'Data Inadequate', 'All Dogs are Cats'], correct: 2 },
    { id: 10, section: 'Analytical, Reasoning & Verbal', question: 'Blood Relation: Pointing to a man, a girl said "He is the son of my grandfather\'s only son".', options: ['Brother', 'Uncle', 'Father', 'Cousin'], correct: 0 },
    { id: 11, section: 'Analytical, Reasoning & Verbal', question: 'Find the missing number: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correct: 1 },
    { id: 12, section: 'Analytical, Reasoning & Verbal', question: 'Speed of a boat in still water is 15 km/hr and speed of current is 3 km/hr. Downstream speed?', options: ['12', '18', '45', '15'], correct: 1 },
    { id: 13, section: 'Analytical, Reasoning & Verbal', question: 'Ratio of ages of A and B is 3:4. After 5 years, it becomes 4:5. Sum of current ages?', options: ['35', '45', '55', '65'], correct: 0 },
    { id: 14, section: 'Analytical, Reasoning & Verbal', question: 'Profit & Loss: Cost Price is 80, Selling Price is 100. Profit percentage?', options: ['20%', '25%', '30%', '40%'], correct: 1 },
    { id: 15, section: 'Analytical, Reasoning & Verbal', question: 'Venn Diagram: Relation between India, Asia, and World?', options: ['Nested Circles', 'Intersecting', 'Separate', 'None'], correct: 0 },
    { id: 16, section: 'Analytical, Reasoning & Verbal', question: 'Percentage: 40% of a number is 80. What is 20% of that number?', options: ['20', '40', '60', '80'], correct: 1 },
    { id: 17, section: 'Analytical, Reasoning & Verbal', question: 'Seating: A is sitting 3rd to the left of B in a circle of 8.', options: ['Logic check', 'B is 3rd to right', 'C is neighbor', 'Opposite'], correct: 1 },
    { id: 18, section: 'Analytical, Reasoning & Verbal', question: 'Verbal: Fill in - "She is proficient ____ English."', options: ['in', 'at', 'with', 'on'], correct: 0 },
    { id: 19, section: 'Analytical, Reasoning & Verbal', question: 'Sentence Correction: "I has been working since morning."', options: ['have been', 'was', 'am', 'No change'], correct: 0 },
    { id: 20, section: 'Analytical, Reasoning & Verbal', question: 'Probability: Two dice are thrown. Sum of 7?', options: ['1/6', '1/12', '5/36', '1/36'], correct: 0 },
    { id: 21, section: 'Analytical, Reasoning & Verbal', question: 'Find the next term in the series: B, D, G, K, P, ?', options: ['V', 'U', 'W', 'X'], correct: 0 },
    { id: 22, section: 'Analytical, Reasoning & Verbal', question: 'The difference between C.I. and S.I. on 2500 for 2 years at 4% p.a. is:', options: ['4', '5', '6', '8'], correct: 0 },
    { id: 23, section: 'Analytical, Reasoning & Verbal', question: 'A train 140m long is running at 60 km/hr. How long will it take to pass a pole?', options: ['8.4s', '9s', '10s', '12s'], correct: 0 },
    { id: 24, section: 'Analytical, Reasoning & Verbal', question: 'In a group of cows and hens, the number of legs are 14 more than twice the number of heads. Number of cows?', options: ['7', '10', '12', '14'], correct: 0 },
    { id: 25, section: 'Analytical, Reasoning & Verbal', question: 'Clock: How many times do the hands of a clock overlap in 24 hours?', options: ['22', '24', '44', '48'], correct: 0 },
    { id: 26, section: 'Analytical, Reasoning & Verbal', question: 'A boat travels 24 km upstream and 28 km downstream in 6 hours. It travels 30 km upstream and 21 km downstream in 6 hours 30 mins. Speed of boat in still water?', options: ['10 kmph', '12 kmph', '14 kmph', '16 kmph'], correct: 0 },
    { id: 27, section: 'Analytical, Reasoning & Verbal', question: 'Six people are sitting in a row facing North. A is neighbor of B but not C. D is neighbor of C. Who is at the extreme left?', options: ['A', 'B', 'C', 'D'], correct: 2 },
    { id: 28, section: 'Analytical, Reasoning & Verbal', question: 'If 3rd December 2000 was Sunday, what day was 3rd January 2001?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], correct: 1 },
    { id: 29, section: 'Analytical, Reasoning & Verbal', question: 'Ratio: If A:B = 2:3 and B:C = 4:5, find A:B:C.', options: ['8:12:15', '2:4:5', '6:9:10', '8:10:12'], correct: 0 },
    { id: 30, section: 'Analytical, Reasoning & Verbal', question: 'In a code, "FRIEND" is written as "HUMJTK". How is "CANDLE" written?', options: ['EDRIRL', 'DCQHQK', 'ESJFME', 'FYOBOC'], correct: 0 },
    { id: 31, section: 'Analytical, Reasoning & Verbal', question: 'A starts from a point and walks 2km North, turns right and walks 2km, turns right and walks. Which direction?', options: ['North', 'South', 'East', 'West'], correct: 1 },
    { id: 32, section: 'Analytical, Reasoning & Verbal', question: 'Complete the pattern: 4, 9, 16, 25, 36, ?', options: ['47', '48', '49', '50'], correct: 2 },
    { id: 33, section: 'Analytical, Reasoning & Verbal', question: 'If "+" means "x", "-" means "/", "x" means "-" and "/" means "+", then 20 + 5 x 10 / 2 - 5 = ?', options: ['90.4', '100', '102', '108'], correct: 0 },
    { id: 34, section: 'Analytical, Reasoning & Verbal', question: 'Identify the synonym for: ABANDON', options: ['Keep', 'Forsake', 'Adopt', 'Cherish'], correct: 1 },
    { id: 35, section: 'Analytical, Reasoning & Verbal', question: 'Statement: All players are tall. All tall people are healthy. Conclusion?', options: ['All players are healthy', 'Some healthy are players', 'Both', 'Neither'], correct: 2 },
    { id: 36, section: 'Analytical, Reasoning & Verbal', question: 'Pointing to a photograph, a man said "I have no brother or sister but that man\'s father is my father\'s son". Whose photo?', options: ['His son', 'His father', 'Himself', 'Grandfather'], correct: 0 },
    { id: 37, section: 'Analytical, Reasoning & Verbal', question: 'A card is drawn from a pack of 52. Probability of getting a King or a Heart?', options: ['1/13', '4/13', '17/52', '16/52'], correct: 3 },
    { id: 38, section: 'Analytical, Reasoning & Verbal', question: 'A cylinder has radius 7cm and height 10cm. Volume? (pi=22/7)', options: ['1540', '1450', '1500', '1600'], correct: 0 },
    { id: 39, section: 'Analytical, Reasoning & Verbal', question: 'Sentence: "Neither of the two candidates ____ selected."', options: ['was', 'were', 'have', 'are'], correct: 0 },
    { id: 40, section: 'Analytical, Reasoning & Verbal', question: 'Analogy: Moon : Satellite :: Earth : ?', options: ['Sun', 'Planet', 'Solar System', 'Asteroid'], correct: 1 },
    { id: 41, section: 'Analytical, Reasoning & Verbal', question: 'If water is called food, food is called tree, tree is called sky, sky is called wall, then on which of the following does a fruit grow?', options: ['Water', 'Food', 'Tree', 'Sky'], correct: 3 },
    { id: 42, section: 'Analytical, Reasoning & Verbal', question: 'A can do a work in 10 days and B in 15 days. They work together for 5 days. Work left?', options: ['1/6', '1/2', '1/3', '1/4'], correct: 0 },
    { id: 43, section: 'Analytical, Reasoning & Verbal', question: 'Which word does not belong with others?', options: ['Leopard', 'Cougar', 'Tiger', 'Wolf'], correct: 3 },
    { id: 44, section: 'Analytical, Reasoning & Verbal', question: 'Average: The average of first five multiples of 3 is:', options: ['3', '9', '12', '15'], correct: 1 },
    { id: 45, section: 'Analytical, Reasoning & Verbal', question: 'Percentage: A man spends 35% of income on food and 25% on children education. He saves 80% of remaining. Remaining is 400. Income?', options: ['2500', '5000', '7500', '10000'], correct: 1 },

    // Coding Assessment (3 Qs)
    { id: 46, section: 'Coding Assessment', question: 'Peak Element in array [1, 2, 3, 1]?', options: ['1', '2', '3', 'None'], correct: 2 },
    { id: 47, section: 'Coding Assessment', question: 'Cycle detection in Linked List using Floyd\'s.', options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'], correct: 0 },
    { id: 48, section: 'Coding Assessment', question: 'Kadane\'s Algorithm for Max Subarray.', options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'], correct: 0 },

    // Computer Fundamentals (15 Qs)
    { id: 49, section: 'Computer Fundamentals', question: 'Layer 3 of OSI?', options: ['Network', 'Data', 'Session', 'Physical'], correct: 0 },
    { id: 50, section: 'Computer Fundamentals', question: 'What is a Semaphore?', options: ['Sync Tool', 'Memory', 'Device', 'Variable'], correct: 0 },
    { id: 51, section: 'Computer Fundamentals', question: 'SQL: Remove all records?', options: ['TRUNCATE', 'DELETE', 'DROP', 'REMOVE'], correct: 0 },
    { id: 52, section: 'Computer Fundamentals', question: 'Port 80?', options: ['HTTP', 'HTTPS', 'FTP', 'SSH'], correct: 0 },
    { id: 53, section: 'Computer Fundamentals', question: 'Constructor in C++?', options: ['Initialization', 'Destruction', 'Memory', 'Pointer'], correct: 0 },
    { id: 54, section: 'Computer Fundamentals', question: 'Is Java Compiled?', options: ['Both', 'Compiled', 'Interpreted', 'No'], correct: 0 },
    { id: 55, section: 'Computer Fundamentals', question: 'Fastest Cache?', options: ['L1', 'L2', 'L3', 'RAM'], correct: 0 },
    { id: 56, section: 'Computer Fundamentals', question: 'DB: 3NF?', options: ['Normalization', 'SQL', 'Query', 'Table'], correct: 0 },
    { id: 57, section: 'Computer Fundamentals', question: 'Python list vs tuple?', options: ['Mutability', 'Speed', 'Size', 'Index'], correct: 0 },
    { id: 58, section: 'Computer Fundamentals', question: 'IP Address size?', options: ['32 bits', '64 bits', '16 bits', '8 bits'], correct: 0 },
    { id: 59, section: 'Computer Fundamentals', question: 'What is Paging?', options: ['Memory Mgmt', 'File Mgmt', 'CPU Mgmt', 'Device Mgmt'], correct: 0 },
    { id: 60, section: 'Computer Fundamentals', question: 'Deadlock condition?', options: ['Mutual Exclusion', 'No preemption', 'Both', 'Neither'], correct: 2 },
    { id: 61, section: 'Computer Fundamentals', question: 'SQL ACID?', options: ['Atomicity', 'Availability', 'Speed', 'Size'], correct: 0 },
    { id: 62, section: 'Computer Fundamentals', question: 'Binary of 15?', options: ['1111', '1010', '1100', '1001'], correct: 0 },
    { id: 63, section: 'Computer Fundamentals', question: 'Kernel is?', options: ['OS Core', 'Software', 'Hardware', 'Shell'], correct: 0 },

    // Psychometric (50 Qs)
    ...Array.from({ length: 50 }, (_, i) => ({
        id: 64 + i,
        section: 'Psychometric Test',
        question: `Behavioral Assessment Q${i + 1}: I stay calm in high-pressure situations.`,
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
        correct: 0
    })),

    // Written English Test (1 Q)
    { id: 114, section: 'Written English Test (WET)', question: 'Essay: The Impact of AI on Future Jobs.', options: ['Draft', 'Submit', 'Edit', 'Clear'], correct: 0 },

    // Dept. Domain Based Test (30 Qs)
    ...Array.from({ length: 30 }, (_, i) => ({
        id: 115 + i,
        section: 'Dept. Domain Based Test',
        question: `Domain Expertise Q${i + 1}: Core concept evaluation in branch specialization.`,
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correct: 0
    }))
];

const MODULE_CONFIG = [
    { name: 'Analytical, Reasoning & Verbal', q: 45, t: 45 * 60, icon: <Calculator size={14} />, color: 'var(--blue)', desc: 'Aptitude & Logical reasoning' },
    { name: 'Coding Assessment', q: 3, t: 30 * 60, icon: <Code size={14} />, color: 'var(--orange)', desc: '2 Basic, 1 Advanced coding' },
    { name: 'Computer Fundamentals', q: 15, t: 15 * 60, icon: <BookOpen size={14} />, color: 'var(--green)', desc: 'OS, DBMS & Networking' },
    { name: 'Psychometric Test', q: 50, t: 12 * 60, icon: <Target size={14} />, color: 'var(--purple)', desc: 'Behavioral assessment' },
    { name: 'Written English Test (WET)', q: 1, t: 25 * 60, icon: <MessageSquare size={14} />, color: 'var(--blue)', desc: 'AI-evaluated essay' },
    { name: 'Dept. Domain Based Test', q: 30, t: 30 * 60, icon: <Zap size={14} />, color: 'var(--orange)', desc: 'Core branch subjects' },
];

const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVars = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

const BatchTest = () => {
    const [gameState, setGameState] = useState('landing'); // landing, instruction, quiz, results
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(MODULE_CONFIG[0].t);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [violations, setViolations] = useState(0);

    // Get current module questions
    const currentModule = MODULE_CONFIG[currentModuleIndex];
    const moduleQuestions = cocubesQuestions.filter(q => q.section === currentModule.name);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && gameState === 'quiz') {
                setViolations(prev => prev + 1);
                if (violations >= 2) {
                    alert('CRITICAL VIOLATION: Maximum tab switches exceeded. The test will now be submitted automatically.');
                    setGameState('results');
                    setIsTimerRunning(false);
                } else {
                    alert(`WARNING: Tab switching detected! This incident has been logged. \nAttempts remaining: ${2 - violations}`);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [gameState, violations]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && isTimerRunning) {
            handleModuleTransition();
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const handleModuleTransition = () => {
        if (currentModuleIndex < MODULE_CONFIG.length - 1) {
            alert(`Section time up! Moving to the next module: ${MODULE_CONFIG[currentModuleIndex + 1].name}`);
            const nextIdx = currentModuleIndex + 1;
            setCurrentModuleIndex(nextIdx);
            setCurrentQuestion(0);
            setTimer(MODULE_CONFIG[nextIdx].t);
        } else {
            finishQuiz();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startQuiz = () => {
        setGameState('quiz');
        setIsTimerRunning(true);
    };

    const handleAnswer = (optionIdx) => {
        const questionIdInGlobal = cocubesQuestions.indexOf(moduleQuestions[currentQuestion]);
        setAnswers({ ...answers, [questionIdInGlobal]: optionIdx });
    };

    const nextQuestion = () => {
        if (currentQuestion < moduleQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else if (currentModuleIndex < MODULE_CONFIG.length - 1) {
            if (window.confirm(`Finish ${currentModule.name} and move to the next section?`)) {
                handleModuleTransition();
            }
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const finishQuiz = () => {
        setIsTimerRunning(false);
        setGameState('submitting');
        
        // Simulate processing time for AI evaluation
        setTimeout(() => {
            setGameState('results');
        }, 3500);
    };

    const calculateScore = () => {
        let correct = 0;
        cocubesQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        return {
            correct,
            total: cocubesQuestions.length,
            percent: Math.round((correct / cocubesQuestions.length) * 100)
        };
    };

    // Render Landing Page
    if (gameState === 'landing') {
        return (
            <div className="app-page on practice-page">
                <div className="practice-shell">
                    <div className="practice-hero">
                        <div>
                            <div className="practice-kicker">Multi-Module Assessments</div>
                            <h1 className="practice-title">Batch Test Center</h1>
                            <p className="practice-subtitle">
                                Simulated recruitment tests for major assessment platforms like CoCubes, AMCAT, and eLitmus. Complete modules to benchmark your skills.
                            </p>
                        </div>

                        <div className="practice-summary-grid">
                            <div className="practice-summary-card">
                                <span>Active Modules</span>
                                <strong>6</strong>
                            </div>
                            <div className="practice-summary-card">
                                <span>Total Duration</span>
                                <strong style={{ color: 'var(--orange)' }}>~160m</strong>
                            </div>
                            <div className="practice-summary-card">
                                <span>Questions</span>
                                <strong>140+</strong>
                            </div>
                            <div className="practice-summary-card">
                                <span>Avg. Accuracy</span>
                                <strong>85%</strong>
                            </div>
                        </div>
                    </div>

                    <motion.div variants={containerVars} initial="hidden" animate="show" className="practice-section">
                        <div className="section-hdr mb32">
                            <div>
                                <h2 className="section-title">Featured Assessments</h2>
                                <p className="section-sub">Standardized recruitment simulations for major assessment platforms.</p>
                            </div>
                        </div>

                        {/* Featured CoCubes Card */}
                        <div className="practice-insight-card mb48" style={{ background: 'linear-gradient(135deg, rgba(28,28,28,0.4) 0%, rgba(249,115,22,0.05) 100%)' }}>
                            <div className="practice-insight-head">
                                <div>
                                    <div className="practice-kicker" style={{ color: 'var(--orange)' }}>Recommended for Final Year Students</div>
                                    <h2 className="section-title fs28" style={{ marginBottom: 12 }}>CoCubes Master Assessment</h2>
                                    <p className="section-sub fs15" style={{ maxWidth: 600 }}>
                                        Experience the full 2024-25 recruitment cycle simulation. Covers Analytical, Coding, Computer Fundamentals, Psychometric, WET, and Domain tests.
                                    </p>
                                </div>
                                <div className="practice-insight-badge" style={{ background: 'var(--orange-d)', color: 'var(--orange)', borderColor: 'var(--orange-b)' }}>
                                    <Sparkles size={16} />
                                    <span>Most Popular</span>
                                </div>
                            </div>

                            <div className="practice-insight-grid">
                                <div className="practice-insight-panel">
                                    <div className="practice-insight-metric">
                                        <span>Modules</span>
                                        <strong>6 Sections</strong>
                                    </div>
                                    <div className="practice-insight-metric">
                                        <span>Est. Time</span>
                                        <strong style={{ color: 'var(--orange)' }}>160 Mins</strong>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary px32 py14 fs15 fw900 shadow-xl"
                                        onClick={() => setGameState('instruction')}
                                    >
                                        <span>Configure Test</span>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="practice-insight-panel" style={{ gridColumn: 'span 2' }}>
                                    <div className="practice-insight-subtitle mb16">Test Blueprint</div>
                                    <div className="grid grid-cols-2 gap-x-24 gap-y-12">
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Aptitude & Reasoning</div>
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Coding (3 Questions)</div>
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Computer Fundamentals</div>
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Psychometric Analysis</div>
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Written English (AI-Eval)</div>
                                        <div className="faic gap10 fs13 color-t2"><CheckCircle size={14} className="color-orange" /> Domain Specific Test</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section-hdr mb20">
                            <div>
                                <h2 className="section-title">Other Platforms</h2>
                                <p className="section-sub">More assessment simulations unlocking soon based on your progress.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                            {/* AMCAT Card */}
                            <div className="practice-insight-card p32" style={{ background: 'linear-gradient(135deg, rgba(28,28,28,0.4) 0%, rgba(59,130,246,0.05) 100%)' }}>
                                <div className="faic jsb mb20">
                                    <div className="si-o p10 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}><Zap size={24} /></div>
                                    <div className="badge-lg fs11 fw800 uppercase" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--blue)', border: 'none' }}>Adaptive Assessment</div>
                                </div>
                                <h3 className="fs22 fw800 color-t1 mb8">AMCAT Simulation</h3>
                                <p className="fs14 color-t3 mb24">Computer Adaptive Test for Aspiring Minds. Includes Automata Fix, Quants, and Logical.</p>
                                <div className="grid grid-cols-2 gap-12 mb28">
                                    <div className="fs12 color-t4 fw700 faic gap6"><Clock size={14} /> 120 Mins</div>
                                    <div className="fs12 color-t4 fw700 faic gap6"><CheckCircle size={14} /> 4 Modules</div>
                                </div>
                                <button className="btn btn-outline w100 py14 fs14 fw800 opacity-50 cursor-not-allowed">
                                    <span>Unlocked at Level 5</span>
                                </button>
                            </div>

                            {/* eLitmus Card */}
                            <div className="practice-insight-card p32" style={{ background: 'linear-gradient(135deg, rgba(28,28,28,0.4) 0%, rgba(168,85,247,0.05) 100%)' }}>
                                <div className="faic jsb mb20">
                                    <div className="si-o p10 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--purple)' }}><Target size={24} /></div>
                                    <div className="badge-lg fs11 fw800 uppercase" style={{ background: 'rgba(168,85,247,0.1)', color: 'var(--purple)', border: 'none' }}>High-IQ pH Test</div>
                                </div>
                                <h3 className="fs22 fw800 color-t1 mb8">eLitmus pH Test</h3>
                                <p className="fs14 color-t3 mb24">Elite problem solving and logical reasoning simulation with percentile benchmarking.</p>
                                <div className="grid grid-cols-2 gap-12 mb28">
                                    <div className="fs12 color-t4 fw700 faic gap6"><Clock size={14} /> 180 Mins</div>
                                    <div className="fs12 color-t4 fw700 faic gap6"><CheckCircle size={14} /> 3 Modules</div>
                                </div>
                                <button className="btn btn-outline w100 py14 fs14 fw800 opacity-50 cursor-not-allowed">
                                    <span>Unlocked at Level 12</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Render Instructions
    // Render Instructions
    if (gameState === 'instruction') {
        return (
            <div className="app-page on practice-page">
                <div className="practice-shell p28">
                    <div className="max-w-5xl mx-auto">
                        <div className="section-hdr mb40 faic jsb">
                            <div>
                                <div className="practice-kicker color-orange">Official Pattern 2024-25</div>
                                <h1 className="section-title fs32">CoCubes Master Assessment</h1>
                                <p className="section-sub">Please read all instructions carefully before starting the sequential assessment.</p>
                            </div>
                            <button 
                                className="btn btn-ghost faic gap8 opacity-70 hover-opacity-100"
                                onClick={() => setGameState('landing')}
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
                            <div className="lg:col-span-2">
                                <div className="practice-insight-card p32 mb32">
                                    <h3 className="fs18 fw800 color-t1 mb20">Test Structure & Sequential Modules</h3>
                                    <div className="grid grid-cols-1 gap-12">
                                        {MODULE_CONFIG.map((mod, idx) => (
                                            <div key={idx} className="p16 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-5 faic jsb">
                                                <div className="faic gap16">
                                                    <div className="w32 h32 rounded-lg faic jcc" style={{ background: mod.color + '20', color: mod.color }}>
                                                        {mod.icon}
                                                    </div>
                                                    <div>
                                                        <div className="fs14 fw800 color-t1">{mod.name}</div>
                                                        <div className="fs11 color-t3">{mod.desc}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="fs13 fw900 color-t1">{mod.q} Questions</div>
                                                    <div className="fs11 color-t4">{Math.floor(mod.t / 60)} Minutes</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="practice-insight-card p32">
                                    <h3 className="fs18 fw800 color-t1 mb20">General Rules</h3>
                                    <div className="g1 gap16">
                                        <div className="faic gap12 fs14 color-t3">
                                            <div className="w6 h6 rounded-full bg-orange-500" />
                                            Each section has a **dedicated timer**. Unused time does not carry forward.
                                        </div>
                                        <div className="faic gap12 fs14 color-t3">
                                            <div className="w6 h6 rounded-full bg-orange-500" />
                                            Once a section is submitted, you **cannot return** to it.
                                        </div>
                                        <div className="faic gap12 fs14 color-t3">
                                            <div className="w6 h6 rounded-full bg-orange-500" />
                                            Real-time AI proctoring is enabled. Tab switching will log a violation.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="practice-insight-card p32 mb24" style={{ border: '1px solid var(--orange-b)' }}>
                                    <div className="si-o p12 rounded-xl mb20" style={{ background: 'var(--orange-d)', color: 'var(--orange)' }}>
                                        <Shield size={24} />
                                    </div>
                                    <h3 className="fs18 fw800 color-t1 mb12">System Check</h3>
                                    <p className="fs13 color-t3 mb20">Ensure your webcam is clear and functional for the proctoring module.</p>
                                    <div className="p12 rounded-lg bg-emerald-500 bg-opacity-10 color-green fs12 fw700 faic gap8">
                                        <CheckCircle size={14} /> Webcam Ready
                                    </div>
                                </div>

                                <button 
                                    className="btn btn-primary w100 py16 fs16 fw900 shadow-xl"
                                    onClick={startQuiz}
                                >
                                    Start Full Assessment
                                </button>
                                <p className="fs11 color-t4 text-center mt16 uppercase tracking-widest fw700">Total Duration: ~160 Mins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Quiz
    if (gameState === 'quiz') {
        const q = moduleQuestions[currentQuestion];
        if (!q) return null;

        const globalIdx = cocubesQuestions.indexOf(q);
        const totalProgress = ((currentModuleIndex * 10 + currentQuestion) / cocubesQuestions.length) * 100;

        return (
            <div className="app-page on practice-page p0 overflow-hidden" style={{ background: '#f4f7f9', height: '100vh', display: 'flex', flexDirection: 'column', color: '#333', fontFamily: 'Inter, sans-serif' }}>
                
                {/* Official CoCubes Header */}
                <header className="px24 py14 jsb faic" style={{ background: '#fff', borderBottom: '1px solid #d1d9e2', zIndex: 100 }}>
                    <div className="faic gap24">
                        <div className="fs24 fw900 tracking-tighter" style={{ color: '#0052cc' }}>
                            Co<span style={{ color: '#f58220' }}>Cubes</span> <span className="fs12 fw500 color-t4 ml8 opacity-50">Employability Assessment</span>
                        </div>
                    </div>

                    <div className="faic gap40">
                        <div className="faic gap12">
                            <div className="text-right">
                                <div className="fs10 fw800 color-t4 uppercase mb2">Test Timer</div>
                                <div className={`fs20 fw900 font-mono ${timer < 60 ? 'color-red' : '#333'}`}>
                                    {formatTime(timer)}
                                </div>
                            </div>
                            <div className="w1 h32 bg-gray-200 mx16" />
                            <div className="faic gap12">
                                <div className="text-right">
                                    <div className="fs12 fw800 m0">Ganesh Prabhu</div>
                                    <div className="fs10 color-t4 fw700 uppercase">Candidate ID: 88394</div>
                                </div>
                                <div className="w40 h40 rounded-full bg-gray-100 border border-gray-200 faic jcc overflow-hidden">
                                    <User size={22} className="color-t4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Section Navigation Tabs */}
                <div className="px24 py0 flex faic bg-white" style={{ borderBottom: '1px solid #d1d9e2' }}>
                    {MODULE_CONFIG.map((mod, idx) => (
                        <div 
                            key={idx}
                            className={`px32 py14 fs12 fw700 uppercase tracking-wide cursor-pointer transition-all ${currentModuleIndex === idx ? 'color-blue border-b-3' : 'color-t4'}`}
                            style={{ 
                                color: currentModuleIndex === idx ? '#0052cc' : '#777',
                                borderBottom: currentModuleIndex === idx ? '3px solid #0052cc' : '3px solid transparent',
                                marginBottom: '-1px'
                            }}
                        >
                            {mod.name}
                        </div>
                    ))}
                    <div className="flex-1" />
                    <button className="btn px20 py-8 fs11 fw900 text-white shadow-sm" style={{ background: '#28a745', borderRadius: '4px' }} onClick={() => { if(window.confirm('Submit Assessment?')) finishQuiz() }}>
                        SUBMIT TEST
                    </button>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '20px', gap: '20px', background: '#f4f7f9' }}>
                    {/* Left Side: Question Content */}
                    <div className="flex-1 flex-col gap20 overflow-hidden" style={{ display: 'flex' }}>
                        <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm overflow-y-auto p48 custom-scrollbar relative">
                            <div className="jsb faic mb40 pb20" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <div className="fs15 fw800 color-t1">
                                    Question No. {currentQuestion + 1}
                                </div>
                                <div className="faic gap12">
                                    <span className="badge fs10 fw900 bg-green-50 color-green border-none">Correct: +1.0</span>
                                    <span className="badge fs10 fw900 bg-red-50 color-red border-none">Negative: -0.25</span>
                                </div>
                            </div>
                            
                            <div className="mt20">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {currentModule.name === 'Coding Assessment' ? (
                                            <div className="space-y-24">
                                                <div className="p24 bg-gray-50 border border-gray-100 rounded">
                                                    <div className="fs13 fw700 color-blue mb12 uppercase">Problem Statement</div>
                                                    <div className="fs16 color-t1 leading-relaxed">{q.question}</div>
                                                </div>
                                                <div className="rounded border border-gray-200 overflow-hidden">
                                                    <div className="bg-gray-100 px16 py8 jsb faic border-b border-gray-200">
                                                        <span className="fs11 fw700 color-t4 uppercase">Solution Editor (C++)</span>
                                                        <div className="faic gap12">
                                                            <button className="fs11 fw700 color-blue uppercase">Compile</button>
                                                            <button className="fs11 fw700 color-blue uppercase">Run Tests</button>
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        className="w100 p24 font-mono fs14 color-t1 outline-none border-none"
                                                        style={{ minHeight: '350px', background: '#fafafa' }}
                                                        placeholder="// Implement your algorithm here..."
                                                        value={answers[globalIdx] || ''}
                                                        onChange={(e) => handleAnswer(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ) : currentModule.name === 'Written English Test (WET)' ? (
                                            <div className="space-y-24">
                                                <div className="p24 bg-gray-50 border border-gray-100 rounded">
                                                    <div className="fs13 fw700 color-blue mb12 uppercase">Essay Prompt</div>
                                                    <div className="fs16 color-t1 leading-relaxed italic">{q.question}</div>
                                                </div>
                                                <div className="relative">
                                                    <textarea 
                                                        className="w100 p32 rounded border border-gray-200 fs16 color-t1 outline-none focus-border-blue transition-all"
                                                        style={{ minHeight: '380px', lineHeight: '1.8' }}
                                                        placeholder="Start typing your response..."
                                                        value={answers[globalIdx] || ''}
                                                        onChange={(e) => handleAnswer(e.target.value)}
                                                    />
                                                    <div className="mt12 jsb faic">
                                                        <div className="fs12 fw800 color-t4">WORD COUNT: <span className="color-blue">{(answers[globalIdx] || '').split(/\s+/).filter(x => x).length}</span></div>
                                                        <div className="fs11 fw800 color-green uppercase">Auto-saving...</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-40">
                                                <div className="fs20 fw500 color-t1 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                                                    {q.question}
                                                </div>

                                                <div className="mt40" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                                    {q.options.map((opt, idx) => (
                                                        <label 
                                                            key={idx}
                                                            className={`p20 rounded border-2 cursor-pointer faic gap16 transition-all ${
                                                                answers[globalIdx] === idx 
                                                                ? 'border-blue-500 bg-blue-50' 
                                                                : 'border-gray-100 hover-bg-gray-50'
                                                            }`}
                                                            style={{ 
                                                                borderColor: answers[globalIdx] === idx ? '#0052cc' : '#eee',
                                                                background: answers[globalIdx] === idx ? '#f0f7ff' : '#fff'
                                                            }}
                                                            onClick={() => handleAnswer(idx)}
                                                        >
                                                            <div className={`w22 h22 rounded-full border-2 faic jcc ${
                                                                answers[globalIdx] === idx 
                                                                ? 'bg-blue-500 border-blue-500' 
                                                                : 'border-gray-300'
                                                            }`} style={{ 
                                                                background: answers[globalIdx] === idx ? '#0052cc' : 'transparent',
                                                                borderColor: answers[globalIdx] === idx ? '#0052cc' : '#ccc'
                                                            }}>
                                                                {answers[globalIdx] === idx && <div className="w6 h6 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`fs16 ${answers[globalIdx] === idx ? 'fw700 color-blue' : 'color-t2'}`} style={{ color: answers[globalIdx] === idx ? '#0052cc' : '#333' }}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Button Bar */}
                        <div className="jsb faic gap16">
                            <div className="faic gap12">
                                <button className="btn border-2 px24 py-12 fs13 fw800 shadow-sm" style={{ borderColor: '#d1d9e2', color: '#555', background: '#fff', borderRadius: '4px' }}
                                        onClick={prevQuestion} disabled={currentQuestion === 0}>
                                    PREVIOUS
                                </button>
                                <button className="btn btn-primary px48 py-12 fs13 fw800 shadow-md" style={{ background: '#0052cc', borderRadius: '4px' }} onClick={nextQuestion}>
                                    SAVE & NEXT
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Palette & Status */}
                    <aside className="w320 flex-col gap24 overflow-hidden" style={{ display: 'flex' }}>
                        
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p24 flex-1 overflow-y-auto custom-scrollbar">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="mb24 pb24 border-b border-gray-100">
                                <button className="btn border-2 px-4 py-10 fs10 fw800 bg-white" style={{ borderColor: '#d1d9e2', borderRadius: '4px' }}
                                        onClick={() => { nextQuestion(); }}>
                                    MARK FOR REVIEW & NEXT
                                </button>
                                <button className="btn border-2 px-4 py-10 fs10 fw800 bg-white" style={{ borderColor: '#d1d9e2', borderRadius: '4px' }}
                                        onClick={() => handleAnswer(undefined)}>
                                    CLEAR RESPONSE
                                </button>
                            </div>

                            <div className="faic gap12 mb24 pb20" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <div className="w56 h56 rounded-sm bg-gray-100 faic jcc overflow-hidden border border-gray-200">
                                    <User size={32} className="color-t4" />
                                </div>
                                <div>
                                    <div className="fs13 fw900 m0 uppercase">Ganesh Prabhu</div>
                                    <div className="fs10 color-t4 fw800 uppercase mt2">Module: {currentModuleIndex + 1} / 6</div>
                                </div>
                            </div>

                            <div className="fs11 fw800 color-t4 uppercase tracking-widest mb16">Question Palette</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }} className="mb40">
                                {moduleQuestions.map((qInMod, idx) => {
                                    const gIdx = cocubesQuestions.indexOf(qInMod);
                                    let statusColor = '#f0f2f5'; // Not Visited
                                    let textColor = '#555';
                                    let borderRadius = '2px';

                                    if (currentQuestion === idx) {
                                        statusColor = '#fff';
                                        textColor = '#0052cc';
                                    } else if (answers[gIdx] !== undefined) {
                                        statusColor = '#28a745'; // Green
                                        textColor = '#fff';
                                    } else if (idx < currentQuestion) {
                                        statusColor = '#dc3545'; // Red
                                        textColor = '#fff';
                                    }

                                    return (
                                        <button 
                                            key={idx} 
                                            className={`faic jcc fs14 fw800 transition-all ${currentQuestion === idx ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                            style={{ 
                                                width: '44px',
                                                height: '44px',
                                                background: statusColor, 
                                                color: textColor,
                                                borderRadius: borderRadius,
                                                border: currentQuestion === idx ? '2px solid #0052cc' : '1px solid #d1d9e2'
                                            }}
                                            onClick={() => setCurrentQuestion(idx)}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-12 pt24" style={{ borderTop: '1px solid #f0f0f0' }}>
                                <div className="fs10 fw800 color-t4 uppercase mb12 tracking-wider">Legend</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="fs10 fw800">
                                    <div className="faic gap10"><div className="w14 h14 bg-green-600 rounded-sm" /> Answered</div>
                                    <div className="faic gap10"><div className="w14 h14 bg-red-600 rounded-sm" /> Not Answered</div>
                                    <div className="faic gap10"><div className="w14 h14 bg-gray-200 rounded-sm" /> Not Visited</div>
                                    <div className="faic gap10"><div className="w14 h14 bg-purple-600 rounded-sm" /> Marked</div>
                                </div>
                            </div>
                        </div>

                        {/* Proctoring View */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p16">
                            <div className="relative rounded-sm overflow-hidden aspect-video bg-gray-900 border border-gray-300 shadow-inner mb12">
                                <div className="absolute inset-0 faic jcc">
                                    <User size={32} className="color-t4 opacity-20" />
                                </div>
                                <div className="absolute top-8 left-8 faic gap4 px8 py4 rounded-sm bg-red-600 text-white fs9 fw900 tracking-tighter">
                                    <div className="w4 h4 rounded-full bg-white animate-pulse" /> LIVE STREAM
                                </div>
                            </div>
                            <div className="faic jsb">
                                <div className="fs10 fw900 color-t4 uppercase">AI Proctoring Status</div>
                                <div className="fs10 fw900 color-green">ACTIVE</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }
    
    // Render Submitting State
    if (gameState === 'submitting') {
        return (
            <div className="app-page on faic jcc bg-white" style={{ height: '100vh', flexDirection: 'column' }}>
                <div className="text-center space-y-32">
                    <div className="relative w120 h120 mx-auto">
                        <motion.div 
                            className="absolute inset-0 border-4 border-blue-100 rounded-full"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="absolute inset-0 faic jcc">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader size={48} className="color-blue" style={{ color: '#0052cc' }} />
                            </motion.div>
                        </div>
                    </div>
                    <div>
                        <h2 className="fs28 fw900 color-t1 mb8" style={{ color: '#0052cc' }}>Submitting Assessment...</h2>
                        <p className="fs16 color-t4">Please do not refresh or close the window.</p>
                    </div>
                    <div className="w320 mx-auto space-y-12">
                        {['Verifying logs...', 'Analyzing performance...', 'Finalizing results...'].map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.8 }}
                                className="faic gap12 fs13 fw700 color-t3 bg-gray-50 p12 rounded border border-gray-100"
                            >
                                <CheckCircle size={16} className="color-green" />
                                {step}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Render Results
    if (gameState === 'results') {
        const stats = MODULE_CONFIG.map((mod, mIdx) => {
            const modQs = cocubesQuestions.filter(q => q.section === mod.name);
            const correct = modQs.filter(q => {
                const gIdx = cocubesQuestions.indexOf(q);
                return answers[gIdx] === q.correct;
            }).length;
            return { name: mod.name, score: (correct / modQs.length) * 100, raw: `${correct}/${modQs.length}` };
        });

        const overallScore = stats.reduce((acc, s) => acc + s.score, 0) / stats.length;

        return (
            <div className="app-page on overflow-y-auto bg-gray-50 p48 custom-scrollbar" style={{ color: '#333' }}>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="jsb faic mb48">
                        <div>
                            <div className="badge-lg fs12 fw900 bg-green-100 color-green uppercase tracking-widest mb12 border-none px12 py4" style={{ borderRadius: '4px' }}>Assessment Completed</div>
                            <h1 className="fs40 fw900 color-t1 m0 tracking-tight">Employment <span style={{ color: '#0052cc' }}>Eligibility Report</span></h1>
                        </div>
                        <div className="faic gap16">
                            <button className="btn border-2 px24 py-12 fs13 fw800 bg-white" style={{ borderColor: '#d1d9e2', borderRadius: '4px' }}>
                                <Download size={16} className="mr8" /> Download PDF
                            </button>
                            <button className="btn btn-primary px24 py-12 fs13 fw800 shadow-lg" style={{ background: '#0052cc', borderRadius: '4px' }} onClick={() => window.location.reload()}>
                                Return Home
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-32">
                        {/* Score Overview */}
                        <div className="col-span-12 lg:col-span-4 space-y-32">
                            <div className="bg-white border border-gray-200 p40 rounded-sm shadow-sm text-center">
                                <div className="fs14 fw800 color-t4 uppercase tracking-widest mb24">Overall Percentile</div>
                                <div className="relative w200 h200 mx-auto mb32">
                                    <svg width="200" height="200" className="transform -rotate-90">
                                        <circle cx="100" cy="100" r="85" fill="none" stroke="#f0f7ff" strokeWidth="15" />
                                        <motion.circle 
                                            cx="100" cy="100" r="85" fill="none" stroke="#0052cc" strokeWidth="15" 
                                            strokeDasharray={534}
                                            initial={{ strokeDashoffset: 534 }}
                                            animate={{ strokeDashoffset: 534 - (534 * overallScore) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 faic jcc flex-col">
                                        <span className="fs48 fw900 color-t1">{Math.round(overallScore)}%</span>
                                        <span className="fs12 fw700 color-t4 uppercase">Score</span>
                                    </div>
                                </div>
                                <div className="p20 rounded bg-blue-50 border border-blue-100">
                                    <div className="fs14 fw800 color-blue uppercase mb4">Job Eligibility</div>
                                    <div className="fs12 color-t3">You are eligible for <b className="color-t1">Top-Tier Product</b> roles.</div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 p32 rounded-sm shadow-sm">
                                <h3 className="fs18 fw800 color-t1 mb24">Sectional Breakdown</h3>
                                <div className="space-y-20">
                                    {stats.map((s, i) => (
                                        <div key={i}>
                                            <div className="jsb mb8 fs12 fw700 uppercase tracking-wide">
                                                <span className="color-t3">{s.name}</span>
                                                <span className="color-t1">{s.raw}</span>
                                            </div>
                                            <div className="w100 h8 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h100"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${s.score}%` }}
                                                    style={{ background: '#0052cc' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Radar Chart & Insights */}
                        <div className="col-span-12 lg:col-span-8 space-y-32">
                            <div className="bg-white border border-gray-200 p48 rounded-sm shadow-sm">
                                <div className="jsb faic mb40">
                                    <div>
                                        <h3 className="fs24 fw900 color-t1 m0">Skill Visualization</h3>
                                        <p className="fs14 color-t4 mt4">Employability profile across all core domains.</p>
                                    </div>
                                    <Radar size={24} className="color-blue" />
                                </div>
                                <div className="faic jcc py40">
                                    <RadarChart data={stats} size={400} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-24">
                                <div className="bg-white border border-gray-200 p32 rounded-sm shadow-sm border-l-4 border-l-green-500">
                                    <h4 className="fs16 fw900 color-t1 mb12">Top Strength</h4>
                                    <div className="fs14 color-t3 leading-relaxed">
                                        Your analytical reasoning skills are exceptional. This indicates strong logical deduction and critical thinking.
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 p32 rounded-sm shadow-sm border-l-4 border-l-orange-500">
                                    <h4 className="fs16 fw900 color-t1 mb12">Growth Area</h4>
                                    <div className="fs14 color-t3 leading-relaxed">
                                        Focus on **Speed & Accuracy** in technical fundamentals to further improve your global ranking.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default BatchTest;
