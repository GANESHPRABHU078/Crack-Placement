import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  RefreshCcw, 
  Zap,
  Layout,
  Target,
  TrendingUp,
  History,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  BarChart2,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { developerService } from '../api/developerService';
import { practiceService } from '../api/practiceService';
import { useAuth } from '../context/AuthContext';

const STRENGTH_COLORS = { Strong: '#10b981', Medium: '#f59e0b', Weak: '#ef4444' };
const STRENGTH_BG    = { Strong: 'rgba(16,185,129,0.1)', Medium: 'rgba(245,158,11,0.1)', Weak: 'rgba(239,68,68,0.1)' };
const clampPercent = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(100, numeric));
};

const DevInsightsPage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [leetcodeUser, setLeetcodeUser] = useState('');
    const [platformStats, setPlatformStats] = useState({ solved: 0, total: 0, xp: 0, streak: 0, level: 1 });
    const [platformActivities, setPlatformActivities] = useState([]);
    const [topicInsights, setTopicInsights] = useState([]);
    const [weeklyTrendData, setWeeklyTrendData] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            setFetchError(false);
            fetchProfile();
            fetchPlatformData();
        }
    }, [user]);

    useEffect(() => {
        const handleProgressUpdated = (event) => {
            if (typeof event.detail?.completedCount !== 'number') return;
            setPlatformStats(prev => ({ ...prev, solved: event.detail.completedCount }));
        };

        window.addEventListener('practiceProgressUpdated', handleProgressUpdated);
        return () => window.removeEventListener('practiceProgressUpdated', handleProgressUpdated);
    }, []);

    const fetchPlatformData = async () => {
        try {
            const [progress, insights, recent] = await Promise.all([
                practiceService.getProgress?.(),
                practiceService.getInsights?.(),
                practiceService.getRecentActivity?.()
            ]);

            const insightTopics = Array.isArray(insights?.topicInsights) ? insights.topicInsights : [];
            const solved = progress?.completedCount ?? user?.problemsSolved ?? 0;

            setPlatformStats({
                solved,
                total: progress?.totalProblems ?? 0,
                xp: user?.xp || 0,
                streak: user?.currentStreak || 0,
                level: user?.level || 1
            });
            setTopicInsights(insightTopics);
            setPlatformActivities(Array.isArray(recent) ? recent : []);
            setWeeklyTrendData(
                insightTopics.slice(0, 7).map((topic) => ({
                    name: topic.name,
                    problems: topic.completedCount ?? topic.completed ?? 0,
                    contributions: clampPercent(topic.completionRate)
                }))
            );
        } catch (e) { /* non-critical */ }
    };

    const fetchProfile = async () => {
        try {
            const data = await developerService.getProfile(user.id);
            setProfile(data);
            setFetchError(false);
        } catch (e) {
            console.error('Profile fetch failed', e);
            if (e.response?.status === 404) {
                setShowLinkModal(true);
            } else {
                setFetchError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysis = async () => {
        if (!user?.id) return;
        setAnalysisLoading(true);
        try {
            const data = await developerService.getAnalysis(user.id);
            setAnalysis(data);
            setActiveTab('analysis');
        } catch (e) {
            console.error('Analysis fetch failed', e);
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const data = await developerService.syncProfile(user.id);
            setProfile(data);
            if (analysis) await fetchAnalysis();
        } catch (e) { console.error('Sync failed', e); }
        finally { setSyncing(false); }
    };

    const handleLink = async (e) => {
        e.preventDefault();
        setSyncing(true);
        try {
            const data = await developerService.linkProfile(user.id, null, leetcodeUser);
            setProfile(data);
            setShowLinkModal(false);
        } catch (e) { console.error('Link failed', e); }
        finally { setSyncing(false); }
    };

    if (loading) return (
        <div className="p48 text-center color-t2 faic jcc flex-col" style={{ minHeight: 400 }}>
            {fetchError ? (
                <>
                    <AlertTriangle size={40} className="color-red mb16" />
                    <h3 className="color-t1">Unable to Load Insights</h3>
                    <p className="fs14 color-t3 mb24">We couldn't reach the developer service. Please check your connection or try again.</p>
                    <button className="btn btn-primary" onClick={() => { setFetchError(false); setLoading(true); fetchProfile(); fetchPlatformData(); }}>
                        <RefreshCcw size={15} className="mr8" /> Retry Now
                    </button>
                </>
            ) : (
                <>
                    <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 1, 0.6] 
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                        }}
                    >
                        <RefreshCcw size={48} className="spin mb20 color-p" />
                    </motion.div>
                    <motion.div 
                        className="fs18 fw800 color-t1 glow-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Gathering Your Insights
                    </motion.div>
                    <div className="fs14 color-t3 mt8 max-w-sm mx-auto">
                        We're synchronizing your latest performance data from LeetCode. This usually takes 5-10 seconds.
                    </div>
                </>
            )}
        </div>
    );

    // LeetCode chart data
    const leetcodeData = profile ? [
        { name: 'Easy',   value: profile.leetcodeEasySolved   || 0, color: '#10b981' },
        { name: 'Medium', value: profile.leetcodeMediumSolved || 0, color: '#f59e0b' },
        { name: 'Hard',   value: profile.leetcodeHardSolved   || 0, color: '#ef4444' },
    ] : [];

    // Analysis chart data
    const topicChartData = (analysis?.topics || []).map(t => ({
        name: t.topic.length > 15 ? t.topic.slice(0, 13) + '…' : t.topic,
        fullName: t.topic,
        solved: t.solved,
        expected: t.expected,
        strength: t.strength,
    }));

    const blueprintData = topicInsights.length > 0 ? topicInsights.slice(0, 4).map((topic) => ({
        label: topic.name,
        value: clampPercent(topic.completionRate),
        color: clampPercent(topic.completionRate) >= 60 ? '#10b981' : clampPercent(topic.completionRate) >= 30 ? '#f59e0b' : '#ef4444'
    })) : [
        { label: 'DSA Mastery', value: platformStats.total ? clampPercent((platformStats.solved / platformStats.total) * 100) : 0, color: 'var(--blue)' },
        { label: 'Easy Problems', value: Math.min(100, ((profile?.leetcodeEasySolved || 0) / 50) * 100), color: '#10b981' },
        { label: 'Medium Problems', value: Math.min(100, ((profile?.leetcodeMediumSolved || 0) / 30) * 100), color: '#f59e0b' },
        { label: 'Hard Problems', value: Math.min(100, ((profile?.leetcodeHardSolved || 0) / 10) * 100), color: '#ef4444' },
    ];

    const chartData = weeklyTrendData.length > 0 ? weeklyTrendData : [
        {
            name: 'Progress',
            problems: platformStats.solved,
            contributions: platformStats.total ? clampPercent((platformStats.solved / platformStats.total) * 100) : 0
        }
    ];

    return (
        <div className="app-page on practice-page">
            <div className="practice-shell">
                <div className="practice-hero">
                    <div>
                        <div className="practice-kicker">Developer Intelligence Dashboard</div>
                        <h1 className="practice-title">Dev Insights</h1>
                        <p className="practice-subtitle">
                            Gain deep insights into your problem-solving patterns, technical proficiency, and preparation progress.
                        </p>
                    </div>

                    <div className="practice-summary-grid">
                        <div className="practice-summary-card">
                            <span>Dev Score</span>
                            <strong className="glow-orange">{profile?.developerScore || 0}</strong>
                        </div>
                        <div className="practice-summary-card">
                            <span>Solved</span>
                            <strong style={{ color: 'var(--green)' }}>{platformStats.solved}</strong>
                        </div>
                        <div className="practice-summary-card">
                            <span>XP Earned</span>
                            <strong style={{ color: 'var(--blue)' }}>{platformStats.xp}</strong>
                        </div>
                        <div className="practice-summary-card">
                            <span>Global Rank</span>
                            <strong>#{profile?.leetcodeRanking?.toLocaleString() || 'N/A'}</strong>
                        </div>
                    </div>

                    <div className="faic gap12 mt32">
                        {profile && (
                            <button
                                className={`btn btn-outline faic gap8 ${analysisLoading ? 'btn-ghost' : ''}`}
                                onClick={fetchAnalysis}
                                disabled={analysisLoading}
                            >
                                <BarChart2 size={15} className={analysisLoading ? 'spin' : ''} />
                                {analysisLoading ? 'Analyzing…' : 'Analyze Weaknesses'}
                            </button>
                        )}
                        <button 
                            className={`btn ${syncing ? 'btn-ghost' : 'btn-primary'} faic gap8 px20`} 
                            onClick={handleSync} 
                            disabled={syncing}
                            style={{ 
                                background: syncing ? 'transparent' : 'var(--grad-p)',
                                boxShadow: syncing ? 'none' : '0 0 15px rgba(168, 85, 247, 0.3)'
                            }}
                        >
                            <RefreshCcw size={15} className={syncing ? 'spin' : ''} />
                            {syncing ? 'Syncing Profile…' : 'Sync Latest'}
                        </button>
                    </div>
                </div>

                <div className="practice-section">
                    {profile && analysis && (
                        <div className="faic gap24 mb32" style={{ borderBottom: '1px solid var(--b1)' }}>
                            {[
                                { id: 'overview',  label: 'Overview',          icon: Layout   },
                                { id: 'analysis',  label: 'Weakness Analyzer', icon: BarChart2 }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`btn btn-ghost faic gap8 fs14 ${activeTab === tab.id ? 'color-p fw800' : 'color-t3'}`}
                                    style={{ borderBottom: activeTab === tab.id ? '3px solid var(--p)' : '3px solid transparent', borderRadius: 0, paddingBottom: 16, paddingLeft: 0, paddingRight: 0 }}>
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {!profile ? (
                        <div className="card text-center p48">
                            <Layout size={48} className="mb16 color-t3 mx-auto" />
                            <h3>No LeetCode Profile Linked</h3>
                            <p className="color-t3 mb24">Connect your LeetCode account to see your developer insights and track weak topics.</p>
                            <button className="btn btn-primary" onClick={() => setShowLinkModal(true)}>Connect LeetCode</button>
                        </div>
                    ) : activeTab === 'analysis' && analysis ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb32">
                                {[
                                    { label: 'Weak Topics',      count: analysis.weakTopics?.length   || 0, color: '#ef4444', badge: 'Need Practice', glow: 'glow-red'    },
                                    { label: 'Improving Topics', count: analysis.mediumTopics?.length || 0, color: '#f59e0b', badge: 'In Progress',  glow: 'glow-orange' },
                                    { label: 'Strong Topics',    count: analysis.strongTopics?.length || 0, color: '#10b981', badge: 'Mastered',     glow: 'glow-green'  },
                                ].map((s, i) => (
                                    <motion.div key={s.label} className="glass-card p24 text-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                        <div className={`fs40 fw900 mb4 ${s.glow}`} style={{ color: s.color }}>{s.count}</div>
                                        <div className="fs13 color-t3 fw600 uppercase tracking-wider mb12">{s.label}</div>
                                        <div className="badge-lg fs11" style={{ background: `${s.color}15`, color: s.color, border: 'none' }}>{s.badge}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div className="glass-card p24 mb32" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                                <div className="card-hdr mb24">
                                    <div className="card-title fs18 fw800 faic gap10"><BarChart2 size={20} className="glow-blue" /> Strength Analytics</div>
                                    <div className="faic gap20 mt16">
                                        {Object.entries(STRENGTH_COLORS).map(([s, c]) => (
                                            <div key={s} className="faic gap8 fs12 color-t3 fw600 uppercase tracking-tight">
                                                <div style={{ width: 12, height: 12, borderRadius: 4, background: c }} /> {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ height: 340 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topicChartData} margin={{ top: 0, right: 20, left: -10, bottom: 60 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--b1)" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--t3)' }} angle={-35} textAnchor="end" interval={0} />
                                            <YAxis tick={{ fontSize: 11, fill: 'var(--t3)' }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: 'var(--bg1)', border: '1px solid var(--b1)', borderRadius: 8, fontSize: 12 }}
                                                formatter={(val, _n, props) => [`${val} solved / ${props.payload.expected} expected`, props.payload.fullName]}
                                            />
                                            <Bar dataKey="solved" maxBarSize={32}>
                                                {topicChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={STRENGTH_COLORS[entry.strength] || '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                                <motion.div className="glass-card p24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <div className="card-hdr mb20"><div className="card-title fs16 fw800 faic gap10"><AlertTriangle size={18} className="glow-red" /> Critical Focus Areas</div></div>
                                    <div className="g1 gap12">
                                        {(analysis.weakTopics || []).slice(0, 8).map((topic, i) => {
                                            const t = analysis.topics?.find(x => x.topic === topic);
                                            return (
                                                <div key={i} className="faic jsb p14 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                                    <div><div className="fs14 fw700 color-t1">{topic}</div><div className="fs11 color-t3 uppercase tracking-wide mt2">{t?.solved || 0} / {t?.expected || 0} COMPLETED</div></div>
                                                    <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', fontSize: 10, fontWeight: 700 }}>PRIORITY</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                                <motion.div className="glass-card p24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <div className="card-hdr mb20"><div className="card-title fs16 fw800 faic gap10"><Zap size={18} className="glow-orange" /> AI Strategic Insights</div></div>
                                    <div className="g1 gap12 p4">
                                        {(analysis.insights || []).map((msg, i) => (
                                            <div key={i} className="p14 rounded-xl faic gap12" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                                <div className="glow-text" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
                                                <span className="fs13 color-t1 leading-relaxed">{msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb32">
                                <div className="glass-card stat-card p24 text-center">
                                    <div className="faic jcc mb16"><div className="badge-lg" style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--orange)', padding: 12 }}><Zap size={28} className="glow-orange" /></div></div>
                                    <div className="fs40 fw900 glow-orange mb4">{profile.developerScore}</div>
                                    <div className="color-t3 fs13 fw600 mb16 uppercase tracking-wider">Skill Rating</div>
                                    <span className="badge-lg fs12" style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '4px 16px' }}>{profile.developerLevel}</span>
                                </div>
                                <div className="glass-card stat-card p24">
                                    <div className="faic gap12 mb20"><div className="si-g p8 rounded-xl"><CheckCircle2 size={20} className="glow-green" /></div><div className="fw800 fs16">Platform Mastery</div></div>
                                    <div className="g2 gap16">
                                        <div><div className="fs28 fw900 glow-green">{platformStats.solved}</div><div className="fs12 color-t3 fw600 uppercase">Solved</div></div>
                                        <div><div className="fs28 fw900 color-t1">{platformStats.xp}</div><div className="fs12 color-t3 fw600 uppercase">XP</div></div>
                                    </div>
                                </div>
                                <div className="glass-card stat-card p24">
                                    <div className="faic gap12 mb20"><div className="si-c p8 rounded-xl"><Code2 size={20} className="glow-blue" /></div><div className="fw800 fs16">LeetCode Pulse</div></div>
                                    <div className="g2 gap16">
                                        <div><div className="fs28 fw900 glow-blue">{profile.leetcodeTotalSolved}</div><div className="fs12 color-t3 fw600 uppercase">Total</div></div>
                                        <div><div className="fs28 fw900 color-t1">#{profile.leetcodeRanking?.toLocaleString()}</div><div className="fs12 color-t3 fw600 uppercase">Rank</div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                                <div className="glass-card p24">
                                    <div className="card-hdr faic jsb mb20"><div className="card-title fs16 fw800 faic gap10"><History size={20} className="glow-blue" /> Recent Activity</div></div>
                                    <div className="g1 gap10">
                                        {platformActivities.length > 0 ? platformActivities.slice(0, 5).map((act, i) => (
                                            <div key={i} className="faic gap14 p12 rounded-xl border border-transparent hover-bg-gray2">
                                                <div className="stat-ico si-g w36 h36 rounded-xl"><Target size={16} className="glow-green" /></div>
                                                <div className="flex-1"><div className="fs14 fw700 color-t1">{act.title}</div><div className="fs11 color-t3 uppercase tracking-wider mt1">{act.topic?.name}</div></div>
                                            </div>
                                        )) : <div className="p32 text-center color-t4 fs14 italic">No recent activity.</div>}
                                    </div>
                                </div>
                                <div className="glass-card p24">
                                    <div className="card-hdr mb20"><div className="card-title fs16 fw800 faic gap10"><TrendingUp size={20} className="glow-green" /> Preparation Blueprint</div></div>
                                    <div className="g1 gap20 p8">
                                        {blueprintData.map((skill, idx) => (
                                            <div key={idx}>
                                                <div className="faic jsb mb8 fs12"><span className="fw700 color-t2 uppercase">{skill.label}</span><span className="fw800 color-t1">{Math.round(skill.value)}%</span></div>
                                                <div style={{ height: 10, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', background: skill.color, width: `${skill.value}%`, borderRadius: 10 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {showLinkModal && (
                        <motion.div className="modal-overlay" onClick={() => setShowLinkModal(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="modal-content glass-card" style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
                                <div className="modal-hdr p24" style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--b1)' }}>
                                    <div className="modal-title fs18 fw800">Connect LeetCode</div>
                                    <p className="fs13 color-t3 mt4">Link your account to see your developer insights</p>
                                </div>
                                <form onSubmit={handleLink} className="p24">
                                    <div className="mb24">
                                        <label className="fs12 mb8 db fw700 uppercase tracking-wide color-t2">LeetCode Username</label>
                                        <div className="input-wrap">
                                            <Code2 size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-p" />
                                            <input type="text" className="input pl36" placeholder="e.g. hackercat" value={leetcodeUser} onChange={e => setLeetcodeUser(e.target.value)} required style={{ background: 'var(--bg1)', border: '1px solid var(--b1)' }} />
                                        </div>
                                    </div>
                                    <div className="faic jse gap12">
                                        <button type="button" className="btn btn-ghost" onClick={() => setShowLinkModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary px24" disabled={syncing}>{syncing ? 'Connecting...' : 'Sync Profile'}</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DevInsightsPage;
