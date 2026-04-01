import React from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Shield,
  BarChart2,
  Globe,
  Clock,
  BookOpen,
  Target,
  Zap,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const basePhases = [
  {
    id: 1,
    label: 'Fundamentals',
    color: '#10b981',
    hours: 40,
    topics: [
      { id: 'programming-basics', title: 'Programming Basics', sub: 'Variables, loops, functions, OOP concepts', problems: 25, difficulty: 'Easy', resources: ['GeeksforGeeks', 'YouTube'] },
      { id: 'complexity-analysis', title: 'Complexity Analysis', sub: 'Big-O notation, time and space complexity calculations', problems: 15, difficulty: 'Easy', resources: ['Wikipedia', 'GeeksforGeeks'] },
      { id: 'arrays-strings', title: 'Arrays & Strings', sub: 'Two pointers, sliding window, prefix sums, hashing', problems: 45, difficulty: 'Easy-Medium', resources: ['LeetCode', 'HackerRank'] },
      { id: 'linked-lists', title: 'Linked Lists', sub: 'Singly and doubly linked lists, cycle detection, list manipulation', problems: 30, difficulty: 'Easy-Medium', resources: ['LeetCode', 'InterviewBit'] },
      { id: 'recursion-backtracking', title: 'Recursion & Backtracking', sub: 'Base cases, recursion tree, pruning', problems: 25, difficulty: 'Medium', resources: ['CP Algorithms', 'YouTube'] }
    ]
  },
  {
    id: 2,
    label: 'Core Data Structures',
    color: '#f59e0b',
    hours: 50,
    topics: [
      { id: 'stacks-queues', title: 'Stacks & Queues', sub: 'Monotonic stacks, deque, circular queue applications', problems: 35, difficulty: 'Medium', resources: ['GeeksforGeeks', 'LeetCode'] },
      { id: 'trees-bsts', title: 'Trees & BSTs', sub: 'Traversals, height, LCA, path problems', problems: 50, difficulty: 'Medium', resources: ['AlgoExpert', 'LeetCode'] },
      { id: 'heaps-priority-queues', title: 'Heaps & Priority Queues', sub: 'Min and max heap, heap sort, K-th largest and smallest', problems: 25, difficulty: 'Medium', resources: ['LeetCode', 'Visualgo'] },
      { id: 'graphs-basics', title: 'Graphs Basics', sub: 'Adjacency lists, BFS, DFS, connected components', problems: 40, difficulty: 'Medium', resources: ['CP Algorithms', 'CodeChef'] },
      { id: 'hash-tables', title: 'Hash Tables', sub: 'Hash functions, collision handling, custom hashing', problems: 30, difficulty: 'Medium', resources: ['LeetCode', 'GeeksforGeeks'] }
    ]
  },
  {
    id: 3,
    label: 'Advanced Algorithms',
    color: '#8b5cf6',
    hours: 60,
    topics: [
      { id: 'dynamic-programming', title: 'Dynamic Programming', sub: 'Knapsack, LCS, LIS, coin change, house robber', problems: 60, difficulty: 'Hard', resources: ['DP Playlist', 'CP Algorithms'] },
      { id: 'graph-algorithms', title: 'Graph Algorithms', sub: 'Dijkstra, Bellman-Ford, Floyd-Warshall, MST, topological sort', problems: 45, difficulty: 'Hard', resources: ['Codeforces', 'LeetCode'] },
      { id: 'greedy-algorithms', title: 'Greedy Algorithms', sub: 'Activity selection, interval scheduling, Huffman coding', problems: 25, difficulty: 'Medium-Hard', resources: ['InterviewBit', 'YouTube'] },
      { id: 'divide-conquer', title: 'Divide & Conquer', sub: 'Merge sort, quick sort, binary search, median of arrays', problems: 30, difficulty: 'Medium', resources: ['LeetCode', 'HackerRank'] },
      { id: 'advanced-trees', title: 'Advanced Trees', sub: 'Segment trees, Fenwick trees, trie, suffix arrays', problems: 35, difficulty: 'Hard', resources: ['CF Academy', 'CP Algorithms'] }
    ]
  },
  {
    id: 4,
    label: 'Interview Preparation',
    color: '#3b82f6',
    hours: 45,
    topics: [
      { id: 'company-specific-dsa', title: 'Company-Specific DSA', sub: 'Latest Google, Amazon, Microsoft, and product company patterns', problems: 80, difficulty: 'Hard', resources: ['LeetCode Premium', 'InterviewBit'] },
      { id: 'system-design-basics', title: 'System Design Basics', sub: 'Scalability, load balancing, caching, databases', problems: 20, difficulty: 'Expert', resources: ['System Design Interview', 'Grokking'] },
      { id: 'os-dbms', title: 'OS & DBMS', sub: 'Threads, locks, SQL optimization, indexing strategies', problems: 40, difficulty: 'Medium-Hard', resources: ['Jenny Lectures', 'GeeksforGeeks'] },
      { id: 'behavioral-resume', title: 'Behavioral & Resume', sub: 'STAR method, conflict resolution, resume optimization', problems: 15, difficulty: 'Easy', resources: ['AlgoExpert', 'YouTube'] },
      { id: 'mock-interviews', title: 'Mock Interviews', sub: 'Mock sessions with feedback and timed practice', problems: 0, difficulty: 'Expert', resources: ['Pramp', 'Interviewing.io'] }
    ]
  }
];

