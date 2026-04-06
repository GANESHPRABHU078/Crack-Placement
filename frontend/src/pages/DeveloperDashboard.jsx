import React, { useState, useEffect } from 'react';
import { 
  Github, 
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
  Layout
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
import { useAuth } from '../context/AuthContext';

const DeveloperDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [githubUser, setGithubUser] = useState('');
    const [leetcodeUser, setLeetcodeUser] = useState('');

    useEffect(() => {
        if (user?.id) fetchProfile();
    }, [user]);

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
                    <p className="section-sub">Unified insights from your GitHub and LeetCode activity.</p>
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
                <div className="g3 mb32">
                    {/* Score Card */}
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

                    {/* GitHub Quick Stats */}
                    <div className="card">
                        <div className="faic gap12 mb16">
                            <Github size={20} className="color-t2" />
                            <div className="fw800">GitHub Pulse</div>
                        </div>
                        <div className="g2">
                            <div>
                                <div className="fs20 fw800">{profile.githubRepos}</div>
                                <div className="fs12 color-t3">Repositories</div>
                            </div>
                            <div>
                                <div className="fs20 fw800">{profile.githubStars}</div>
                                <div className="fs12 color-t3">Total Stars</div>
                            </div>
                        </div>
                    </div>

                    {/* LeetCode Quick Stats */}
                    <div className="card">
                        <div className="faic gap12 mb16">
                            <Code2 size={20} className="color-t2" />
                            <div className="fw800">LeetCode Progress</div>
                        </div>
                        <div className="g2">
                            <div>
                                <div className="fs20 fw800">{profile.leetcodeTotalSolved}</div>
                                <div className="fs12 color-t3">Solved</div>
                            </div>
                            <div>
                                <div className="fs20 fw800">#{profile.leetcodeRanking?.toLocaleString()}</div>
                                <div className="fs12 color-t3">Global Rank</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card text-center p40 mb32">
                    <Layout size={48} className="mb16 color-t3 mx-auto" />
                    <h3>No Profile Linked</h3>
                    <p className="color-t3 mb24">Connect your GitHub and LeetCode to see your developer insights.</p>
                    <button className="btn btn-primary" onClick={() => setShowLinkModal(true)}>Connect Profiles</button>
                </div>
            )}

            )}

            {profile && (
                <>
                    {/* Activity Heatmap */}
                    <div className="card mt32">
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

                    {/* Performance Trends */}
                    <div className="card mt24">
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
                                    <Github size={16} style={{ position: 'absolute', left: 12, top: 12 }} className="color-t3" />
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

export default DeveloperDashboard;
