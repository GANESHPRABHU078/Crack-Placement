import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { practiceService } from '../api/practiceService';
import { mockInterviewService } from '../api/mockInterviewService';
import { motion } from 'framer-motion';
import {
  Zap, CheckCircle2, Target, TrendingUp,
  Clock, ArrowUpRight, Code2,
  BookOpen, Cpu, ChevronRight
} from 'lucide-react';
import Heatmap from '../components/Heatmap';

const clampPercent = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const progressTone = (pct) => (pct > 50 ? 'pg' : (pct > 20 ? 'po' : 'pp'));

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }
};

const Dashboard = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [solvedCount, setSolvedCount] = React.useState(0);
  const [heatmapData, setHeatmapData] = React.useState({});
  const [activities, setActivities] = React.useState([]);
  const [preparationProgress, setPreparationProgress] = React.useState([]);
  const [todayFocus, setTodayFocus] = React.useState([]);
  const [profile, setProfile] = React.useState(user);

  React.useEffect(() => {
    const loadLatestProfile = async () => {
      try {
        const latest = await refreshProfile();
        setProfile(latest);
      } catch (error) {
        setProfile(user);
      }
    };

    const loadSolvedCount = async () => {
      try {
        const progress = await practiceService.getProgress();
        setSolvedCount(progress.completedCount || 0);
      } catch (error) {
        setSolvedCount(user?.problemsSolved || 0);
      }
    };

    const loadHeatmapData = async () => {
      try {
        const data = await practiceService.getHeatmapData();
        setHeatmapData(data);
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      }
    };

    const loadRecentActivity = async () => {
      try {
        const data = await practiceService.getRecentActivity();
        setActivities(data.map(a => ({
          label: a.title,
          tag: a.topic.name,
          diff: a.difficulty,
          time: a.completedAt ? new Date(a.completedAt).toLocaleDateString() : 'Recently',
          icon: Code2,
          color: a.difficulty === 'Easy' ? 'var(--easy)' : (a.difficulty === 'Medium' ? 'var(--med)' : 'var(--hard)')
        })));
      } catch (error) {
        console.error('Failed to load record activities:', error);
      }
    };

    const loadPreparationInsights = async () => {
      try {
        const insights = await practiceService.getInsights();
        const topicInsights = Array.isArray(insights?.topicInsights) ? insights.topicInsights : [];
        const normalized = topicInsights
          .map((t) => {
            const pct = clampPercent(t.completionRate);
            return {
              label: t.name || 'Topic',
              pct,
              cls: progressTone(pct)
            };
          })
          .slice(0, 3);
        setPreparationProgress(normalized);
      } catch (error) {
        console.error('Failed to load insights:', error);
      }
    };

    const loadMockInterviews = async () => {
        try {
          const sessions = await mockInterviewService.getMyInterviews();
          const upcoming = sessions.filter(s => s.status === 'Scheduled').slice(0, 3);
          setTodayFocus(upcoming.map(s => ({
            time: new Date(s.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label: s.topic,
            status: '',
            color: 'var(--orange)'
          })));
        } catch (error) {
            console.error('Failed to load mock interviews:', error);
        }
    };

    loadLatestProfile();
    loadSolvedCount();
    loadHeatmapData();
    loadRecentActivity();
    loadPreparationInsights();
    loadMockInterviews();
  }, [refreshProfile, user]);

  React.useEffect(() => {
    const handleProgressUpdated = (event) => {
      if (typeof event.detail?.completedCount === 'number') {
        setSolvedCount(event.detail.completedCount);
      }
    };

    window.addEventListener('practiceProgressUpdated', handleProgressUpdated);
    return () => window.removeEventListener('practiceProgressUpdated', handleProgressUpdated);
  }, []);

  if (!user) return null;

  const currentUser = profile || user;
  const solvedValue = solvedCount || currentUser?.problemsSolved || 0;
  const streakValue = currentUser?.currentStreak || 0;
  const xpValue = currentUser?.xp || 0;
  const levelValue = currentUser?.level || 1;
  const leagueValue = currentUser?.league || 'Starter';
  const rankValue = currentUser?.globalRank ? `#${currentUser.globalRank}` : '#---';
  const preparationItems = preparationProgress.length > 0 ? preparationProgress : [
    { label: 'Practice Progress', pct: solvedValue > 0 ? clampPercent(solvedValue * 10) : 0, cls: progressTone(solvedValue * 10) },
    { label: 'Aptitude Practice', pct: 0, cls: 'pg' },
    { label: 'System Design', pct: 0, cls: 'pp' },
  ];

  const stats = [
    { cls: 'c', Icon: Zap, val: streakValue, lbl: 'Day Streak', delta: '+1 today', deltaUp: true },
    { cls: 'g', Icon: CheckCircle2, val: solvedValue, lbl: 'Solved', delta: `Top 15% in ${currentUser?.college || 'your college'}`, deltaUp: true },
    { cls: 'a', Icon: Target, val: xpValue, lbl: 'Platform XP', delta: `Lv.${levelValue} · ${leagueValue}` },
    { cls: 'p', Icon: TrendingUp, val: rankValue, lbl: 'Global Rank', delta: 'All universities' },
  ];

  const weekData = [40, 70, 45, 90, 65, 30, 50];
  const maxH = Math.max(...weekData);

  return (
    <div className="app-page on" style={{ position: 'relative', padding: '28px 28px 40px' }}>
      <div style={{ position: 'fixed', top: 60, left: 220, width: 400, height: 400, background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 100, right: 80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1180 }}>
        <div className="section-hdr mb32">
          <div>
            <p style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Welcome back, <span style={{ color: 'var(--orange)' }}>{user.firstName}</span>!
            </h1>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 5 }}>Keep your streak alive and your solved count moving.</p>
            <p style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>
              Daily check-in now happens automatically when you log in.
            </p>
          </div>
        </div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="g4 mb28">
          {stats.map(({ cls, Icon, val, lbl, delta, deltaUp }) => (
            <motion.div key={cls} variants={itemVars} className={`stat-card ${cls}`}>
              <div className={`stat-ico si-${cls}`}><Icon size={17} /></div>
              <div className="stat-num">{val}</div>
              <div className="stat-lbl">{lbl}</div>
              <div className="stat-delta" style={{ color: deltaUp ? 'var(--easy)' : 'var(--t3)' }}>{delta}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="g7030">
          <motion.div variants={itemVars} className="card">
            <div className="card-hdr">
              <div>
                <div className="card-title">Preparation Progress</div>
                <div className="card-sub">Journey towards {user.primaryGoal || 'SDE Role'}</div>
              </div>
              <ArrowUpRight size={16} style={{ color: 'var(--t3)' }} />
            </div>

            {preparationItems.map(({ label, pct, cls }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--t2)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{pct}%</span>
                </div>
                <div className="ptrack h6" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className={`pfill ${cls}`} style={{ width: `${pct}%`, transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--b1)', paddingTop: 24, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div className="card-title">Weekly Activity</div>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{solvedCount} problems completed</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
                {weekData.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', position: 'relative', height: `${(h / maxH) * 72}px`, borderRadius: 4, background: 'var(--bg5)', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', bottom: 0, inset: 0, background: 'var(--orange)', opacity: h === maxH ? 1 : 0.45, borderRadius: 4 }}></div>
                    </div>
                    <span style={{ fontSize: 10, color: i === 3 ? 'var(--orange)' : 'var(--t4)' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVars} style={{ gridColumn: '1 / -1' }}>
            <Heatmap data={heatmapData} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div variants={itemVars} className="card">
              <div className="card-hdr">
                <div className="card-title">Today's Focus</div>
                <Clock size={15} style={{ color: 'var(--t3)' }} />
              </div>

              {todayFocus.length > 0 ? todayFocus.map(({ time, label, status, color }) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', marginBottom: 6, borderRadius: 10, background: status === 'next' ? 'rgba(249,115,22,0.06)' : 'transparent', border: `1px solid ${status === 'next' ? 'rgba(249,115,22,0.15)' : 'transparent'}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: status === 'next' ? 'var(--orange-glow-sm)' : 'none', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--t3)', width: 46 }}>{time}</span>
                  <span style={{ fontSize: 13, fontWeight: status === 'next' ? 700 : 500, color: status === 'next' ? 'var(--t1)' : 'var(--t2)', flex: 1 }}>{label}</span>
                  {status === 'next' && <span style={{ fontSize: 9, background: 'var(--orange)', color: '#000', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>NEXT</span>}
                </div>
              )) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--t4)', fontSize: 12 }}>No upcoming sessions for today.</div>
              )}

              <button 
                className="btn btn-ghost fw mt8 btn-sm" 
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                onClick={() => navigate('/mock-interviews')}
              >
                View Workspace <ChevronRight size={12} />
              </button>
            </motion.div>

            <motion.div variants={itemVars} className="card">
              <div className="card-hdr">
                <div className="card-title">Recent Activity</div>
                <span 
                  style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => navigate('/practice')}
                >
                  All →
                </span>
              </div>
              {activities.map(({ label, tag, diff, time, icon: Icon, color }) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--b1)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{tag}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color, fontWeight: 700 }}>{diff}</div>
                    <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 2 }}>{time}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
