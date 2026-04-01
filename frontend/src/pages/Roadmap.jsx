import React, { useState } from 'react';
import { CheckCircle2, Circle, Lock, ChevronRight, Code2, Cpu, Database, Shield, BarChart2, Globe, Clock, BookOpen, Target, Zap } from 'lucide-react';

const phases = [
    {
        id: 1, label: 'Fundamentals', color: '#10b981', done: true, hours: 40,
        topics: [
            { title: 'Programming Basics', sub: 'Variables, loops, functions, OOP concepts', problems: 25, difficulty: 'Easy', done: true, resources: ['GeeksforGeeks', 'YouTube'] },
            { title: 'Complexity Analysis', sub: 'Big-O notation, time & space complexity calculations', problems: 15, difficulty: 'Easy', done: true, resources: ['Wikipedia', 'GeeksforGeeks'] },
            { title: 'Arrays & Strings', sub: 'Two pointers, sliding window, prefix sums, hashing', problems: 45, difficulty: 'Easy-Medium', done: true, resources: ['LeetCode', 'HackerRank'] },
            { title: 'Linked Lists', sub: 'Singly/Doubly lists, cycle detection, list manipulation', problems: 30, difficulty: 'Easy-Medium', done: false, resources: ['LeetCode', 'InterviewBit'] },
            { title: 'Recursion & Backtracking', sub: 'Base cases, recursive tree, pruning', problems: 25, difficulty: 'Medium', done: false, resources: ['CP Algorithms', 'YouTube'] },
        ]
    },
    {
        id: 2, label: 'Core Data Structures', color: '#f59e0b', done: false, hours: 50,
        topics: [
            { title: 'Stacks & Queues', sub: 'Monotonic stacks, deque, circular queue applications', problems: 35, difficulty: 'Medium', done: false, resources: ['GeeksforGeeks', 'LeetCode'] },
            { title: 'Trees & BSTs', sub: 'Traversals (in/pre/post), height, LCA, path problems', problems: 50, difficulty: 'Medium', done: false, resources: ['AlgoExpert', 'LeetCode'] },
            { title: 'Heaps & Priority Queues', sub: 'Min/Max heap, heap sort, K-th largest/smallest', problems: 25, difficulty: 'Medium', done: false, resources: ['LeetCode', 'Visualgo'] },
            { title: 'Graphs Basics', sub: 'Adjacency lists/matrices, BFS, DFS, connected components', problems: 40, difficulty: 'Medium', done: false, resources: ['CP Algorithms', 'CodeChef'] },
            { title: 'Hash Tables', sub: 'Hash functions, collision handling, custom hashing', problems: 30, difficulty: 'Medium', done: false, resources: ['LeetCode', 'GeeksforGeeks'] },
        ]
    },
    {
        id: 3, label: 'Advanced Algorithms', color: '#8b5cf6', done: false, hours: 60,
        topics: [
            { title: 'Dynamic Programming', sub: '0/1 Knapsack, LCS, LIS, coin change, house robber', problems: 60, difficulty: 'Hard', done: false, resources: ['DP Playlist', 'CP Algorithms'] },
            { title: 'Graph Algorithms', sub: 'Dijkstra, Bellman-Ford, Floyd-Warshall, MST, topological sort', problems: 45, difficulty: 'Hard', done: false, resources: ['Codeforces', 'LeetCode'] },
            { title: 'Greedy Algorithms', sub: 'Activity selection, interval scheduling, huffman coding', problems: 25, difficulty: 'Medium-Hard', done: false, resources: ['InterviewBit', 'YouTube'] },
            { title: 'Divide & Conquer', sub: 'Merge sort, quick sort, binary search, median of arrays', problems: 30, difficulty: 'Medium', done: false, resources: ['LeetCode', 'HackerRank'] },
            { title: 'Advanced Trees', sub: 'Segment trees, Fenwick trees, trie, suffix arrays', problems: 35, difficulty: 'Hard', done: false, resources: ['CF Academy', 'CP Algorithms'] },
        ]
    },
    {
        id: 4, label: 'Interview Preparation', color: '#3b82f6', done: false, hours: 45,
        topics: [
            { title: 'Company-Specific DSA', sub: 'Latest Google, Amazon, Facebook, Microsoft problem sets', problems: 80, difficulty: 'Hard', done: false, resources: ['LeetCode Premium', 'InterviewBit'] },
            { title: 'System Design Basics', sub: 'Scalability, load balancing, caching, databases', problems: 20, difficulty: 'Expert', done: false, resources: ['System Design Interview', 'Grokking'] },
            { title: 'OS & DBMS', sub: 'Threads, locks, SQL optimization, indexing strategies', problems: 40, difficulty: 'Medium-Hard', done: false, resources: ['Jenny Lectures', 'GeeksforGeeks'] },
            { title: 'Behavioral & Resume', sub: 'STAR method, conflict resolution, resume optimization', problems: 15, difficulty: 'Easy', done: false, resources: ['AlgoExpert', 'YouTube'] },
            { title: 'Mock Interviews', sub: '5 full mock sessions with feedback + timed practice', problems: 0, difficulty: 'Expert', done: false, resources: ['Pramp', 'Interviewing.io'] },
        ]
    },
];

