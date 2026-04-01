import React from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../api/profileService';
import { practiceService } from '../api/practiceService';
import { motion } from 'framer-motion';
import {
  Zap, CheckCircle2, Target, TrendingUp,
  Calendar, Clock, ArrowUpRight, Code2,
  BookOpen, Cpu, ChevronRight
} from 'lucide-react';

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
  const [solvedCount, setSolvedCount] = React.useState(0);
  const [checkInLoading, setCheckInLoading] = React.useState(false);
  const [checkInMessage, setCheckInMessage] = React.useState('');

  React.useEffect(() => {
    const loadSolvedCount = async () => {
      try {
        const progress = await practiceService.getProgress();
        setSolvedCount(progress.completedCount || 0);
      } catch (error) {
        setSolvedCount(user?.problemsSolved || 0);
      }
    };

    loadSolvedCount();
  }, [user?.problemsSolved]);

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

  const handleDailyCheckIn = async () => {
    setCheckInLoading(true);
    setCheckInMessage('');
    try {
      const response = await profileService.dailyCheckIn();
      await refreshProfile();
      setCheckInMessage(response.alreadyCheckedIn ? 'Already checked in today.' : 'Daily check-in saved.');
    } catch (error) {
      setCheckInMessage('Daily check-in failed. Please try again.');
    } finally {
      setCheckInLoading(false);
    }
  };

  const stats = [
    { cls: 'c', Icon: Zap, val: user.currentStreak, lbl: 'Day Streak', delta: '+1 today', deltaUp: true },
    { cls: 'g', Icon: CheckCircle2, val: solvedCount || user.problemsSolved, lbl: 'Solved', delta: `Top 15% in ${user.college || 'your college'}`, deltaUp: true },
    { cls: 'a', Icon: Target, val: user.xp, lbl: 'Platform XP', delta: `Lv.${user.level} · ${user.league}` },
    { cls: 'p', Icon: TrendingUp, val: `#${user.globalRank || '---'}`, lbl: 'Global Rank', delta: 'All universities' },
  ];

  const activities = [
    { label: 'Binary Search', tag: 'Arrays', diff: 'Easy', time: '2h ago', icon: Code2, color: 'var(--easy)' },
    { label: 'LRU Cache', tag: 'Design', diff: 'Medium', time: '1d ago', icon: Cpu, color: 'var(--med)' },
    { label: 'Serialize Tree', tag: 'Trees', diff: 'Hard', time: '2d ago', icon: BookOpen, color: 'var(--hard)' },
  ];

  const weekData = [40, 70, 45, 90, 65, 30, 50];
  const maxH = Math.max(...weekData);

  return (
    <div className="app-page on" style={{ position: 'relative', overflow: 'hidden', padding: '28px 28px 40px' }}>
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
            {checkInMessage && <p style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>{checkInMessage}</p>}
          </div>
          <button className="btn btn-primary" onClick={handleDailyCheckIn} disabled={checkInLoading}>
            <Calendar size={14} />
            <span>{checkInLoading ? 'Checking In...' : 'Daily Check-in'}</span>
          </button>
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

            {[
              { label: 'Data Structures & Algorithms', pct: 65, cls: 'po' },
              { label: 'Aptitude & Logical Reasoning', pct: 42, cls: 'pg' },
              { label: 'System Design', pct: 28, cls: 'pp' },
            ].map(({ label, pct, cls }) => (
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div variants={itemVars} className="card">
              <div className="card-hdr">
                <div className="card-title">Today's Focus</div>
                <Clock size={15} style={{ color: 'var(--t3)' }} />
              </div>

              {[
                { time: '09:00', label: 'Tree Traversals', status: 'next', color: 'var(--orange)' },
                { time: '11:30', label: 'Profit & Loss Quiz', status: '', color: 'var(--easy)' },
                { time: '02:00', label: 'Mock Interview', status: '', color: 'var(--t4)' },
              ].map(({ time, label, status, color }) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', marginBottom: 6, borderRadius: 10, background: status === 'next' ? 'rgba(249,115,22,0.06)' : 'transparent', border: `1px solid ${status === 'next' ? 'rgba(249,115,22,0.15)' : 'transparent'}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: status === 'next' ? 'var(--orange-glow-sm)' : 'none', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--t3)', width: 46 }}>{time} AM</span>
                  <span style={{ fontSize: 13, fontWeight: status === 'next' ? 700 : 500, color: status === 'next' ? 'var(--t1)' : 'var(--t2)', flex: 1 }}>{label}</span>
                  {status === 'next' && <span style={{ fontSize: 9, background: 'var(--orange)', color: '#000', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>NEXT</span>}
                </div>
              ))}

              <button className="btn btn-ghost fw mt8 btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>View Roadmap <ChevronRight size={12} /></button>
            </motion.div>

            <motion.div variants={itemVars} className="card">
              <div className="card-hdr">
                <div className="card-title">Recent Activity</div>
                <span style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600, cursor: 'pointer' }}>All →</span>
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
