import React, { useState } from 'react';
import { CheckCircle2, Circle, Lock, ChevronRight, Code2, Cpu, Database, Shield, BarChart2, Globe } from 'lucide-react';

const phases = [
    {
        id: 1, label: 'Foundation', color: 'var(--easy)', done: true,
        topics: [
            { title: 'Programming Basics', sub: 'Variables, loops, functions, OOP', done: true },
            { title: 'Complexity Analysis', sub: 'Big-O, time & space complexity', done: true },
            { title: 'Arrays & Strings', sub: 'Two pointers, sliding window, hashing', done: true },
            { title: 'Linked Lists', sub: 'Singly, doubly, cycle detection', done: false },
        ]
    },
    {
        id: 2, label: 'Core DSA', color: 'var(--orange)', done: false,
        topics: [
            { title: 'Stacks & Queues', sub: 'Monotonic stack, deque applications', done: false },
            { title: 'Trees & BSTs', sub: 'Traversals, height, LCA, balanced trees', done: false },
            { title: 'Heaps & Priority Queue', sub: 'Min/Max heap, K-th largest', done: false },
            { title: 'Graphs', sub: 'BFS, DFS, Dijkstra, Bellman-Ford', done: false },
        ]
    },
    {
        id: 3, label: 'Advanced', color: 'var(--purple)', done: false,
        topics: [
            { title: 'Dynamic Programming', sub: 'Memoization, tabulation, knapsack', done: false },
            { title: 'Greedy Algorithms', sub: 'Interval scheduling, activity selection', done: false },
            { title: 'Backtracking', sub: 'N-Queens, Sudoku, permutations', done: false },
            { title: 'Segment Trees & Trie', sub: 'Range queries, prefix trees', done: false },
        ]
    },
    {
        id: 4, label: 'Placement Ready', color: 'var(--blue)', done: false,
        topics: [
            { title: 'System Design', sub: 'URL shortener, Twitter feed, rate limiter', done: false },
            { title: 'OS & DBMS', sub: 'Processes, threads, SQL, indexing', done: false },
            { title: 'Computer Networks', sub: 'TCP/IP, HTTP, DNS, CDN', done: false },
            { title: 'Mock Interviews', sub: '3 full mock sessions + feedback', done: false },
        ]
    },
];

const paths = [
    { icon: Code2, label: 'SDE Path', sub: '120 problems', color: 'var(--orange)', active: true },
    { icon: Cpu, label: 'ML Engineer', sub: '80 problems', color: 'var(--purple)' },
    { icon: Database, label: 'Backend Dev', sub: '90 problems', color: 'var(--blue)' },
    { icon: Shield, label: 'Security', sub: '60 problems', color: 'var(--easy)' },
    { icon: BarChart2, label: 'Data Analyst', sub: '70 problems', color: 'var(--med)' },
    { icon: Globe, label: 'Full Stack', sub: '100 problems', color: 'var(--hard)' },
];

const Roadmap = () => {
    const [activePhase, setActivePhase] = useState(1);

    return (
        <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
            <div style={{ maxWidth: 1100 }}>

                {/* header */}
                <div className="section-hdr mb28">
                    <div>
                        <h1 className="section-title">Study Roadmap</h1>
                        <p className="section-sub">Your structured path from beginner to placement-ready.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm">Download PDF</button>
                        <button className="btn btn-primary btn-sm">Continue Learning →</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

                    {/* Left: learning paths */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Learning Paths</div>
                        {paths.map(({ icon: Icon, label, sub, color, active }) => (
                            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', marginBottom: 6, borderRadius: 10, background: active ? `${color}10` : 'var(--bg3)', border: `1px solid ${active ? color + '25' : 'var(--b1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseOver={e => { if (!active) e.currentTarget.style.background = 'var(--bg4)'; }}
                                onMouseOut={e => { if (!active) e.currentTarget.style.background = 'var(--bg3)'; }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={16} style={{ color }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? color : 'var(--t1)' }}>{label}</div>
                                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{sub}</div>
                                </div>
                                {active && <ChevronRight size={14} style={{ color }} />}
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${phase.color}15`, border: `1px solid ${phase.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: phase.color }}>{phase.id}</div>
                                    <div>
                                        <div style={{ fontSize: 17, fontWeight: 800 }}>Phase {phase.id}: {phase.label}</div>
                                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>{phase.topics.filter(t => t.done).length}/{phase.topics.length} topics completed</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {phase.topics.map((topic, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 18px', borderRadius: 12, background: 'var(--bg3)', border: `1px solid ${topic.done ? phase.color + '20' : 'var(--b1)'}`, transition: 'all 0.2s', cursor: 'pointer' }}
                                            onMouseOver={e => { e.currentTarget.style.borderColor = phase.color + '40'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                            onMouseOut={e => { e.currentTarget.style.borderColor = topic.done ? phase.color + '20' : 'var(--b1)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                                            <div style={{ marginTop: 2 }}>
                                                {topic.done
                                                    ? <CheckCircle2 size={20} style={{ color: phase.color }} />
                                                    : <Circle size={20} style={{ color: 'var(--t4)' }} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: topic.done ? phase.color : 'var(--t1)', marginBottom: 4 }}>{topic.title}</div>
                                                <div style={{ fontSize: 12, color: 'var(--t3)' }}>{topic.sub}</div>
                                            </div>
                                            <button style={{ padding: '5px 14px', borderRadius: 7, border: `1px solid ${topic.done ? phase.color + '30' : 'var(--b2)'}`, background: topic.done ? `${phase.color}10` : 'transparent', color: topic.done ? phase.color : 'var(--t3)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                                                {topic.done ? '✓ Done' : 'Start'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* progress bar */}
                                <div style={{ marginTop: 24, padding: '16px 18px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10 }}>
                                        <span style={{ color: 'var(--t2)' }}>Phase Progress</span>
                                        <span style={{ fontWeight: 700, color: phase.color }}>{Math.round((phase.topics.filter(t => t.done).length / phase.topics.length) * 100)}%</span>
                                    </div>
                                    <div style={{ background: 'var(--bg5)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 99, background: phase.color, width: `${(phase.topics.filter(t => t.done).length / phase.topics.length) * 100}%`, transition: 'width 0.8s ease', boxShadow: `0 0 8px ${phase.color}50` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