const paths = [
    { icon: Code2, label: 'SDE Path', sub: '220 problems', color: '#f59e0b', active: true, hours: 200 },
    { icon: Cpu, label: 'ML Engineer', sub: '150 problems', color: '#8b5cf6', hours: 150 },
    { icon: Database, label: 'Backend Dev', sub: '180 problems', color: '#3b82f6', hours: 180 },
    { icon: Shield, label: 'Security Eng', sub: '120 problems', color: '#10b981', hours: 140 },
    { icon: BarChart2, label: 'Data Analyst', sub: '160 problems', color: '#ef4444', hours: 160 },
    { icon: Globe, label: 'Full Stack', sub: '200 problems', color: '#ec4899', hours: 190 },
];

const Roadmap = () => {
    const [activePhase, setActivePhase] = useState(1);

    return (
        <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
            <div style={{ maxWidth: 1100 }}>

                {/* header */}
                <div className="section-hdr mb28">
                    <div>
                        <h1 className="section-title">DSA Mastery Roadmap</h1>
                        <p className="section-sub">Complete structured path from fundamentals to advanced algorithms & system design. {phases.reduce((acc, p) => acc + p.hours, 0)}h total • {paths[0].sub} • {Math.round(phases[0].topics.filter(t => t.done).length / phases[0].topics.length * 100)}% progress</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm">📊 Download PDF</button>
                        <button className="btn btn-primary btn-sm">▶ Continue Learning →</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

                    {/* Left: learning paths */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Learning Paths</div>
                        {paths.map(({ icon: Icon, label, sub, color, active, hours }) => (
                            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px', marginBottom: 8, borderRadius: 10, background: active ? `${color}18` : 'var(--bg3)', border: `1px solid ${active ? color + '40' : 'var(--b1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseOver={e => { if (!active) e.currentTarget.style.background = 'var(--bg4)'; }}
                                onMouseOut={e => { if (!active) e.currentTarget.style.background = 'var(--bg3)'; }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={16} style={{ color }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? color : 'var(--t1)', marginBottom: 2 }}>{label}</div>
                                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{sub}</div>
                                    <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 4 }}>≈ {hours}h</div>
                                </div>
                                {active && <ChevronRight size={14} style={{ color, marginTop: 4 }} />}
                            </div>
                        ))}
                    </div>

                    {/* Right: phase roadmap */}
                    <div>
                        {/* phase tabs */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg3)', padding: 4, borderRadius: 12, border: '1px solid var(--b1)' }}>
                            {phases.map(p => (
                                <button key={p.id} onClick={() => setActivePhase(p.id)} style={{ flex: 1, padding: '7px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', background: activePhase === p.id ? 'var(--bg5)' : 'transparent', color: activePhase === p.id ? 'var(--t1)' : 'var(--t3)', boxShadow: activePhase === p.id ? '0 1px 6px rgba(0,0,0,0.3)' : 'none' }}>
                                    Phase {p.id} · {p.label}
                                </button>
                            ))}
                        </div>

                        {/* phase content */}
                        {phases.filter(p => p.id === activePhase).map(phase => (
                            <div key={phase.id}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                                    <div style={{ width: 50, height: 50, borderRadius: 14, background: `${phase.color}20`, border: `2px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: phase.color, flexShrink: 0 }}>{phase.id}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Phase {phase.id}: {phase.label}</div>
                                        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}>{phase.topics.filter(t => t.done).length}/{phase.topics.length} topics completed</div>
                                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                            <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t2)' }}>
                                                <Clock size={14} style={{ color: phase.color }} />
                                                <span><strong>{phase.hours}h</strong> estimated</span>
                                            </div>
                                            <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t2)' }}>
                                                <Target size={14} style={{ color: phase.color }} />
                                                <span><strong>{phase.topics.reduce((acc, t) => acc + (t.problems || 0), 0)}</strong> problems</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {phase.topics.map((topic, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 18px', borderRadius: 12, background: 'var(--bg3)', border: `2px solid ${topic.done ? phase.color + '40' : 'var(--b1)'}`, transition: 'all 0.2s', cursor: 'pointer' }}
                                            onMouseOver={e => { e.currentTarget.style.borderColor = phase.color + '60'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${phase.color}20`; }}
                                            onMouseOut={e => { e.currentTarget.style.borderColor = topic.done ? phase.color + '40' : 'var(--b1)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                            <div style={{ marginTop: 2, flexShrink: 0 }}>
                                                {topic.done
                                                    ? <CheckCircle2 size={22} style={{ color: phase.color }} />
                                                    : <Circle size={22} style={{ color: 'var(--t4)' }} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: topic.done ? phase.color : 'var(--t1)', marginBottom: 4 }}>{topic.title}</div>
                                                <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>{topic.sub}</div>
                                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--t4)', background: 'var(--bg5)', padding: '4px 8px', borderRadius: 6 }}>
                                                        <Target size={12} /> {topic.problems} problems
                                                    </div>
                                                    <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: topic.difficulty.includes('Hard') ? '#fca5a580' : topic.difficulty.includes('Medium') ? '#f59e0b80' : '#10b98180', color: topic.difficulty.includes('Hard') ? '#dc2626' : topic.difficulty.includes('Medium') ? '#d97706' : '#059669' }}>
                                                        {topic.difficulty}
                                                    </div>
                                                    {topic.resources && (
                                                        <div style={{ fontSize: 10, color: 'var(--t4)', margintop: 4 }}>
                                                            <BookOpen size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                            {topic.resources.slice(0, 2).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button style={{ padding: '6px 16px', borderRadius: 8, border: `1.5px solid ${topic.done ? phase.color + '40' : 'var(--b2)'}`, background: topic.done ? `${phase.color}15` : 'transparent', color: topic.done ? phase.color : 'var(--t3)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                                                onMouseOver={e => { e.target.style.background = topic.done ? `${phase.color}25` : 'var(--bg5)'; }}
                                                onMouseOut={e => { e.target.style.background = topic.done ? `${phase.color}15` : 'transparent'; }}>
                                                {topic.done ? '✓ Done' : 'Start'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* progress bar */}
                                <div style={{ marginTop: 28, padding: '18px 20px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 2 }}>Phase Progress</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: phase.color }}>{Math.round((phase.topics.filter(t => t.done).length / phase.topics.length) * 100)}%</div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--t3)' }}>
                                            {phase.topics.filter(t => t.done).length} of {phase.topics.length} topics
                                        </div>
                                    </div>
                                    <div style={{ background: 'var(--bg5)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 99, background: phase.color, width: `${(phase.topics.filter(t => t.done).length / phase.topics.length) * 100}%`, transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: `0 0 12px ${phase.color}60` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #10b98118 0%, #10b98108 100%)', border: '1px solid #10b98140' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#10b98125', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={18} style={{ color: '#10b981' }} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Total Duration</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981', marginBottom: 4 }}>{phases.reduce((acc, p) => acc + p.hours, 0)}h</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>≈ 12 weeks (4-5h/day)</div>
                    </div>

                    <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b18 0%, #f59e0b08 100%)', border: '1px solid #f59e0b40' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f59e0b25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Target size={18} style={{ color: '#f59e0b' }} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Total Problems</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b', marginBottom: 4 }}>{phases.reduce((acc, p) => acc + p.topics.reduce((a, t) => a + (t.problems || 0), 0), 0)}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>Across all phases</div>
                    </div>

                    <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf618 0%, #8b5cf608 100%)', border: '1px solid #8b5cf640' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#8b5cf625', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen size={18} style={{ color: '#8b5cf6' }} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Resources</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6', marginBottom: 4 }}>15+</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>Platforms + YouTube</div>
                    </div>

                    <div style={{ padding: '20px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f618 0%, #3b82f608 100%)', border: '1px solid #3b82f640' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f625', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={18} style={{ color: '#3b82f6' }} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Your Progress</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6', marginBottom: 4 }}>
                            {Math.round((phases.reduce((acc, p) => acc + p.topics.filter(t => t.done).length, 0) / phases.reduce((acc, p) => acc + p.topics.length, 0)) * 100)}%
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>Keep it up!</div>
                    </div>
                </div>

                {/* Tips Section */}
                <div style={{ marginTop: 36, padding: '24px 28px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: 'var(--t1)' }}>💡 Pro Tips for Success</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>⏰ Consistency is Key</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Dedicate 4-5 hours daily. Regular practice beats cramming.</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>🔁 Revise Regularly</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Review each topic after 1, 7, and 30 days for retention.</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>🎯 Understand Before Coding</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Know the WHY before writing code. Read editorials.</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>🚀 Build Projects</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Apply DSA in real projects. Build a portfolio.</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>🤝 Join Communities</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Discuss problems, share solutions, learn together.</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>🎤 Mock Interviews</div>
                            <div style={{ fontSize: 11, color: 'var(--t3)' }}>Practice on Pramp & Interviewing.io before real ones.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
