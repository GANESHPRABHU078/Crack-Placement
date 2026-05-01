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
                    <RefreshCcw size={32} className="spin mb16 color-p" />
                    <div className="fs16 fw600 color-t1">Gathering Insights...</div>
                    <div className="fs13 color-t3 mt8">This may take a moment while we sync with LeetCode.</div>
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
        <div className="p28">
            {/* ── Header ── */}
            <div className="faic jsb mb24">
                <div>
                    <h1 className="section-title">Developer Dashboard</h1>
                    <p className="section-sub">Track your LeetCode progress and identify weak areas to improve faster.</p>
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
                    <button className={`btn ${syncing ? 'btn-ghost' : 'btn-primary'} faic gap8`} onClick={handleSync} disabled={syncing}>
                        <RefreshCcw size={15} className={syncing ? 'spin' : ''} />
                        {syncing ? 'Syncing…' : 'Refresh'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setShowLinkModal(true)}>Update Profile</button>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb32">
                        {[
                            { label: 'Weak Topics',      count: analysis.weakTopics?.length   || 0, color: '#ef4444', badge: 'Need Practice' },
                            { label: 'Improving Topics', count: analysis.mediumTopics?.length || 0, color: '#f59e0b', badge: 'In Progress'    },
                            { label: 'Strong Topics',    count: analysis.strongTopics?.length || 0, color: '#10b981', badge: 'Mastered'       },
                        ].map(s => (
                            <div key={s.label} className="card text-center"
                                style={{ background: `linear-gradient(135deg,${s.color}12,${s.color}04)` }}>
                                <div className="fs32 fw900" style={{ color: s.color }}>{s.count}</div>
                                <div className="fs13 color-t3 mt4">{s.label}</div>
                                <div className="badge mt12" style={{ background: `${s.color}22`, color: s.color, border: 'none' }}>{s.badge}</div>
                            </div>
                        ))}
                    </div>

                    {/* Topic Bar Chart */}
                    <div className="card mb32">
                        <div className="card-hdr mb20">
                            <div className="card-title faic gap8"><BarChart2 size={18} className="color-p" /> Topic-wise Strength Analysis</div>
                            <div className="faic gap16 mt12">
                                {Object.entries(STRENGTH_COLORS).map(([s, c]) => (
                                    <div key={s} className="faic gap6 fs12 color-t2">
                                        <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} /> {s}
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
                    </div>

                    {/* Weak Highlights + Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                        <div className="card">
                            <div className="card-hdr mb16">
                                <div className="card-title faic gap8">
                                    <AlertTriangle size={16} style={{ color: '#ef4444' }} /> Weak Areas — Action Required
                                </div>
                            </div>
                            <div className="g1 gap10">
                                {(analysis.weakTopics || []).slice(0, 8).map((topic, i) => {
                                    const t = analysis.topics?.find(x => x.topic === topic);
                                    return (
                                        <div key={i} className="faic jsb p12 rounded-lg"
                                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <div>
                                                <div className="fs13 fw700 color-t1">{topic}</div>
                                                <div className="fs11 color-t4">{t?.solved || 0} / {t?.expected || 0} problems solved</div>
                                            </div>
                                            <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', fontSize: 11 }}>Weak</span>
                                        </div>
                                    );
                                })}
                                {!(analysis.weakTopics?.length) && (
                                    <div className="p20 text-center color-t4 fs13">No weak topics! You are well-rounded.</div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-hdr mb16">
                                <div className="card-title faic gap8"><Zap size={16} className="color-orange" /> AI-Generated Insights</div>
                            </div>
                            <div className="g1 gap10 p4">
                                {(analysis.insights || []).map((msg, i) => {
                                    const isStrong = msg.includes('strong');
                                    const isWeak = msg.includes('improvement') || msg.includes('Easy');
                                    const color = isStrong ? '#10b981' : isWeak ? '#ef4444' : '#6366f1';
                                    const bg = isStrong ? 'rgba(16,185,129,0.07)' : isWeak ? 'rgba(239,68,68,0.07)' : 'rgba(99,102,241,0.07)';
                                    return (
                                        <div key={i} className="p14 rounded-lg faic gap12"
                                            style={{ background: bg, border: `1px solid ${color}22` }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                            <span className="fs13 color-t1">{msg}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Difficulty bars */}
                            <div className="mt20 pt16" style={{ borderTop: '1px solid var(--b1)' }}>
                                <div className="fs12 fw700 color-t2 mb12">Difficulty Distribution</div>
                                {[
                                    { label: 'Easy',   count: analysis.difficultyBreakdown?.easy   || 0, color: '#10b981' },
                                    { label: 'Medium', count: analysis.difficultyBreakdown?.medium || 0, color: '#f59e0b' },
                                    { label: 'Hard',   count: analysis.difficultyBreakdown?.hard   || 0, color: '#ef4444' },
                                ].map(d => {
                                    const total = analysis.difficultyBreakdown?.total || 1;
                                    const pct = Math.round((d.count / total) * 100);
                                    return (
                                        <div key={d.label} className="mb10">
                                            <div className="faic jsb mb4 fs12">
                                                <span className="fw600 color-t2">{d.label}</span>
                                                <span className="color-t3">{d.count} ({pct}%)</span>
                                            </div>
                                            <div style={{ height: 7, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 10, transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {(analysis.recommendations || []).length > 0 && (
                        <div className="card mb32">
                            <div className="card-hdr mb20">
                                <div className="card-title faic gap8"><BookOpen size={16} className="color-blue" /> Recommendations — Improve Now</div>
                                <p className="fs12 color-t3 mt4">Practice problems curated for your weak areas</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                                {analysis.recommendations.map((rec, i) => (
                                    <div key={i} className="p16 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--b1)' }}>
                                        <div className="faic gap8 mb12">
                                            <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', fontSize: 11 }}>Weak</span>
                                            <span className="fs13 fw700 color-t1">{rec.topic}</span>
                                        </div>
                                        <div className="faic gap8">
                                            <a href={rec.leetcode} target="_blank" rel="noopener noreferrer"
                                               className="btn btn-primary faic gap6"
                                               style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 12px' }}>
                                                <Code2 size={13} /> LeetCode <ExternalLink size={11} />
                                            </a>
                                            <a href={rec.gfg} target="_blank" rel="noopener noreferrer"
                                               className="btn btn-outline faic gap6"
                                               style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 12px' }}>
                                                <BookOpen size={13} /> GFG <ExternalLink size={11} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full Topic Table */}
                    <div className="card mb32">
                        <div className="card-hdr mb16">
                            <div className="card-title faic gap8"><Target size={16} className="color-t2" /> Complete Topic Breakdown</div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--b1)' }}>
                                        {['Topic', 'Solved', 'Expected', 'Progress', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(analysis.topics || []).map((t, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--b1)' }}>
                                            <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{t.topic}</td>
                                            <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--t2)' }}>{t.solved}</td>
                                            <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--t3)' }}>{t.expected}+</td>
                                            <td style={{ padding: '10px 12px', minWidth: 120 }}>
                                                <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${t.percentage}%`, background: STRENGTH_COLORS[t.strength], borderRadius: 10 }} />
                                                </div>
                                                <span style={{ fontSize: 10, color: 'var(--t4)' }}>{t.percentage}%</span>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span className="badge" style={{ background: STRENGTH_BG[t.strength], color: STRENGTH_COLORS[t.strength], border: 'none', fontSize: 11 }}>
                                                    {t.strength}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            /* ── Overview Tab ── */
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb32">
                        {/* Dev Score */}
                        <div className="card text-center" style={{ background: 'linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%)' }}>
                            <div className="faic jcc mb12">
                                <div className="badge-lg" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)' }}><Zap size={24} /></div>
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1)' }}>{profile.developerScore}</div>
                            <div className="color-t3 fs12 mb16">Developer Score</div>
                            <span className="badge" style={{ background: 'var(--orange)', color: '#fff', border: 'none' }}>{profile.developerLevel}</span>
                        </div>

                        {/* Platform Mastery */}
                        <div className="card">
                            <div className="faic gap12 mb16">
                                <div className="si-g p6 rounded-lg"><CheckCircle2 size={18} /></div>
                                <div className="fw800">Platform Mastery</div>
                            </div>
                            <div className="g2">
                                <div><div className="fs20 fw800">{platformStats.solved}</div><div className="fs12 color-t3">Problems</div></div>
                                <div><div className="fs20 fw800">{platformStats.xp}</div><div className="fs12 color-t3">XP Gained</div></div>
                            </div>
                            <div className="mt12 pt12 border-t border-gray-100 fs11 color-t3">
                                Streak: <span className="color-orange fw700">{platformStats.streak} Days</span>
                                {platformStats.total > 0 && (
                                    <span className="ml8">• <span className="fw700 color-t2">{platformStats.total}</span> total tracked</span>
                                )}
                            </div>
                        </div>

                        {/* LeetCode Pulse */}
                        <div className="card">
                            <div className="faic gap12 mb16">
                                <div className="si-c p6 rounded-lg"><Code2 size={18} /></div>
                                <div className="fw800">LeetCode Pulse</div>
                            </div>
                            <div className="g2">
                                <div><div className="fs20 fw800">{profile.leetcodeTotalSolved}</div><div className="fs12 color-t3">Total Solved</div></div>
                                <div><div className="fs20 fw800">#{profile.leetcodeRanking?.toLocaleString()}</div><div className="fs12 color-t3">Rank</div></div>
                            </div>
                            <div className="mt12 pt12 border-t border-gray-100 fs11">
                                <span style={{ color: '#10b981' }} className="fw600">{profile.leetcodeEasySolved} Easy</span>
                                <span className="color-t4 mx8">·</span>
                                <span style={{ color: '#f59e0b' }} className="fw600">{profile.leetcodeMediumSolved} Med</span>
                                <span className="color-t4 mx8">·</span>
                                <span style={{ color: '#ef4444' }} className="fw600">{profile.leetcodeHardSolved} Hard</span>
                            </div>
                        </div>
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
                        <div className="card">
                            <div className="card-hdr faic jsb mb16">
                                <div className="card-title faic gap8"><History size={18} className="color-blue" /> Recent Platform Activity</div>
                            </div>
                            <div className="p6">
                                {platformActivities.length > 0 ? platformActivities.slice(0, 5).map((act, i) => (
                                    <div key={i} className="faic gap12 p10 hover-bg-gray2 rounded-lg border-b border-gray-100 last:border-0">
                                        <div className="stat-ico si-g w32 h32"><Target size={14} /></div>
                                        <div className="flex-1">
                                            <div className="fs13 fw700 color-t1">{act.title}</div>
                                            <div className="fs11 color-t3">{act.topic?.name} - {act.difficulty}</div>
                                        </div>
                                        <div className="fs11 color-t4">{act.completedAt ? new Date(act.completedAt).toLocaleDateString() : 'Today'}</div>
                                    </div>
                                )) : (
                                    <div className="p20 text-center color-t4 fs13">No recent platform activity. Start practicing!</div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-hdr mb16">
                                <div className="card-title faic gap8"><TrendingUp size={18} className="color-emerald" /> Preparation Blueprint</div>
                            </div>
                            <div className="g1 gap16 p12">
                                {blueprintData.map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="faic jsb mb6 fs12">
                                            <span className="fw600 color-t2">{skill.label}</span>
                                            <span className="fw800 color-t1">{Math.round(skill.value)}%</span>
                                        </div>
                                        <div style={{ height: 8, background: 'var(--bg4)', borderRadius: 10, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${skill.value}%`, background: skill.color, borderRadius: 10, transition: 'width 1s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                    <div className="card mb32">
                        <div className="card-hdr">
                            <div className="card-title faic gap8"><ArrowUpRight size={18} className="color-blue" /> Weekly Consistency Trends</div>
                        </div>
                        <div style={{ height: 280 }} className="p20">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="gProblems" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gContribs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--b1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t3)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t3)' }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg1)', border: '1px solid var(--b1)', borderRadius: 8 }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="problems" name="Problems Solved" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#gProblems)" />
                                    <Area type="monotone" dataKey="contributions" name="Platform Activity" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gContribs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* ── Link Modal ── */}
            {showLinkModal && (
                <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
                    <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-hdr">
                            <div className="modal-title">Link Your LeetCode Profile</div>
                            <p className="fs13 color-t3 mt4">Connect your LeetCode account for full topic analytics</p>
                        </div>
                        <form onSubmit={handleLink} className="p24">
                            <div className="mb24">
                                <label className="fs13 mb8 db fw600">LeetCode Username</label>
                                <div className="input-wrap">
                                    <Code2 size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-t3" />
                                    <input type="text" className="input pl36" placeholder="e.g. luser123"
                                        value={leetcodeUser} onChange={e => setLeetcodeUser(e.target.value)} required />
                                </div>
                            </div>
                            <div className="faic jse gap12">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowLinkModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={syncing}>
                                    {syncing ? 'Connecting…' : 'Connect & Sync'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevInsightsPage;