const basePaths = [
  { icon: Code2, label: 'SDE Path', color: '#f59e0b', hours: 200, focus: 'Best for coding interviews and product companies.' },
  { icon: Cpu, label: 'ML Engineer', color: '#8b5cf6', hours: 150, focus: 'Good for data structures plus ML project depth.' },
  { icon: Database, label: 'Backend Dev', color: '#3b82f6', hours: 180, focus: 'Prioritize APIs, SQL, and system design basics.' },
  { icon: Shield, label: 'Security Eng', color: '#10b981', hours: 140, focus: 'Add networks, OS, and security fundamentals.' },
  { icon: BarChart2, label: 'Data Analyst', color: '#ef4444', hours: 160, focus: 'Keep SQL, stats, and communication strong.' },
  { icon: Globe, label: 'Full Stack', color: '#ec4899', hours: 190, focus: 'Balance frontend, backend, and interview rounds.' }
];

const getStorageKey = (email) => `roadmap_progress_${email || 'guest'}`;

const Roadmap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roadmapRef = React.useRef(null);

  const [activePhase, setActivePhase] = React.useState(1);
  const [activePath, setActivePath] = React.useState('SDE Path');
  const [progressMap, setProgressMap] = React.useState({});
  const [statusMessage, setStatusMessage] = React.useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(user?.email));
    if (saved) {
      try {
        setProgressMap(JSON.parse(saved));
        return;
      } catch (error) {
        // Ignore broken saved state and reset below.
      }
    }
    setProgressMap({});
  }, [user?.email]);

  React.useEffect(() => {
    localStorage.setItem(getStorageKey(user?.email), JSON.stringify(progressMap));
  }, [progressMap, user?.email]);

  const getTopicStatus = (topicId) => progressMap[topicId]?.status || 'not_started';
  const isTopicDone = (topicId) => getTopicStatus(topicId) === 'completed';

  const totalTopics = basePhases.reduce((acc, phase) => acc + phase.topics.length, 0);
  const completedTopics = basePhases.reduce(
    (acc, phase) => acc + phase.topics.filter((topic) => isTopicDone(topic.id)).length,
    0
  );
  const overallProgress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const totalProblems = basePhases.reduce((acc, phase) => acc + phase.topics.reduce((sum, topic) => sum + (topic.problems || 0), 0), 0);

  const getTopicRoute = (topicTitle) => {
    if (topicTitle === 'Behavioral & Resume') return '/resume-builder';
    if (topicTitle === 'Mock Interviews') return '/mock-interviews';
    if (topicTitle === 'System Design Basics') return '/mock-interviews';
    return '/practice';
  };

  const handleDownloadPDF = () => {
    const roadmapHtml = roadmapRef.current?.outerHTML;
    if (!roadmapHtml) return;

    const printWindow = window.open('', '_blank', 'width=1100,height=1400');
    if (!printWindow) {
      setStatusMessage('Please allow popups to print or save the roadmap.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Placement Roadmap</title>
          <style>
            body { margin: 0; padding: 24px; background: #ffffff; color: #111827; font-family: Arial, sans-serif; }
            button { display: none !important; }
          </style>
        </head>
        <body>${roadmapHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setStatusMessage('Opened a printable roadmap view for PDF download.');
  };

  const handleContinueLearning = () => {
    const nextTopic = basePhases
      .flatMap((phase) => phase.topics)
      .find((topic) => getTopicStatus(topic.id) !== 'completed');

    navigate(getTopicRoute(nextTopic?.title || 'Programming Basics'));
  };

  const handleTopicClick = (topic) => {
    navigate(getTopicRoute(topic.title));
  };

  const handlePathClick = (pathLabel) => {
    setActivePath(pathLabel);
    setStatusMessage(`${pathLabel} selected as your roadmap focus.`);
  };

  const handleStartTopic = (topic) => {
    const status = getTopicStatus(topic.id);
    if (status === 'not_started') {
      setProgressMap((prev) => ({
        ...prev,
        [topic.id]: {
          status: 'in_progress',
          startedAt: new Date().toISOString()
        }
      }));
      setStatusMessage(`${topic.title} marked as in progress.`);
    }

    navigate(getTopicRoute(topic.title));
  };

  const handleCompleteTopic = (topic) => {
    setProgressMap((prev) => ({
      ...prev,
      [topic.id]: {
        ...prev[topic.id],
        status: 'completed',
        completedAt: new Date().toISOString()
      }
    }));
    setStatusMessage(`${topic.title} marked as completed.`);
  };

  return (
    <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
      <div style={{ maxWidth: 1100 }} ref={roadmapRef}>
        <div className="section-hdr mb28">
          <div>
            <h1 className="section-title">DSA Mastery Roadmap</h1>
            <p className="section-sub">
              Complete structured path from fundamentals to advanced algorithms and interview preparation. {basePhases.reduce((acc, phase) => acc + phase.hours, 0)}h total • {totalProblems} problems • {overallProgress}% progress
            </p>
            {statusMessage && <p style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>{statusMessage}</p>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownloadPDF} className="btn btn-ghost btn-sm">Download PDF</button>
            <button onClick={handleContinueLearning} className="btn btn-primary btn-sm">Continue Learning</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Learning Paths</div>
            {basePaths.map(({ icon: Icon, label, color, hours, focus }) => {
              const active = activePath === label;
              return (
                <button
                  key={label}
                  onClick={() => handlePathClick(label)}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px', marginBottom: 8, borderRadius: 10, background: active ? `${color}18` : 'var(--bg3)', border: `1px solid ${active ? `${color}40` : 'var(--b1)'}`, cursor: 'pointer', transition: 'all 0.15s', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? color : 'var(--t1)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.5 }}>{focus}</div>
                    <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>≈ {hours}h</div>
                  </div>
                  {active && <ChevronRight size={14} style={{ color, marginTop: 4 }} />}
                </button>
              );
            })}
          </div>

          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg3)', padding: 4, borderRadius: 12, border: '1px solid var(--b1)' }}>
              {basePhases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{ flex: 1, padding: '7px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', background: activePhase === phase.id ? 'var(--bg5)' : 'transparent', color: activePhase === phase.id ? 'var(--t1)' : 'var(--t3)', boxShadow: activePhase === phase.id ? '0 1px 6px rgba(0,0,0,0.3)' : 'none' }}
                >
                  Phase {phase.id} · {phase.label}
                </button>
              ))}
            </div>

            {basePhases
              .filter((phase) => phase.id === activePhase)
              .map((phase) => {
                const doneCount = phase.topics.filter((topic) => isTopicDone(topic.id)).length;
                const phaseProgress = Math.round((doneCount / phase.topics.length) * 100);

                return (
                  <div key={phase.id}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 14, background: `${phase.color}20`, border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: phase.color, flexShrink: 0 }}>{phase.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Phase {phase.id}: {phase.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}>{doneCount}/{phase.topics.length} topics completed</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t2)' }}>
                            <Clock size={14} style={{ color: phase.color }} />
                            <span><strong>{phase.hours}h</strong> estimated</span>
                          </div>
                          <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t2)' }}>
                            <Target size={14} style={{ color: phase.color }} />
                            <span><strong>{phase.topics.reduce((acc, topic) => acc + (topic.problems || 0), 0)}</strong> problems</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {phase.topics.map((topic) => {
                        const status = getTopicStatus(topic.id);
                        const done = status === 'completed';
                        const inProgress = status === 'in_progress';

                        return (
                          <div key={topic.id} style={{ display: 'flex', gap: 16, padding: '16px 18px', borderRadius: 12, background: 'var(--bg3)', border: `2px solid ${done ? `${phase.color}40` : inProgress ? `${phase.color}25` : 'var(--b1)'}` }}>
                            <div style={{ marginTop: 2, flexShrink: 0 }}>
                              {done ? <CheckCircle2 size={22} style={{ color: phase.color }} /> : inProgress ? <Check size={22} style={{ color: phase.color }} /> : <Circle size={22} style={{ color: 'var(--t4)' }} />}
                            </div>
                            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleTopicClick(topic)}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: done || inProgress ? phase.color : 'var(--t1)', marginBottom: 4 }}>{topic.title}</div>
                              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>{topic.sub}</div>
                              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--t4)', background: 'var(--bg5)', padding: '4px 8px', borderRadius: 6 }}>
                                  <Target size={12} /> {topic.problems} problems
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: topic.difficulty.includes('Hard') || topic.difficulty.includes('Expert') ? '#fca5a580' : topic.difficulty.includes('Medium') ? '#f59e0b80' : '#10b98180', color: topic.difficulty.includes('Hard') || topic.difficulty.includes('Expert') ? '#dc2626' : topic.difficulty.includes('Medium') ? '#d97706' : '#059669' }}>
                                  {topic.difficulty}
                                </div>
                                {topic.resources?.length > 0 && (
                                  <div style={{ fontSize: 10, color: 'var(--t4)' }}>
                                    <BookOpen size={12} style={{ display: 'inline', marginRight: 4 }} />
                                    {topic.resources.slice(0, 2).join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleStartTopic(topic)}
                                style={{ padding: '6px 16px', borderRadius: 8, border: `1.5px solid ${done || inProgress ? `${phase.color}40` : 'var(--b2)'}`, background: done || inProgress ? `${phase.color}15` : 'transparent', color: done ? phase.color : inProgress ? phase.color : 'var(--t3)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap' }}
                              >
                                {done ? 'Review' : inProgress ? 'Continue' : 'Start'}
                              </button>
                              {!done && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteTopic(topic)}
                                  style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${phase.color}30`, background: `${phase.color}12`, color: phase.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}
                                >
                                  Mark Done
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: 28, padding: '18px 20px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 2 }}>Phase Progress</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: phase.color }}>{phaseProgress}%</div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--t3)' }}>
                          {doneCount} of {phase.topics.length} topics
                        </div>
                      </div>
                      <div style={{ background: 'var(--bg5)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: phase.color, width: `${phaseProgress}%`, transition: 'width 0.5s ease', boxShadow: `0 0 12px ${phase.color}60` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #10b98118 0%, #10b98108 100%)', border: '1px solid #10b98140' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#10b98125', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} style={{ color: '#10b981' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Total Duration</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981', marginBottom: 4 }}>{basePhases.reduce((acc, phase) => acc + phase.hours, 0)}h</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>≈ 12 weeks at a steady pace</div>
          </div>

          <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b18 0%, #f59e0b08 100%)', border: '1px solid #f59e0b40' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f59e0b25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Total Problems</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b', marginBottom: 4 }}>{totalProblems}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>Across all roadmap phases</div>
          </div>

          <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf618 0%, #8b5cf608 100%)', border: '1px solid #8b5cf640' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#8b5cf625', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Resources</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6', marginBottom: 4 }}>{new Set(basePhases.flatMap((phase) => phase.topics.flatMap((topic) => topic.resources || []))).size}+</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>Unique learning resources</div>
          </div>

          <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f618 0%, #3b82f608 100%)', border: '1px solid #3b82f640' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f625', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} style={{ color: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Your Progress</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6', marginBottom: 4 }}>{overallProgress}%</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{completedTopics} completed topics saved for your account on this device</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
