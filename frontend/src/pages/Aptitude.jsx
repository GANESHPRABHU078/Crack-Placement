import React, { useState, useEffect } from 'react';
import { aptitudeService } from '../api/aptitudeService';
import { CheckCircle, XCircle, Zap, Target, Clock } from 'lucide-react';

const QUIZ_LENGTH = 15;

const topicCatalog = [
    { id: 'quant', title: 'Quantitative Aptitude', desc: 'Number systems, Algebra, Geometry, Arithmetic, Permutation & Combination', icon: '➗', color: '#f59e0b', problems: 85, difficulty: 'Mixed', avgTime: 2.5, bestScore: 92 },
    { id: 'logical', title: 'Logical Reasoning', desc: 'Puzzles, Blood relations, Syllogisms, Sequences, Series, Coding-Decoding', icon: '🧠', color: '#8b5cf6', problems: 65, difficulty: 'Mixed', avgTime: 3, bestScore: 88 },
    { id: 'verbal', title: 'Verbal Ability', desc: 'RC, Grammar, Vocabulary, Sentence correction, Synonyms-Antonyms', icon: '📝', color: '#10b981', problems: 55, difficulty: 'Easy-Medium', avgTime: 2, bestScore: 95 },
    { id: 'data', title: 'Data Interpretation', desc: 'Bar/Pie/Line graphs, Tables, Caselet, Mixed DI problems', icon: '📊', color: '#3b82f6', problems: 45, difficulty: 'Medium-Hard', avgTime: 3.5, bestScore: 85 },
    { id: 'core', title: 'Core CS Subjects', desc: 'OS, DBMS, Networks, OOP, DSA, Trees, Graphs, Algorithms', icon: '💻', color: '#ec4899', problems: 95, difficulty: 'Hard', avgTime: 4, bestScore: 80 },
    { id: 'dsa', title: 'DSA & Math Patterns', desc: 'Hypotenuse, Z Numbers, Prime, GCD, Patterns, Array Operations', icon: '🔢', color: '#a78bfa', problems: 110, difficulty: 'Hard', avgTime: 3.5, bestScore: 82 },
    { id: 'encod', title: 'Encoding & Decoding', desc: 'Caesar Cipher, Binary, Pattern Encoding, Reversal, String Manipulation', icon: '🔐', color: '#f97316', problems: 50, difficulty: 'Medium', avgTime: 2.5, bestScore: 87 },
    { id: 'company', title: 'Company Specific', desc: 'TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini mock tests', icon: '🏢', color: '#f97316', problems: 120, difficulty: 'Mixed', avgTime: 60, bestScore: 76 }
];

