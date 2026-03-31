import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Search, TrendingUp, Users, BookOpen, Award, ChevronRight } from 'lucide-react';

const posts = [
    { id: 1, type: 'experience', user: 'Arjun Kumar', college: 'IIT Bombay', avatar: 'AK', company: 'Google', role: 'SDE-1', title: 'Cracked Google L3 — Full Interview Experience', body: 'I got an offer from Google after 6 rounds. 2 DSA rounds (trees, graphs, DP), 1 system design (design YouTube), 1 Googleyness + leadership, and 2 team match calls. Key was practicing Blind 75 + system design primers daily for 3 months straight...', tags: ['google', 'sde', 'interview'], likes: 342, comments: 48, time: '2h ago', hot: true },
    { id: 2, type: 'question', user: 'Priya Sharma', college: 'NIT Trichy', avatar: 'PS', title: 'How to approach Dynamic Programming from scratch?', body: 'I keep getting stuck whenever I see a DP problem. What\'s the best framework to think about these? Should I start with memoization or tabulation? Any good resources or problem lists to follow?', tags: ['dp', 'beginners', 'help'], likes: 89, comments: 23, time: '4h ago' },
    { id: 3, type: 'resource', user: 'Rohit Mehta', college: 'BITS Pilani', avatar: 'RM', title: '500+ curated problems with video solutions — FREE resource dump', body: 'Compiled problems from LeetCode, GFG, and Codeforces organized by topic and difficulty. Each has a video walkthrough. Topics: Arrays, Strings, Trees, Graphs, DP, Backtracking, Greedy, Bit Manipulation...', tags: ['resources', 'free', 'dsa'], likes: 1204, comments: 167, time: '1d ago', pinned: true },
    { id: 4, type: 'experience', user: 'Sneha Patel', college: 'VIT Vellore', avatar: 'SP', company: 'Microsoft', role: 'SDE', title: 'Microsoft Placement Experience 🎉', body: 'Just received my Microsoft offer letter! 4 coding rounds + HR. Round 1: Easy-Medium (Arrays/Strings). Round 2: Medium-Hard (Trees). Round 3: System Design. Round 4: Design + Behavioral. Tips: Always explain your approach before coding!', tags: ['microsoft', 'placement', 'success'], likes: 521, comments: 73, time: '2d ago' },
];

const typeColor = { experience: 'var(--orange)', question: 'var(--blue)', resource: 'var(--easy)' };
const typeBg = { experience: 'var(--orange-d)', question: 'var(--blue-d)', resource: 'var(--easy-d)' };
const typeLabel = { experience: 'Interview Exp', question: 'Question', resource: '📦 Resource' };

const topUsers = [
    { name: 'Arjun Kumar', score: 4820, avatar: 'AK' },
    { name: 'Priya Sharma', score: 4610, avatar: 'PS' },
    { name: 'Rohit Mehta', score: 4480, avatar: 'RM' },
];

const Community = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [filter, setFilter] = useState('all');

    const toggleLike = (id) => {
        setLikedPosts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

    return (
        <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
            <div style={{ maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr 270px', gap: 24 }}>

                <div>
                    <div className="section-hdr mb20">
                        <div>
                            <h1 className="section-title">Community</h1>
                            <p className="section-sub">Experiences, questions, and resources from 28k+ students.</p>
                        </div>
                        <button className="btn btn-primary">+ Share Experience</button>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 10, padding: '8px 14px' }}>
                            <Search size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                            <input placeholder="Search posts, experiences, questions..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontSize: 13, fontFamily: 'var(--sans)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {['all', 'experience', 'question', 'resource'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: 100, border: `1px solid ${filter === f ? (typeColor[f] || 'var(--orange)') : 'var(--b2)'}`, background: filter === f ? (typeBg[f] || 'var(--orange-d)') : 'transparent', color: filter === f ? (typeColor[f] || 'var(--orange)') : 'var(--t3)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                                {f === 'all' ? 'All Posts' : typeLabel[f]}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map(post => (
                            <div key={post.id} style={{ padding: '18px 20px', background: 'var(--bg3)', border: `1px solid ${post.pinned ? 'rgba(249,115,22,0.2)' : 'var(--b1)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--b3)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = post.pinned ? 'rgba(249,115,22,0.2)' : 'var(--b1)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                {post.pinned && <div style={{ display: 'inline-flex', gap: 5, background: 'var(--orange-d)', color: 'var(--orange)', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 100, marginBottom: 10 }}>📌 PINNED</div>}

                                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--grad-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{post.avatar}</div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 13, fontWeight: 700 }}>{post.user}</span>
                                            <span style={{ fontSize: 11, color: 'var(--t3)' }}>{post.college}</span>
                                            {post.company && <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--orange-d)', color: 'var(--orange)', fontSize: 10, fontWeight: 800 }}>{post.company} · {post.role}</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 4, background: typeBg[post.type], color: typeColor[post.type], fontSize: 10, fontWeight: 800 }}>{typeLabel[post.type]}</span>
                                            <span style={{ fontSize: 11, color: 'var(--t3)' }}>{post.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{post.title}</div>
                                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.body}</div>

                                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                                    {post.tags.map(t => <span key={t} style={{ padding: '2px 9px', borderRadius: 100, background: 'var(--bg4)', color: 'var(--t3)', fontSize: 11, border: '1px solid var(--b1)' }}>#{t}</span>)}
                                </div>

                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--t3)', borderTop: '1px solid var(--b1)', paddingTop: 12 }}>
                                    <button onClick={() => toggleLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, color: likedPosts.has(post.id) ? 'var(--hard)' : 'var(--t3)', transition: 'color 0.15s' }}>
                                        <Heart size={14} fill={likedPosts.has(post.id) ? 'var(--hard)' : 'none'} /> {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                                    </button>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MessageCircle size={14} /> {post.comments}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><Share2 size={14} /> Share</span>
                                    <span style={{ marginLeft: 'auto', color: 'var(--orange)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Read More <ChevronRight size={12} /></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: '16px 18px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🔥 Community Stats</div>
                        {[{ icon: Users, label: 'Members', val: '28,400' }, { icon: BookOpen, label: 'Posts this week', val: '1,240' }, { icon: Award, label: 'Placements shared', val: '3,890' }].map(({ icon: Icon, label, val }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--b1)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t2)' }}><Icon size={13} /> {label}</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--orange)' }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '16px 18px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>⭐ Top Contributors</div>
                        {topUsers.map((u, i) => (
                            <div key={u.name} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i < topUsers.length - 1 ? '1px solid var(--b1)' : 'none' }}>
                                <span style={{ fontSize: 14, fontWeight: 800, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32', width: 22 }}>#{i + 1}</span>
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--grad-o)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{u.avatar}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: 10, color: 'var(--t3)' }}>{u.score.toLocaleString()} pts</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '16px 18px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> Trending Tags</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {['#google', '#placement', '#dp', '#interview', '#faang', '#sde', '#microsoft', '#graphs'].map(t => (
                                <span key={t} style={{ padding: '3px 10px', borderRadius: 100, background: 'var(--bg4)', color: 'var(--t2)', fontSize: 11, cursor: 'pointer', border: '1px solid var(--b1)', transition: 'all 0.15s' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.color = 'var(--t2)'; }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
