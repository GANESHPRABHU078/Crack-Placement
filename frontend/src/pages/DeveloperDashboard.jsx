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
        <motion.div 
            className="p28"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── Header ── */}
            <div className="faic jsb mb32">
                <div>
                    <h1 className="section-title fs32 mb4">Developer Dashboard</h1>
                    <p className="section-sub fs15">Gain deep insights into your problem-solving patterns and technical proficiency.</p>
                </div>
                <div className="faic gap12">
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
                    <button className="btn btn-ghost hover-bg-gray2" onClick={() => setShowLinkModal(true)}>Settings</button>
                </div>
            </div>

            {/* ── Tabs ── */}
            {profile && analysis && (
                <div className="faic gap4 mb24" style={{ borderBottom: '1px solid var(--b1)' }}>
                    {[
                        { id: 'overview',  label: 'Overview',          icon: Layout   },
                        { id: 'analysis',  label: 'Weakness Analyzer', icon: BarChart2 }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`btn btn-ghost faic gap8 fs13 ${activeTab === tab.id ? 'color-p fw700' : 'color-t3'}`}
                            style={{ borderBottom: activeTab === tab.id ? '2px solid var(--p)' : '2px solid transparent', borderRadius: 0, paddingBottom: 12 }}>
                            <tab.icon size={15} /> {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── No Profile ── */}
            {!profile ? (
                <div className="card text-center p48">
                    <Layout size={48} className="mb16 color-t3 mx-auto" />
                    <h3>No LeetCode Profile Linked</h3>
                    <p className="color-t3 mb24">Connect your LeetCode account to see your developer insights and track weak topics.</p>
                    <button className="btn btn-primary" onClick={() => setShowLinkModal(true)}>Connect LeetCode</button>
                </div>

            /* ── Analysis Tab ── */
            ) : activeTab === 'analysis' && analysis ? (
                <div>
                    {/* Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb32">
                        {[
                            { label: 'Weak Topics',      count: analysis.weakTopics?.length   || 0, color: '#ef4444', badge: 'Need Practice', glow: 'glow-red'    },
                            { label: 'Improving Topics', count: analysis.mediumTopics?.length || 0, color: '#f59e0b', badge: 'In Progress',  glow: 'glow-orange' },
                            { label: 'Strong Topics',    count: analysis.strongTopics?.length || 0, color: '#10b981', badge: 'Mastered',     glow: 'glow-green'  },
                        ].map((s, i) => (
                            <motion.div 
                                key={s.label} 
                                className="glass-card p24 text-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={`fs40 fw900 mb4 ${s.glow}`} style={{ color: s.color }}>{s.count}</div>
                                <div className="fs13 color-t3 fw600 uppercase tracking-wider mb12">{s.label}</div>
                                <div className="badge-lg fs11" style={{ background: `${s.color}15`, color: s.color, border: 'none' }}>{s.badge}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Topic Bar Chart */}
                    <motion.div 
                        className="glass-card p24 mb32"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
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

                    {/* Weak Highlights + Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                        <motion.div 
                            className="glass-card p24"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="card-hdr mb20">
                                <div className="card-title fs16 fw800 faic gap10">
                                    <AlertTriangle size={18} className="glow-red" /> Critical Focus Areas
                                </div>
                            </div>
                            <div className="g1 gap12">
                                {(analysis.weakTopics || []).slice(0, 8).map((topic, i) => {
                                    const t = analysis.topics?.find(x => x.topic === topic);
                                    return (
                                        <div key={i} className="faic jsb p14 rounded-xl"
                                            style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                            <div>
                                                <div className="fs14 fw700 color-t1">{topic}</div>
                                                <div className="fs11 color-t3 uppercase tracking-wide mt2">{t?.solved || 0} / {t?.expected || 0} COMPLETED</div>
                                            </div>
                                            <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', fontSize: 10, fontWeight: 700 }}>PRIORITY</span>
                                        </div>
                                    );
                                })}
                                {!(analysis.weakTopics?.length) && (
                                    <div className="p32 text-center color-t4 fs14 italic">You have no weak topics. Exceptional!</div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="glass-card p24"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="card-hdr mb20">
                                <div className="card-title fs16 fw800 faic gap10"><Zap size={18} className="glow-orange" /> AI Strategic Insights</div>
                            </div>
                            <div className="g1 gap12 p4">
                                {(analysis.insights || []).map((msg, i) => {
                                     const isStrong = msg.includes('strong');
                                     const isWeak = msg.includes('improvement') || msg.includes('Easy');
                                     const color = isStrong ? 'var(--green)' : isWeak ? 'var(--hard)' : 'var(--blue)';
                                     const bg = isStrong ? 'rgba(16,185,129,0.05)' : isWeak ? 'rgba(239,68,68,0.05)' : 'rgba(59,130,246,0.05)';
                                     return (
                                         <div key={i} className="p14 rounded-xl faic gap12"
                                             style={{ background: bg, border: `1px solid ${color}15` }}>
                                             <div className="glow-text" style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                             <span className="fs13 color-t1 leading-relaxed">{msg}</span>
                                         </div>
                                     );
                                 })}
                            </div>
                            {/* Difficulty bars */}
                            <div className="mt24 pt20" style={{ borderTop: '1px solid var(--b1)' }}>
                                <div className="fs12 fw700 color-t2 uppercase tracking-wider mb16">Preparation Balance</div>
                                {[
                                    { label: 'Easy',   count: analysis.difficultyBreakdown?.easy   || 0, color: 'var(--green)' },
                                    { label: 'Medium', count: analysis.difficultyBreakdown?.medium || 0, color: 'var(--med)' },
                                    { label: 'Hard',   count: analysis.difficultyBreakdown?.hard   || 0, color: 'var(--hard)' },
                                ].map(d => {
                                    const total = analysis.difficultyBreakdown?.total || 1;
                                    const pct = Math.round((d.count / total) * 100);
                                    return (
                                        <div key={d.label} className="mb14">
                                            <div className="faic jsb mb6 fs12">
                                                <span className="fw700 color-t1">{d.label}</span>
                                                <span className="color-t3 fw600">{d.count} ({pct}%)</span>
                                            </div>
                                            <div style={{ height: 8, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden' }}>
                                                <motion.div 
                                                    style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 10 }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Recommendations */}
                    {(analysis.recommendations || []).length > 0 && (
                        <motion.div 
                            className="glass-card p24 mb32"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="card-hdr mb24">
                                <div className="card-title fs18 fw800 faic gap10"><BookOpen size={20} className="glow-blue" /> Targeted Training Modules</div>
                                <p className="fs13 color-t3 mt4">Handpicked problems to bridge your specific knowledge gaps.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
                                {analysis.recommendations.map((rec, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="p20 rounded-2xl" 
                                        style={{ background: 'var(--bg3)', border: '1px solid var(--b1)' }}
                                        whileHover={{ y: -5, borderColor: 'var(--blue-d)' }}
                                    >
                                        <div className="faic gap10 mb16">
                                            <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', fontSize: 10, fontWeight: 800 }}>WEAKNESS</span>
                                            <span className="fs15 fw800 color-t1">{rec.topic}</span>
                                        </div>
                                        <div className="faic gap10">
                                            <a href={rec.leetcode} target="_blank" rel="noopener noreferrer"
                                               className="btn btn-primary faic gap8"
                                               style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '10px' }}>
                                                <Code2 size={14} /> LeetCode
                                            </a>
                                            <a href={rec.gfg} target="_blank" rel="noopener noreferrer"
                                               className="btn btn-outline faic gap8"
                                               style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '10px' }}>
                                                <BookOpen size={14} /> GFG
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Full Topic Table */}
                    <motion.div 
                        className="glass-card p24 mb32"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="card-hdr mb24">
                            <div className="card-title fs16 fw800 faic gap10"><Target size={18} className="color-t2" /> Complete Topic Inventory</div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr>
                                        {['Topic', 'Solved', 'Goal', 'Proficiency', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '0 16px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(analysis.topics || []).map((t, i) => (
                                        <tr key={i} className="hover-bg-gray2" style={{ transition: 'all 0.2s' }}>
                                            <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--t1)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px 0 0 12px' }}>{t.topic}</td>
                                            <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--t2)', background: 'rgba(255,255,255,0.02)' }}>{t.solved}</td>
                                            <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--t3)', background: 'rgba(255,255,255,0.02)' }}>{t.expected}+</td>
                                            <td style={{ padding: '14px 16px', minWidth: 140, background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden', width: '100%', maxWidth: 100 }}>
                                                    <motion.div 
                                                        style={{ height: '100%', background: STRENGTH_COLORS[t.strength], borderRadius: 10 }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${t.percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.05 }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 700, marginTop: 4, display: 'block' }}>{t.percentage}%</span>
                                            </td>
                                            <td style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 12px 12px 0' }}>
                                                <span className="badge" style={{ background: STRENGTH_BG[t.strength], color: STRENGTH_COLORS[t.strength], border: 'none', fontSize: 10, fontWeight: 800, padding: '4px 10px' }}>
                                                    {t.strength.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

            /* ── Overview Tab ── */
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb32">
                        {/* Dev Score */}
                        <motion.div 
                            className="glass-card stat-card p24 text-center"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="faic jcc mb16">
                                <div className="badge-lg" style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--orange)', padding: 12 }}><Zap size={28} className="glow-orange" /></div>
                            </div>
                            <div className="fs40 fw900 glow-orange mb4">{profile.developerScore}</div>
                            <div className="color-t3 fs13 fw600 mb16 uppercase tracking-wider">Skill Rating</div>
                            <span className="badge-lg fs12" style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '4px 16px' }}>{profile.developerLevel}</span>
                        </motion.div>

                        {/* Platform Mastery */}
                        <motion.div 
                            className="glass-card stat-card p24"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="faic gap12 mb20">
                                <div className="si-g p8 rounded-xl"><CheckCircle2 size={20} className="glow-green" /></div>
                                <div className="fw800 fs16">Platform Mastery</div>
                            </div>
                            <div className="g2 gap16">
                                <div><div className="fs28 fw900 glow-green">{platformStats.solved}</div><div className="fs12 color-t3 fw600 uppercase">Solved</div></div>
                                <div><div className="fs28 fw900 color-t1">{platformStats.xp}</div><div className="fs12 color-t3 fw600 uppercase">XP</div></div>
                            </div>
                            <div className="mt20 pt16 border-t border-gray-100 fs12 color-t3">
                                Streak: <span className="glow-orange fw800">{platformStats.streak} Days</span>
                                {platformStats.total > 0 && (
                                    <span className="ml8">• <span className="fw800 color-t2">{platformStats.total}</span> tracked</span>
                                )}
                            </div>
                        </motion.div>

                        {/* LeetCode Pulse */}
                        <motion.div 
                            className="glass-card stat-card p24"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="faic gap12 mb20">
                                <div className="si-c p8 rounded-xl"><Code2 size={20} className="glow-blue" /></div>
                                <div className="fw800 fs16">LeetCode Pulse</div>
                            </div>
                            <div className="g2 gap16">
                                <div><div className="fs28 fw900 glow-blue">{profile.leetcodeTotalSolved}</div><div className="fs12 color-t3 fw600 uppercase">Total</div></div>
                                <div><div className="fs28 fw900 color-t1">#{profile.leetcodeRanking?.toLocaleString()}</div><div className="fs12 color-t3 fw600 uppercase">Rank</div></div>
                            </div>
                            <div className="mt20 pt16 border-t border-gray-100 fs12 faic jsb">
                                <span style={{ color: '#10b981' }} className="fw700">{profile.leetcodeEasySolved} E</span>
                                <span className="color-t4">·</span>
                                <span style={{ color: '#f59e0b' }} className="fw700">{profile.leetcodeMediumSolved} M</span>
                                <span className="color-t4">·</span>
                                <span style={{ color: '#ef4444' }} className="fw700">{profile.leetcodeHardSolved} H</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Analyze CTA */}
                    {!analysis && (
                        <div className="card mb32 faic gap20 p24"
                            style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))', border: '1px dashed rgba(99,102,241,0.3)' }}>
                            <div className="badge-lg" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--p)', flexShrink: 0 }}><BarChart2 size={24} /></div>
                            <div className="flex-1">
                                <div className="fs15 fw800 color-t1 mb4">Discover Your Weak Topics</div>
                                <div className="fs13 color-t3">Run the analyzer to get topic-wise breakdowns, weakness highlights, and personalized recommendations.</div>
                            </div>
                            <button className="btn btn-primary faic gap8" onClick={fetchAnalysis} disabled={analysisLoading}>
                                <TrendingUp size={15} className={analysisLoading ? 'spin' : ''} />
                                {analysisLoading ? 'Analyzing…' : 'Analyze Now'}
                            </button>
                        </div>
                    )}

                    {/* Activity + Blueprint */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                        <motion.div 
                            className="glass-card p24"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="card-hdr faic jsb mb20">
                                <div className="card-title fs16 fw800 faic gap10"><History size={20} className="glow-blue" /> Recent Activity</div>
                                <div className="fs12 color-t3 fw600 uppercase tracking-widest">Live Feed</div>
                            </div>
                            <div className="g1 gap10">
                                {platformActivities.length > 0 ? platformActivities.slice(0, 5).map((act, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="faic gap14 p12 rounded-xl border border-transparent hover-bg-gray2"
                                        whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <div className="stat-ico si-g w36 h36 rounded-xl"><Target size={16} className="glow-green" /></div>
                                        <div className="flex-1">
                                            <div className="fs14 fw700 color-t1">{act.title}</div>
                                            <div className="fs11 color-t3 uppercase tracking-wider mt1">{act.topic?.name} • {act.difficulty}</div>
                                        </div>
                                        <div className="fs11 color-t4 fw700">{act.completedAt ? new Date(act.completedAt).toLocaleDateString() : 'TODAY'}</div>
                                    </motion.div>
                                )) : (
                                    <div className="p32 text-center color-t4 fs14 italic">No recent activity found.</div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="glass-card p24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="card-hdr mb20">
                                <div className="card-title fs16 fw800 faic gap10"><TrendingUp size={20} className="glow-green" /> Preparation Blueprint</div>
                            </div>
                            <div className="g1 gap20 p8">
                                {blueprintData.map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="faic jsb mb8 fs12">
                                            <span className="fw700 color-t2 uppercase tracking-wide">{skill.label}</span>
                                            <span className="fw800 color-t1 glow-text" style={{ color: skill.color }}>{Math.round(skill.value)}%</span>
                                        </div>
                                        <div style={{ height: 10, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)' }}>
                                            <motion.div 
                                                style={{ height: '100%', background: skill.color, borderRadius: 10, boxShadow: `0 0 10px ${skill.color}44` }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.value}%` }}
                                                transition={{ duration: 1.5, delay: idx * 0.1, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* LeetCode Difficulty Breakdown - Real Chart */}
                    <div className="card mb32">
                        <div className="card-hdr mb20">
                            <div className="card-title faic gap8"><Code2 size={18} className="color-p" /> LeetCode Proficiency</div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                            <div style={{ height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={leetcodeData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {leetcodeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: 'var(--bg1)', border: '1px solid var(--b1)', borderRadius: 8 }}
                                            formatter={(value) => [value, 'Problems Solved']}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center text for Donut */}
                                <div style={{ position: 'relative', top: -175, textAlign: 'center', pointerEvents: 'none' }}>
                                    <div className="fs24 fw900 color-t1">{profile.leetcodeTotalSolved || 0}</div>
                                    <div className="fs11 color-t4">Total Solved</div>
                                </div>
                            </div>
                            <div className="faic flex-col jcc gap16">
                                {[
                                    { name: 'Easy',   count: profile.leetcodeEasySolved   || 0, color: '#10b981' },
                                    { name: 'Medium', count: profile.leetcodeMediumSolved || 0, color: '#f59e0b' },
                                    { name: 'Hard',   count: profile.leetcodeHardSolved   || 0, color: '#ef4444' },
                                ].map(d => (
                                    <div key={d.name} className="faic jsb w100 p12 rounded-lg" style={{ background: 'var(--bg2)' }}>
                                        <div className="faic gap10">
                                            <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
                                            <span className="fs14 fw600 color-t2">{d.name} Problems</span>
                                        </div>
                                        <span className="fs18 fw900 color-t1">{d.count}</span>
                                    </div>
                                ))}
                                <div className="faic jsb w100 pt12 mt8" style={{ borderTop: '2px solid var(--b1)' }}>
                                    <span className="fs14 fw700 color-t3 uppercase">Platform Total</span>
                                    <span className="fs24 fw900 color-p">{profile.leetcodeTotalSolved || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Trends */}
                    <motion.div 
                        className="glass-card p24 mb32"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="card-hdr mb24 jsb faic">
                            <div>
                                <div className="card-title fs18 fw800 faic gap10"><ArrowUpRight size={20} className="glow-orange" /> Consistency Trend</div>
                                <p className="fs13 color-t3 mt4">Your problem-solving velocity over the last 7 sessions.</p>
                            </div>
                        </div>
                        <div style={{ height: 320 }} className="p12">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gProblems" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gContribs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--t3)', fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--t3)', fontWeight: 600 }} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontSize: 12, fontWeight: 600, color: 'var(--t2)' }} />
                                    <Area type="monotone" dataKey="problems" name="Solved" stroke="var(--orange)" strokeWidth={3} fillOpacity={1} fill="url(#gProblems)" />
                                    <Area type="monotone" dataKey="contributions" name="Activity %" stroke="var(--blue)" strokeWidth={3} fillOpacity={1} fill="url(#gContribs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </>
            )}

            {/* ── Link Modal ── */}
            <AnimatePresence>
                {showLinkModal && (
                    <motion.div 
                        className="modal-overlay" 
                        onClick={() => setShowLinkModal(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="modal-content glass-card" 
                            style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }} 
                            onClick={e => e.stopPropagation()}
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                        >
                            <div className="modal-hdr p24" style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--b1)' }}>
                                <div className="modal-title fs18 fw800">Connect LeetCode</div>
                                <p className="fs13 color-t3 mt4">Link your account to see your developer insights</p>
                            </div>
                            <form onSubmit={handleLink} className="p24">
                                <div className="mb24">
                                    <label className="fs12 mb8 db fw700 uppercase tracking-wide color-t2">LeetCode Username</label>
                                    <div className="input-wrap">
                                        <Code2 size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-p" />
                                        <input type="text" className="input pl36" placeholder="e.g. hackercat"
                                            value={leetcodeUser} onChange={e => setLeetcodeUser(e.target.value)} required 
                                            style={{ background: 'var(--bg1)', border: '1px solid var(--b1)' }} />
                                    </div>
                                </div>
                                <div className="faic jse gap12">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowLinkModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px24" disabled={syncing}>
                                        {syncing ? 'Connecting…' : 'Sync Profile'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DevInsightsPage;
