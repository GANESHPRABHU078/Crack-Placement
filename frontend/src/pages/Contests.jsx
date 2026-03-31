import React, { useState } from 'react';
import { Trophy, Clock, Users, ChevronRight, Calendar, Star, Zap } from 'lucide-react';

const upcoming = [
    { id: 1, title: 'PlacementOS Weekly Round #42', date: 'Mar 30, 10:00 AM', duration: '2h', participants: 1240, difficulty: 'Medium', prize: '₹5,000', tags: ['algorithms', 'math'], color: 'var(--orange)' },
    { id: 2, title: 'DSA Sprint Championship', date: 'Apr 3, 06:00 PM', duration: '3h', participants: 870, difficulty: 'Hard', prize: '₹15,000', tags: ['graphs', 'dp'], color: 'var(--purple)' },
    { id: 3, title: 'Campus Code Fiesta', date: 'Apr 7, 11:00 AM', duration: '1.5h', participants: 534, difficulty: 'Easy', prize: '₹2,500', tags: ['strings', 'arrays'], color: 'var(--easy)' },
];

const past = [
    { id: 4, title: 'BiWeekly Contest #18', date: 'Mar 23', rank: 312, solved: 3, total: 4, out: 3400 },
    { id: 5, title: 'PlacementOS Weekly Round #41', date: 'Mar 22', rank: 187, solved: 4, total: 5, out: 2900 },
    { id: 6, title: 'Speed Coding Challenge', date: 'Mar 18', rank: 44, solved: 5, total: 5, out: 1800 },
];

const leaderboard = [
    { rank: 1, name: 'Arjun Kumar', college: 'IIT Bombay', score: 4820, streak: 42 },
    { rank: 2, name: 'Priya Sharma', college: 'NIT Trichy', score: 4610, streak: 38 },
    { rank: 3, name: 'Rohit Singh', college: 'BITS Pilani', score: 4480, streak: 29 },
    { rank: 4, name: 'Sneha Patel', college: 'VIT Vellore', score: 4290, streak: 24 },
    { rank: 5, name: 'Vishal Rao', college: 'NSIT Delhi', score: 4150, streak: 31 },
];

const diffColor = { Easy: 'var(--easy)', Medium: 'var(--med)', Hard: 'var(--hard)' };
const diffBg = { Easy: 'var(--easy-d)', Medium: 'var(--med-d)', Hard: 'var(--hard-d)' };

const Contests = () => {
    const [tab, setTab] = useState('upcoming');

    return (
        <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
            <div style={{ maxWidth: 1100 }}>

                <div className="section-hdr mb28">
                    <div>
                        <h1 className="section-title">Contests</h1>
                        <p className="section-sub">Compete, rank, and win — every week.</p>
                    </div>
                    <button className="btn btn-primary"><Trophy size={14} /> My Contest History</button>
                </div>

                {/* global stats */}
                <div className="g4 mb28">
                    {[
                        { label: 'Global Rank', val: '#312', color: 'var(--orange)', icon: Trophy },
                        { label: 'Contests Entered', val: '14', color: 'var(--purple)', icon: Zap },
                        { label: 'Best Rank', val: '#44', color: 'var(--easy)', icon: Star },
                        { label: 'Rating', val: '1,482', color: 'var(--blue)', icon: BarChart },
                    ].map(({ label, val, color, icon: Icon }) => (
                        <div key={label} style={{ padding: '18px 20px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14, position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = color + '30'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}10`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: `1px solid ${color}25` }}>
                                <Icon size={16} style={{ color }} />
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>{val}</div>
                            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* tabs */}
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--b1)', marginBottom: 24, width: 'fit-content' }}>
                    {['upcoming', 'past', 'leaderboard'].map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', background: tab === t ? 'var(--bg5)' : 'transparent', color: tab === t ? 'var(--t1)' : 'var(--t3)', textTransform: 'capitalize', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}>{t}</button>
                    ))}
                </div>

                {/* upcoming */}
                {tab === 'upcoming' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {upcoming.map(c => (
                            <div key={c.id} style={{ padding: '20px 24px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14, display: 'flex', gap: 20, alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = c.color + '35'; e.currentTarget.style.boxShadow = `0 8px 28px ${c.color}08`; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: c.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c.color}25`, flexShrink: 0 }}>
                                    <Trophy size={22} style={{ color: c.color }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
                                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--t3)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {c.date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {c.duration}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> {c.participants.toLocaleString()} registered</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: 6, background: diffBg[c.difficulty], color: diffColor[c.difficulty], fontSize: 11, fontWeight: 700 }}>{c.difficulty}</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--easy)' }}>{c.prize}</div>
                                        <div style={{ fontSize: 10, color: 'var(--t4)' }}>Prize Pool</div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Register</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* past */}
                {tab === 'past' && (
                    <div style={{ border: '1px solid var(--b1)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 20px', background: 'var(--bg4)', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--b1)' }}>
                            <span>Contest</span><span style={{ textAlign: 'center' }}>Rank</span><span style={{ textAlign: 'center' }}>Solved</span><span style={{ textAlign: 'right' }}>Date</span>
                        </div>
                        {past.map(c => (
                            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid var(--b1)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'var(--bg4)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</span>
                                <span style={{ textAlign: 'center', fontWeight: 800, fontSize: 14, color: c.rank <= 50 ? 'var(--orange)' : 'var(--t1)' }}>#{c.rank}<span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 400 }}>/{c.out.toLocaleString()}</span></span>
                                <span style={{ textAlign: 'center', fontSize: 13, color: c.solved === c.total ? 'var(--easy)' : 'var(--t2)', fontWeight: 600 }}>{c.solved}/{c.total}</span>
                                <span style={{ textAlign: 'right', fontSize: 12, color: 'var(--t3)' }}>{c.date}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* leaderboard */}
                {tab === 'leaderboard' && (
                    <div style={{ border: '1px solid var(--b1)', borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '12px 20px', background: 'var(--bg4)', borderBottom: '1px solid var(--b1)', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'grid', gridTemplateColumns: '50px 1fr 120px 100px' }}>
                            <span>Rank</span><span>Student</span><span style={{ textAlign: 'center' }}>Rating</span><span style={{ textAlign: 'right' }}>Streak</span>
                        </div>
                        {leaderboard.map(u => (
                            <div key={u.rank} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 120px 100px', padding: '14px 20px', borderBottom: '1px solid var(--b1)', alignItems: 'center', cursor: 'pointer', background: u.rank <= 3 ? `rgba(249,115,22,0.02)` : 'transparent', transition: 'background 0.15s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'var(--bg4)'}
                                onMouseOut={e => e.currentTarget.style.background = u.rank <= 3 ? `rgba(249,115,22,0.02)` : 'transparent'}>
                                <span style={{ fontSize: 16, fontWeight: 900, color: u.rank === 1 ? '#FFD700' : u.rank === 2 ? '#C0C0C0' : u.rank === 3 ? '#CD7F32' : 'var(--t3)' }}>#{u.rank}</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{u.college}</div>
                                </div>
                                <span style={{ textAlign: 'center', fontWeight: 800, color: 'var(--orange)' }}>{u.score.toLocaleString()}</span>
                                <span style={{ textAlign: 'right', fontSize: 12, color: 'var(--t2)' }}>🔥 {u.streak}d</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// BarChart icon inline since not imported above
const BarChart = ({ size, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

export default Contests;