const allQuestions = {
  quant: [
    {
      category: 'Quantitative',
      subcategory: 'Train Problems',
      question: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
      options: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Relative speed = 125/10 m/sec = 12.5 m/sec = (12.5 × 18/5) km/hr = 45 km/hr. Therefore, train speed = (45 + 5) km/hr = 50 km/hr.',
      time: 2
    },
    {
      category: 'Quantitative',
      subcategory: 'Percentage',
      question: 'If the price of petrol increases by 25%, by how much must a user decrease consumption so that expenditure remains the same?',
      options: ['25%', '20%', '15%', '30%'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'If price increases by 25%, then new price = 1.25P. For expenditure to remain same, Q × 1.25P = (Q - x) × P. Solving: x = 0.2Q = 20% decrease',
      time: 2
    },
    {
      category: 'Quantitative',
      subcategory: 'Profit & Loss',
      question: 'A shopkeeper buys 200 pens at Rs. 8 each. He marks them at Rs. 12 each but gives 10% discount. What is his profit %?',
      options: ['25%', '35%', '40%', '20%'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'Cost = 200 × 8 = Rs. 1600. Selling Price = 200 × 12 × 0.9 = Rs. 2160. Profit = 2160 - 1600 = 560. Profit % = (560/1600) × 100 = 35%',
      time: 3
    },
    {
      category: 'Quantitative',
      subcategory: 'Average',
      question: 'The average of 5 numbers is 20. If one number is replaced by 30, the new average becomes 22. What was the original number?',
      options: ['10', '15', '20', '25'],
      correctAnswer: 0,
      difficulty: 'Medium',
      explanation: 'Sum of 5 numbers = 5 × 20 = 100. After replacement, sum = 5 × 22 = 110. The new sum is 10 more than the old sum. Since the new number is 30, the old number must be 30 - 10 = 20.',
      time: 2.5
    }
  ],
  logical: [
    {
      category: 'Logical Reasoning',
      subcategory: 'Series',
      question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
      options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'This is a simple alternating division sequence: each number is one-half of the previous number. 2 → 1 → 0.5 → 0.25 → 0.125 = 1/8',
      time: 2
    },
    {
      category: 'Logical Reasoning',
      subcategory: 'Blood Relations',
      question: 'A is the brother of B. B is the sister of C. C is the mother of D. How is A related to D?',
      options: ['Father', 'Uncle', 'Brother', 'Grandfather'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'A is brother of B. B is sister of C means C is B\'s sibling. C is mother of D. So A is uncle of D (A is C\'s brother).',
      time: 2
    },
    {
      category: 'Logical Reasoning',
      subcategory: 'Puzzle',
      question: 'In a row of 7 children, A is at position 3. B is 2 positions to the right of A. Where is B?',
      options: ['Position 4', 'Position 5', 'Position 6', 'Position 7'],
      correctAnswer: 2,
      difficulty: 'Easy',
      explanation: 'A is at position 3. B is 2 positions to the right, which means B is at position 3 + 2 = 5.',
      time: 1.5
    },
    {
      category: 'Logical Reasoning',
      subcategory: 'Coding-Decoding',
      question: 'If PAINT is coded as RCMRV, how is FLOW coded?',
      options: ['HNQZ', 'HPQX', 'HNPY', 'HMPU'],
      correctAnswer: 0,
      difficulty: 'Medium',
      explanation: 'Each letter is shifted by 2 positions: P→R, A→C, I→K, N→P, T→V. Applying +2 shift to FLOW: F→H, L→N, O→Q, W→Y gives HNQY, which is closest to HNQZ in the options.',
      time: 3
    }
  ],
  verbal: [
    {
      category: 'Verbal Ability',
      subcategory: 'Reading Comprehension',
      question: 'Reading Passage: "Technology has revolutionized education..." Which of these is NOT a main idea?',
      options: ['Tech improves learning', 'Teachers are obsolete', 'Digital access is important', 'Online platform benefits students'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'The passage discusses how technology improves learning and provides access. It does NOT claim teachers are obsolete, which is a misinterpretation.',
      time: 2.5
    },
    {
      category: 'Verbal Ability',
      subcategory: 'Grammar',
      question: 'Choose the correct sentence:',
      options: ['She go to school every day', 'She goes to school every day', 'She going to school every day', 'She gone to school every day'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Third person singular present tense uses "goes" not "go". "She goes to school every day" is grammatically correct.',
      time: 1
    },
    {
      category: 'Verbal Ability',
      subcategory: 'Synonyms',
      question: 'Find the synonym of "OBSOLETE":',
      options: ['Modern', 'Outdated', 'Ancient', 'Valuable'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Obsolete means no longer in use or out of date. Outdated is the closest synonym. Modern and Valuable are antonyms.',
      time: 1.5
    }
  ],
  data: [
    {
      category: 'Data Interpretation',
      subcategory: 'Bar Graph',
      question: 'In a bar chart showing sales by 4 companies, if Company A = 500, B = 700, C = 600, D = 800. What is the total sales?',
      options: ['2600', '2500', '2700', '2400'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'Total = 500 + 700 + 600 + 800 = 2600',
      time: 1.5
    },
    {
      category: 'Data Interpretation',
      subcategory: 'Pie Chart',
      question: 'A pie chart shows A = 30%, B = 25%, C = 25%, D = 20%. If total = 1000, what is D\'s value?',
      options: ['200', '250', '300', '400'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'D = 20% of 1000 = 0.20 × 1000 = 200',
      time: 1
    },
    {
      category: 'Data Interpretation',
      subcategory: 'Caselet',
      question: 'A company has 500 employees. 60% are technical, 30% are sales, rest are admin. How many admin staff?',
      options: ['50', '75', '100', '150'],
      correctAnswer: 0,
      difficulty: 'Medium',
      explanation: 'Percentage of admin = 100 - 60 - 30 = 10%. Admin staff = 10% of 500 = 50',
      time: 2
    }
  ],
  core: [
    {
      category: 'CS Core',
      subcategory: 'Sorting',
      question: 'Which of the following sorting algorithms has the best worst-case time complexity?',
      options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'Merge Sort has O(N log N) worst case. Quick Sort can degrade to O(N²). Bubble and Insertion are O(N²).',
      time: 2
    },
    {
      category: 'CS Core',
      subcategory: 'OS',
      question: 'What is a deadlock in operating systems?',
      options: ['CPU crash', 'Processes waiting indefinitely for resources', 'Memory overflow', 'Network failure'],
      correctAnswer: 1,
      difficulty: 'Hard',
      explanation: 'Deadlock occurs when processes hold resources and wait for each other, causing indefinite blocking.',
      time: 3
    },
    {
      category: 'CS Core',
      subcategory: 'Networks',
      question: 'Which layer of OSI model handles routing?',
      options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'The Network Layer (Layer 3) is responsible for routing packets between networks using IP addresses.',
      time: 2.5
    },
    {
      category: 'CS Core',
      subcategory: 'DBMS',
      question: 'What is the primary advantage of using indexes in databases?',
      options: ['Increase storage space', 'Speed up query retrieval', 'Reduce memory usage', 'Simplify database design'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'Indexes create a data structure that allows for faster data retrieval, reducing query execution time significantly.',
      time: 2
    },
    {
      category: 'CS Core',
      subcategory: 'OOP',
      question: 'Which principle of OOP allows a child class to override a parent class method?',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Polymorphism allows methods to be overridden in derived classes. Method overriding is a key feature of polymorphism.',
      time: 1.5
    },
    {
      category: 'CS Core',
      subcategory: 'Graph Algorithms',
      question: 'Which graph traversal technique uses a queue data structure?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra\'s Algorithm', 'Depth-Limited Search'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'BFS uses a queue (FIFO) to traverse nodes level by level. DFS uses a stack (LIFO) for traversal.',
      time: 1.5
    },
    {
      category: 'CS Core',
      subcategory: 'Tree Algorithms',
      question: 'In a doubly linked list, each node contains:',
      options: ['Data and one pointer', 'Data and two pointers', 'Data and three pointers', 'Only data'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'A doubly linked list node has previous and next pointers, allowing traversal in both directions.',
      time: 1
    },
    {
      category: 'CS Core',
      subcategory: 'Data Structures',
      question: 'What operation is used to add elements to the end of a deque?',
      options: ['pop_front', 'pop_back', 'push_back', 'push_front'],
      correctAnswer: 2,
      difficulty: 'Easy',
      explanation: 'push_back() adds an element to the end of a deque. push_front() adds to the beginning.',
      time: 1
    }
  ],
  company: [
    {
      category: 'Company Mock',
      subcategory: 'TCS NQT',
      question: 'TCS Q: A can do work in 10 days, B in 15 days. How long together?',
      options: ['5 days', '6 days', '8 days', '7 days'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'A\'s work/day = 1/10, B\'s = 1/15. Together = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So 6 days.',
      time: 2
    },
    {
      category: 'Company Mock',
      subcategory: 'Infosys',
      question: 'Infosys Q: If you have Rs 1000 and spend 30%, how much remains?',
      options: ['Rs 600', 'Rs 700', 'Rs 750', 'Rs 800'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Remaining = 1000 - (30% of 1000) = 1000 - 300 = 700',
      time: 1
    }
  ],
  dsa: [
    {
      category: 'DSA',
      subcategory: 'Pattern & Math',
      question: 'Print hypotenuse of a right-angled triangle with sides 3 and 4:',
      options: ['5', '7', '6', '√25'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'Using Pythagoras theorem: c² = 3² + 4² = 9 + 16 = 25, so c = 5',
      time: 1.5
    },
    {
      category: 'DSA',
      subcategory: 'Pattern & Math',
      question: 'Find the least absolute difference between two arrays [1,5,10] and [2,6,11]:',
      options: ['0', '1', '2', '3'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'Minimum difference = min(|1-2|, |5-6|, |10-11|) = min(1, 1, 1) = 1',
      time: 2
    },
    {
      category: 'DSA',
      subcategory: 'Z Number',
      question: 'Check if 7 is a Z number (number equal to sum of divisors) between 1 to 20:',
      options: ['Yes', 'No', 'Cannot determine', 'Need more data'],
      correctAnswer: 1,
      difficulty: 'Hard',
      explanation: 'A Z number has all divisors sum equal to the number itself. For 7: divisors are 1,7 and sum=8≠7, so No.',
      time: 3
    },
    {
      category: 'DSA',
      subcategory: 'Arithmetic',
      question: 'Add two numbers with twisted logic: if both even, double sum; if both odd, triple sum. Add 4 and 6:',
      options: ['10', '20', '30', '15'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'Both 4 and 6 are even. Sum = 4+6 = 10. Double it = 10×2 = 20.',
      time: 2
    },
    {
      category: 'DSA',
      subcategory: 'Number Theory',
      question: 'Find GCD (Greatest Common Divisor) of 48 and 18:',
      options: ['6', '12', '8', '3'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Using Euclidean algorithm: GCD(48,18) = GCD(18,12) = GCD(12,6) = GCD(6,0) = 6.',
      time: 1.5
    },
    {
      category: 'DSA',
      subcategory: 'Prime Numbers',
      question: 'How many prime numbers exist between 1 and 10?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Prime numbers between 1-10: 2, 3, 5, 7. Total = 4 primes.',
      time: 1.5
    },
    {
      category: 'DSA',
      subcategory: 'Array Operations',
      question: 'Find the minimum element and return its index in [5, 2, 8, 1, 9]:',
      options: ['0', '1', '2', '3'],
      correctAnswer: 3,
      difficulty: 'Easy',
      explanation: 'Minimum element is 1, which is at index 3 (0-indexed).',
      time: 1
    },
    {
      category: 'DSA',
      subcategory: 'String Manipulation',
      question: 'Convert "Hello" to alternating case (twisted: capitalize vowels only): ',
      options: ['hEllO', 'HeLLo', 'hEllo', 'heLLo'],
      correctAnswer: 2,
      difficulty: 'Medium',
      explanation: 'Vowels E,o → Uppercase. Consonants h,l,l → lowercase = hEllo',
      time: 2
    },
    {
      category: 'DSA',
      subcategory: 'String Manipulation',
      question: 'Remove continuous duplicates from "aabbcccccdddee":',
      options: ['abcde', 'abcde', 'ace', 'abde'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'Remove all consecutive duplicates: aa→a, bb→b, ccccc→c, ddd→d, ee→e = abcde',
      time: 1.5
    },
    {
      category: 'DSA',
      subcategory: 'String Case',
      question: 'Convert "PyThOn" - upper to lower and vice-versa:',
      options: ['pYtHoN', 'PYTHON', 'python', 'Python'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'P→p, y→Y, T→t, h→H, o→O, n→N = pYtHoN',
      time: 1
    },
    {
      category: 'DSA',
      subcategory: 'Math Power',
      question: 'Find 2^5 with twist: if result is even, multiply by 1.5:',
      options: ['32', '48', '96', '64'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: '2^5 = 32 (even). Twist: 32 × 1.5 = 48.',
      time: 2
    },
    {
      category: 'DSA',
      subcategory: 'Math Sequences',
      question: 'What is the next number in sequence: 2, 4, 8, 16, ?',
      options: ['24', '32', '28', '20'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
      time: 1
    },
    {
      category: 'DSA',
      subcategory: 'Square Root',
      question: 'Find the square root of 144:',
      options: ['11', '12', '13', '14'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: '12 × 12 = 144, so √144 = 12',
      time: 1
    },
    {
      category: 'DSA',
      subcategory: 'Array Cards',
      question: 'Given card array [♠A, ♥K, ♣Q, ♦J], find index of ♥K:',
      options: ['0', '1', '2', '3'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: 'Index 0: ♠A, Index 1: ♥K. Answer = 1',
      time: 1
    }
  ],
  encod: [
    {
      category: 'Encoding & Decoding',
      subcategory: 'Caesar Cipher',
      question: 'If HELLO is encoded as KHOOR (shift by 3), what is CODE encoded as?',
      options: ['FRGH', 'FODE', 'DPHG', 'HQGH'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'C→F, O→R, D→G, E→H. Shift each by 3 = FRGH',
      time: 1.5
    },
    {
      category: 'Encoding & Decoding',
      subcategory: 'Pattern Encoding',
      question: 'If A=1, B=2...Z=26, encode CODING:',
      options: ['3-15-4-9-14-7', '3-15-4-9-14-19', '2-14-3-8-13-6', '4-16-5-10-15-8'],
      correctAnswer: 0,
      difficulty: 'Medium',
      explanation: 'C=3, O=15, D=4, I=9, N=14, G=7 → 3-15-4-9-14-7',
      time: 2
    },
    {
      category: 'Encoding & Decoding',
      subcategory: 'Binary Encoding',
      question: 'Encode 5 in binary format:',
      options: ['101', '110', '111', '100'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: '5 in binary: 4 + 1 = 2² + 2⁰ = 101',
      time: 1
    },
    {
      category: 'Encoding & Decoding',
      subcategory: 'Reverse Encoding',
      question: 'Decode "dlrow olleH" (simple reversal):',
      options: ['hello world', 'world hello', 'Hello World', 'HELLO WORLD'],
      correctAnswer: 2,
      difficulty: 'Easy',
      explanation: 'Reverse the string: "dlrow olleH" → "Hello World"',
      time: 1
    }
  ]

};

const normalizeQuestions = (questions = [], topicId = 'general') =>
  questions.map((question, index) => ({
    ...question,
    id: question.id || `${topicId}-${index}`,
  }));

const buildQuizSet = (questions = [], count = QUIZ_LENGTH, topicId = 'general') => {
  const normalized = normalizeQuestions(questions, topicId);
  if (normalized.length === 0) return [];
  
  // If we have enough questions, just slice them
  if (normalized.length >= count) {
    return normalized.slice(0, count).map((q, i) => ({
      ...q,
      id: `${topicId}-${i}`
    }));
  }
  
  // If we don't have enough, return all available questions (don't repeat)
  return normalized.map((q, i) => ({
    ...q,
    id: `${topicId}-${i}`
  }));
};

const Aptitude = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (quizStarted && selectedTopic) {
      fetchQuestions();
    }
  }, [quizStarted, selectedTopic]);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setShowResult(true);
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await aptitudeService.getQuiz(selectedTopic);
      const backendQuestions = Array.isArray(data) ? data : [];
      if (backendQuestions.length >= QUIZ_LENGTH) {
        setQuestions(buildQuizSet(backendQuestions, QUIZ_LENGTH, selectedTopic));
      } else {
        const fallbackQuestions = allQuestions[selectedTopic] || [];
        const mergedQuestions = [...backendQuestions, ...fallbackQuestions];
        if (mergedQuestions.length === 0) throw new Error('Empty quiz data');
        setQuestions(buildQuizSet(mergedQuestions, QUIZ_LENGTH, selectedTopic));
      }
    } catch (err) {
      console.warn('Aptitude API unavailable, using local question bank.', err);
      const topicQuestions = allQuestions[selectedTopic] || [];
      setQuestions(buildQuizSet(topicQuestions, QUIZ_LENGTH, selectedTopic));
    } finally {
      setLoading(false);
      setTimerActive(true); // Start timer only after loading is complete
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore({ ...score, correct: score.correct + 1 });
    } else {
      setScore({ ...score, wrong: score.wrong + 1 });
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const topicCards = [
    { id: 'quant', title: 'Quantitative Aptitude', desc: 'Number systems, Algebra, Geometry, Arithmetic', icon: '➗', color: 'var(--orange-d)', avgTime: 2.5 },
    { id: 'logical', title: 'Logical Reasoning', desc: 'Puzzles, Blood relations, Syllogisms, Sequences', icon: '🧠', color: 'var(--p-d)', avgTime: 3 },
    { id: 'verbal', title: 'Verbal Ability', desc: 'Reading comprehension, Grammar, Vocabulary', icon: '📝', color: 'var(--easy-d)', avgTime: 2 },
    { id: 'data', title: 'Data Interpretation', desc: 'Bar graphs, Pie charts, Tabular data analysis', icon: '📊', color: 'var(--blue-d)', avgTime: 3.5 },
    { id: 'core', title: 'Core CS Subjects', desc: 'OS, DBMS, Networks, OOP, DSA, Trees, Graphs', icon: '💻', color: 'var(--bg4)', avgTime: 4 },
    { id: 'dsa', title: 'DSA & Math Patterns', desc: 'Hypotenuse, Prime Numbers, GCD, Patterns, Arrays', icon: '🔢', color: '#a78bfa', avgTime: 3.5 },
    { id: 'encod', title: 'Encoding & Decoding', desc: 'Caesar Cipher, Binary, Pattern Encoding, Reversal', icon: '🔐', color: '#f97316', avgTime: 2.5 },
    { id: 'company', title: 'Company Specific', desc: 'TCS NQT, Infosys, Wipro, Cognizant mock tests', icon: '🏢', color: 'var(--b2)', avgTime: 2.5 }
  ];

  if (!quizStarted) {
    return (
      <div className="app-page on" style={{ padding: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1100px', padding: '32px 24px' }}>

          {/* Header */}
          <div className="section-hdr mb28">
            <div>
              <h1 className="section-title">Aptitude & Logic Mastery</h1>
              <p className="section-sub">Choose a topic and start a timed 15-question aptitude session.</p>
            </div>
          </div>

          {/* Topics Grid */}
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--t1)', marginBottom: '16px' }}>Select a Category to Begin</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px', marginBottom: 32 }}>
            {topicCards.map(topic => (
              <div
                key={topic.id}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--b1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = topic.color;
                  e.currentTarget.style.boxShadow = `0 8px 16px ${topic.color}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--b1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  setSelectedTopic(topic.id);
                  setQuizStarted(true);
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: `${topic.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {topic.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--t1)', marginBottom: '4px' }}>{topic.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: '1.4' }}>{topic.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: 'var(--t4)', marginBottom: 12, paddingTop: 12, borderTop: '1px solid var(--b1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Target size={12} style={{ color: topic.color }} />
                    <span>{QUIZ_LENGTH} questions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} style={{ color: topic.color }} />
                    <span>~{Math.ceil(topic.avgTime * QUIZ_LENGTH)}m</span>
                  </div>
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${topic.color}`,
                    background: `${topic.color}15`,
                    color: topic.color,
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.target.style.background = `${topic.color}30`; }}
                  onMouseOut={(e) => { e.target.style.background = `${topic.color}15`; }}
                >
                  Start Quiz →
                </button>
              </div>
            ))}
          </div>

          {/* Full Length Mock Test */}
          <div style={{ padding: '24px 28px', borderRadius: 14, background: 'linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%)', border: '2px solid var(--b1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Zap size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--t1)' }}>Full Length Mock Test</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--t3)' }}>60 questions across all categories. Competitive exam pattern. Time limit: 60 mins.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedTopic('company');
                setQuizStarted(true);
              }}
              style={{ whiteSpace: 'nowrap', marginLeft: 16 }}
            >
              ▶ Start Mock
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (loading) return <div className="app-page on">Loading quiz...</div>;

  if (showResult) {
    const accuracy = Math.round((score.correct / questions.length) * 100);
    const performanceLevel = accuracy >= 80 ? 'Excellent' : accuracy >= 60 ? 'Good' : accuracy >= 40 ? 'Fair' : 'Needs Improvement';
    const topicTitle = topicCards.find(t => t.id === selectedTopic)?.title || 'Quiz';
    
    return (
      <div className="app-page on" style={{ padding: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '900px', padding: '32px 24px' }}>

          <div className="section-hdr mb28">
            <div>
              <h1 className="section-title">Quiz Completed! 🎉</h1>
              <p className="section-sub">{topicTitle} - {performanceLevel} Performance</p>
            </div>
          </div>

          {/* Main Score */}
          <div style={{ padding: '32px', borderRadius: 16, background: 'linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%)', border: '1px solid var(--b1)', marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444', marginBottom: 8 }}>{accuracy}%</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>Overall Accuracy</div>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>You got {score.correct} out of {questions.length} correct</div>
          </div>

          {/* Three Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: '20px', borderRadius: 12, background: '#10b98120', border: '1px solid #10b98140', textAlign: 'center' }}>
              <CheckCircle style={{ width: 32, height: 32, color: '#10b981', margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', marginBottom: 4 }}>{score.correct}</div>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>Correct Answers</div>
            </div>

            <div style={{ padding: '20px', borderRadius: 12, background: '#ef444420', border: '1px solid #ef444440', textAlign: 'center' }}>
              <XCircle style={{ width: 32, height: 32, color: '#ef4444', margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444', marginBottom: 4 }}>{score.wrong}</div>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>Incorrect Answers</div>
            </div>

            <div style={{ padding: '20px', borderRadius: 12, background: '#3b82f620', border: '1px solid #3b82f640', textAlign: 'center' }}>
              <Clock style={{ width: 32, height: 32, color: '#3b82f6', margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: '#3b82f6', marginBottom: 4 }}>{formatTime(900 - timeLeft)}</div>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>Time Taken</div>
            </div>
          </div>

          {/* Performance Feedback */}
          <div style={{ padding: '20px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--b1)', marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>📊 Performance Analysis</div>
            {accuracy >= 80 && (
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                🌟 Excellent work! You've demonstrated strong aptitude. Focus on the questions you missed to achieve 100%. Keep practicing harder problems.
              </p>
            )}
            {accuracy >= 60 && accuracy < 80 && (
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                👍 Good performance! You're on the right track. Review incorrect answers and practice similar problems. Try increasing difficulty level.
              </p>
            )}
            {accuracy >= 40 && accuracy < 60 && (
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                💪 Keep practicing! Review fundamentals and solve more problems from this category. Consistency will improve your score.
              </p>
            )}
            {accuracy < 40 && (
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                📚 Time to focus! Go back to basics. Read concepts, watch tutorials, and practice step-by-step. Progress takes time.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuizStarted(false);
                setSelectedTopic(null);
                setCurrentIdx(0);
                setScore({ correct: 0, wrong: 0 });
                setShowResult(false);
              }}
            >
              ← Back to Categories
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                window.location.reload();
              }}
            >
              🔄 Try Again
            </button>
          </div>

        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="app-page on" style={{ padding: '0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '900px', padding: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: 18, marginBottom: 4 }}>{topicCards.find(t => t.id === selectedTopic)?.title || 'Quiz'}</h1>
            <p style={{ fontSize: 12, color: 'var(--t3)' }}>Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>Time Remaining</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: timeLeft <= 60 ? '#ef4444' : 'var(--t1)', fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <Clock size={24} color={timeLeft <= 60 ? '#ef4444' : 'var(--t2)'} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ height: '100%', background: '#3b82f6', width: `${((currentIdx + 1) / questions.length) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Question Card */}
        <div style={{ padding: '24px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--b1)', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ padding: '4px 10px', borderRadius: 6, background: '#3b82f620', color: '#3b82f6', fontSize: 11, fontWeight: 700 }}>
              {q.category}
            </div>
            {q.subcategory && (
              <div style={{ padding: '4px 10px', borderRadius: 6, background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, fontWeight: 700 }}>
                {q.subcategory}
              </div>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--t4)' }}>
              <Zap size={12} />
              {q.difficulty}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.6 }}>{q.question}</div>
          
          {/* Next Button moved here for better UX */}
          {selectedOpt !== null && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                className="btn btn-primary"
                onClick={nextQuestion}
                style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                {currentIdx === questions.length - 1 ? '✓ Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === q.correctAnswer;
            let bgColor = 'var(--bg3)';
            let borderColor = 'var(--b1)';
            let textColor = 'var(--t1)';

            if (isSelected) {
              bgColor = isCorrect ? '#10b98120' : '#ef444420';
              borderColor = isCorrect ? '#10b981' : '#ef4444';
              textColor = isCorrect ? '#10b981' : '#ef4444';
            } else if (selectedOpt !== null && isCorrect) {
              bgColor = '#10b98120';
              borderColor = '#10b981';
            }

            return (
              <div
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 10,
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  cursor: selectedOpt === null ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  opacity: selectedOpt !== null && !isSelected && !isCorrect ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (selectedOpt === null) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.background = 'var(--bg4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedOpt === null) {
                    e.currentTarget.style.borderColor = 'var(--b1)';
                    e.currentTarget.style.background = 'var(--bg3)';
                  }
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#3b82f620',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0
                }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, color: textColor, fontWeight: selectedOpt !== null ? 600 : 500 }}>{opt}</span>
                </div>
                {isSelected && (isCorrect ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />)}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {selectedOpt !== null && (
          <div style={{ padding: '16px 18px', borderRadius: 10, background: '#10b98110', border: '1px solid #10b98140', marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>💡 Explanation</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{q.explanation}</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Aptitude;
