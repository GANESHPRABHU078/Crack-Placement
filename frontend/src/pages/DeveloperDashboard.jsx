import React, { useState, useEffect } from 'react';
import { 
  GitBranch as GithubIcon, 
  Code2, 
  ExternalLink, 
  RefreshCcw, 
  Trophy, 
  Star, 
  GitBranch, 
  Users, 
  ArrowUpRight,
  Shield,
  Zap,
  Layout,
  Target,
  Award,
  TrendingUp,
  History,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { developerService } from '../api/developerService';
import { practiceService } from '../api/practiceService';
import { useAuth } from '../context/AuthContext';

const DevInsightsPage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [githubUser, setGithubUser] = useState('');
    const [leetcodeUser, setLeetcodeUser] = useState('');
    const [platformStats, setPlatformStats] = useState({ solved: 0, xp: 0, streak: 0, level: 1 });
    const [platformActivities, setPlatformActivities] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
            fetchPlatformData();
        }
    }, [user]);

    const fetchPlatformData = async () => {
        try {
            const [progress, recent] = await Promise.all([
                practiceService.getInsights(),
                practiceService.getRecentActivity()
            ]);
            setPlatformStats({
                solved: user?.problemsSolved || 0,
                xp: user?.xp || 0,
                streak: user?.currentStreak || 0,
                level: user?.level || 1
            });
            setPlatformActivities(recent || []);
        } catch (error) {
            console.error('Failed to fetch platform data', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const data = await developerService.getProfile(user.id);
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            if (error.response?.status === 404) setShowLinkModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const data = await developerService.syncProfile(user.id);
            setProfile(data);
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setSyncing(false);
        }
    };

    const handleLink = async (e) => {
        e.preventDefault();
        setSyncing(true);
        try {
            const data = await developerService.linkProfile(user.id, githubUser, leetcodeUser);
            setProfile(data);
            setShowLinkModal(false);
        } catch (error) {
            console.error('Linking failed', error);
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return <div className="p24 color-t2">Loading developer insights...</div>;

    const leetcodeData = profile ? [
        { name: 'Easy', value: profile.leetcodeEasySolved, color: '#00b8a3' },
        { name: 'Medium', value: profile.leetcodeMediumSolved, color: '#ffc01e' },
        { name: 'Hard', value: profile.leetcodeHardSolved, color: '#ef4743' },
    ] : [];

    const githubLangs = profile?.githubLanguages ? JSON.parse(profile.githubLanguages) : {};
    const langData = Object.entries(githubLangs).map(([name, value]) => ({ name, value }));

    // Mock data for heatmap and progress chart (since real history requires many API calls)
    const today = new Date();
    const heatmapValues = Array.from({ length: 90 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return {
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 5)
        };
    });

    const progressData = Array.from({ length: 7 }, (_, i) => ({
        name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        problems: Math.floor(Math.random() * 10) + 5,
        contributions: Math.floor(Math.random() * 15) + 2
    }));

    return (
        <div className="p28">
            <div className="faic jsb mb24">
                <div>
                    <h1 className="section-title">Developer Dashboard</h1>
                    <p className="section-sub">Unified insights from your Platform, GitHub and LeetCode activity.</p>
                </div>
                <div className="faic gap12">
                    <button 
                        className={`btn ${syncing ? 'btn-ghost' : 'btn-primary'} faic gap8`} 
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        <RefreshCcw size={16} className={syncing ? 'spin' : ''} />
                        {syncing ? 'Syncing...' : 'Refresh Data'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setShowLinkModal(true)}>
                        Update Profiles
                    </button>
                </div>
            </div>

            {profile ? (
                <>
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb32">
                        <div className="card text-center" style={{ background: 'linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%)' }}>
                            <div className="faic jcc mb12">
                                <div className="badge-lg" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)' }}>
                                    <Zap size={24} />
                                </div>
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1)' }}>{profile.developerScore}</div>
                            <div className="color-t3 fs12 mb16">Developer Score</div>
                            <div className="faic jcc">
                                <span className="badge" style={{ background: 'var(--orange)', color: '#fff', border: 'none' }}>
                                    {profile.developerLevel}
                                </span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="faic gap12 mb16">
                                <div className="si-g p6 rounded-lg"><CheckCircle2 size={18} /></div>
                                <div className="fw800">Platform Mastery</div>
                            </div>
                            <div className="g2">
                                <div>
                                    <div className="fs20 fw800">{platformStats.solved}</div>
                                    <div className="fs12 color-t3">Problems</div>
                                </div>
                                <div>
                                    <div className="fs20 fw800">{platformStats.xp}</div>
                                    <div className="fs12 color-t3">XP Gained</div>
                                </div>
                            </div>
                            <div className="mt12 pt12 border-t border-gray-100 fs11 color-t3">
                                Current Streak: <span className="color-orange fw700">{platformStats.streak} Days</span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="faic gap12 mb16">
                                <div className="si-b p6 rounded-lg"><GithubIcon size={18} /></div>
                                <div className="fw800">GitHub Pulse</div>
                            </div>
                            <div className="g2">
                                <div>
                                    <div className="fs20 fw800">{profile.githubRepos}</div>
                                    <div className="fs12 color-t3">Repositories</div>
                                </div>
                                <div>
                                    <div className="fs20 fw800">{profile.githubStars}</div>
                                    <div className="fs12 color-t3">Stars</div>
                                </div>
                            </div>
                            <div className="mt12 pt12 border-t border-gray-100 fs11 color-t3">
                                Followers: <span className="color-blue fw700">{profile.githubFollowers}</span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="faic gap12 mb16">
                                <div className="si-c p6 rounded-lg"><Code2 size={18} /></div>
                                <div className="fw800">LeetCode Pulse</div>
                            </div>
                            <div className="g2">
                                <div>
                                    <div className="fs20 fw800">{profile.leetcodeTotalSolved}</div>
                                    <div className="fs12 color-t3">Solved</div>
                                </div>
                                <div>
                                    <div className="fs20 fw800">#{profile.leetcodeRanking?.toLocaleString()}</div>
                                    <div className="fs12 color-t3">Rank</div>
                                </div>
                            </div>
                            <div className="mt12 pt12 border-t border-gray-100 fs11 color-t3">
                                Level: <span className="text-emerald-500 fw700">Competitor</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Insights & Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                        <div className="card">
                            <div className="card-hdr faic jsb mb16">
                                <div className="card-title faic gap8">
                                    <History size={18} className="color-blue" />
                                    Recent Platform Activity
                                </div>
                                <div className="fs11 color-t3">Submissions</div>
                            </div>
                            <div className="p6">
                                {platformActivities.length > 0 ? platformActivities.slice(0, 5).map((act, i) => (
                                    <div key={i} className="faic gap12 p10 hover-bg-gray2 rounded-lg transition-all border-b border-gray-100 last:border-0">
                                        <div className="stat-ico si-g w32 h32"><Target size={14} /></div>
                                        <div className="flex-1">
                                            <div className="fs13 fw700 color-t1">{act.title}</div>
                                            <div className="fs11 color-t3">{act.topic?.name} - {act.difficulty}</div>
                                        </div>
                                        <div className="fs11 color-t4">{act.completedAt ? new Date(act.completedAt).toLocaleDateString() : 'Today'}</div>
                                    </div>
                                )) : (
                                    <div className="p20 text-center color-t4 fs13">No recent platform activity found.</div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-hdr mb16">
                                <div className="card-title faic gap8">
                                    <TrendingUp size={18} className="color-emerald" />
                                    Preparation Blueprint
                                </div>
                            </div>
                            <div className="g1 gap16 p12">
                                {[
                                    { label: 'DSA Mastery', value: platformStats.solved > 50 ? 85 : 40, color: 'var(--blue)' },
                                    { label: 'System Design', value: 30, color: 'var(--p)' },
                                    { label: 'Aptitude Ready', value: 65, color: 'var(--orange)' },
                                    { label: 'Project Impact', value: profile.githubRepos > 5 ? 90 : 20, color: 'var(--hard)' }
                                ].map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="faic jsb mb6 fs12">
                                            <span className="fw600 color-t2">{skill.label}</span>
                                            <span className="fw800 color-t1">{skill.value}%</span>
                                        </div>
                                        <div className="ptrack h8 shadow-inner" style={{ background: 'var(--bg4)', borderRadius: 10 }}>
                                            <div className="pfill transition-all duration-1000 ease-out" style={{ width: `${skill.value}%`, backgroundColor: skill.color, borderRadius: 10 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb32">
                        <div className="card">
                            <div className="card-hdr">
                                <div className="card-title">LeetCode Difficulty Breakdown</div>
                            </div>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={leetcodeData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {leetcodeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="faic jcc gap20 mt16">
                                {leetcodeData.map(d => (
                                    <div key={d.name} className="faic gap8 fs12 color-t2">
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }}></div>
                                        {d.name}: {d.value}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-hdr">
                                <div className="card-title">Project Languages (GitHub)</div>
                            </div>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={langData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="var(--blue)" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Activity & Trends */}
                    <div className="card mb32">
                        <div className="card-hdr faic jsb">
                            <div className="card-title faic gap8">
                                <Star size={18} className="color-orange" />
                                GitHub Activity (Mocked)
                            </div>
                            <div className="fs12 color-t3">Last 90 Days</div>
                        </div>
                        <div className="p20" style={{ minHeight: 180 }}>
                            <CalendarHeatmap
                                startDate={new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)}
                                endDate={today}
                                values={heatmapValues}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return 'color-empty';
                                    return `color-scale-${Math.min(value.count, 4)}`;
                                }}
                            />
                        </div>
                    </div>

                    <div className="card mb32">
                        <div className="card-hdr">
                            <div className="card-title faic gap8">
                                <ArrowUpRight size={18} className="color-blue" />
                                Weekly Consistency Trends
                            </div>
                        </div>
                        <div style={{ height: 300 }} className="p20">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={progressData}>
                                    <defs>
                                        <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorContribs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--b1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t3)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--t3)' }} />
                                    <Tooltip 
                                        contentStyle={{ background: 'var(--bg1)', border: '1px solid var(--b1)', borderRadius: 8 }}
                                    />
                                    <Area type="monotone" dataKey="problems" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorProblems)" />
                                    <Area type="monotone" dataKey="contributions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorContribs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card text-center p40 mb32">
                    <Layout size={48} className="mb16 color-t3 mx-auto" />
                    <h3>No Profile Linked</h3>
                    <p className="color-t3 mb24">Connect your GitHub and LeetCode to see your developer insights.</p>
                    <button className="btn btn-primary" onClick={() => setShowLinkModal(true)}>Connect Profiles</button>
                </div>
            )}

            {/* Link Modal */}
            {showLinkModal && (
                <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
                    <div className="modal-content" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-hdr">
                            <div className="modal-title">Link Your Coding Profiles</div>
                        </div>
                        <form onSubmit={handleLink} className="p24">
                            <div className="mb20">
                                <label className="fs13 mb8 db fw600">GitHub Username</label>
                                <div className="input-wrap">
                                    <GithubIcon size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-t3" />
                                    <input 
                                        type="text" 
                                        className="input pl36" 
                                        placeholder="e.g. torvalds"
                                        value={githubUser}
                                        onChange={e => setGithubUser(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb24">
                                <label className="fs13 mb8 db fw600">LeetCode Username</label>
                                <div className="input-wrap">
                                    <Code2 size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-t3" />
                                    <input 
                                        type="text" 
                                        className="input pl36" 
                                        placeholder="e.g. luser123"
                                        value={leetcodeUser}
                                        onChange={e => setLeetcodeUser(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="faic jse gap12">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowLinkModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={syncing}>
                                    {syncing ? 'Syncing...' : 'Link & Sync'}
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
