import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Trophy, 
  Activity, 
  Clock, 
  Flame, 
  ChevronRight,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { practiceService } from '../api/practiceService';

import { profileService } from '../api/profileService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({
    solvedCount: user?.problemsSolved || 0,
    totalCount: 0,
    streak: user?.currentStreak || 0,
    level: 'Beginner'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const progress = await practiceService.getProgress();
        setStats(prev => ({
          ...prev,
          solvedCount: progress.completedCount || prev.solvedCount,
          totalCount: progress.totalProblems || 0,
          level: calculateLevel(progress.completedCount || prev.solvedCount)
        }));
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleAddSkill = async (skill) => {
    if (!skill || !skill.trim()) return;
    const s = skill.trim();
    const currentSkills = user.skills || [];
    if (currentSkills.includes(s)) return;
    
    const updatedSkills = [...currentSkills, s];
    try {
      const updatedUser = await profileService.updateProfile({ ...user, skills: updatedSkills });
      updateUser(updatedUser);
    } catch (err) {
      console.error('Failed to add skill', err);
    }
  };

  const handleRemoveSkill = async (skill) => {
    const currentSkills = user.skills || [];
    const updatedSkills = currentSkills.filter(s => s !== skill);
    try {
      const updatedUser = await profileService.updateProfile({ ...user, skills: updatedSkills });
      updateUser(updatedUser);
    } catch (err) {
      console.error('Failed to remove skill', err);
    }
  };

  const calculateLevel = (count) => {
    if (count > 100) return 'Expert';
    if (count > 50) return 'Advanced';
    if (count > 20) return 'Intermediate';
    return 'Beginner';
  };

  if (!user) return null;

  return (
    <div className="app-page on profile-page">
      <div className="profile-shell" style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        
        {/* Header Section */}
        <section className="profile-header mb32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-card-main"
            style={{
              background: 'var(--bg-p)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid var(--b1)',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="profile-avatar-large" style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '700',
              color: '#fff',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)'
            }}>
              {user.firstName[0]}{user.lastName[0]}
            </div>

            <div className="profile-info-main" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--t1)' }}>
                  {user.firstName} {user.lastName}
                </h1>
                <span className="profile-badge-pro" style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {stats.level} Member
                </span>
              </div>
              <p style={{ color: 'var(--t3)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                {user.email}
              </p>
              
              <div className="profile-actions-row" style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary btn-sm">
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Decorative Background Element */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '200px',
              height: '200px',
              background: 'var(--accent)',
              filter: 'blur(100px)',
              opacity: 0.1,
              pointerEvents: 'none'
            }} />
          </motion.div>
        </section>

        {/* Stats Grid */}
        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <StatCard 
            icon={<Trophy color="var(--orange)" />} 
            label="Problems Solved" 
            value={stats.solvedCount} 
            sub={`Out of ${stats.totalCount || '...'}`}
            delay={0.1}
          />
          <StatCard 
            icon={<Flame color="var(--red)" />} 
            label="Current Streak" 
            value={`${stats.streak} Days`} 
            sub="Consistent Practice"
            delay={0.2}
          />
          <StatCard 
            icon={<Activity color="var(--easy)" />} 
            label="Global Rank" 
            value="N/A" 
            sub="Ranking Coming Soon"
            delay={0.3}
          />
          <StatCard 
            icon={<Clock color="var(--accent)" />} 
            label="Time Spent" 
            value="12.4h" 
            sub="This Month"
            delay={0.4}
          />
        </div>

        {/* Detail Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--t1)' }}>Personal Details</h2>
            <div className="card" style={{ padding: '0' }}>
              <DetailRow label="Primary Goal" value={user.primaryGoal || "Not Set"} border />
              <DetailRow label="College" value={user.college || "Not Specified"} border />
              <DetailRow label="Graduation Year" value={user.gradYear || "N/A"} border />
              <DetailRow label="Branch" value={user.branch || "N/A"} last />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '32px', marginBottom: '20px', color: 'var(--t1)' }}>Technical Skills</h2>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map(skill => (
                    <span 
                      key={skill} 
                      style={{ 
                        background: 'var(--bg2)', 
                        color: 'var(--t2)', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '13px',
                        border: '1px solid var(--b1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {skill}
                      <button 
                        onClick={() => handleRemoveSkill(skill)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--t3)' }}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--t3)' }}>No skills added yet. Add skills to get better job recommendations.</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Add skill (e.g. Java, React)" 
                  style={{ flex: 1, background: 'var(--bg1)', border: '1px solid var(--b1)', borderRadius: '8px', padding: '8px 12px', color: 'var(--t1)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button className="btn btn-primary btn-sm">Add</button>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--t1)' }}>Resume Status</h2>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '80px', 
                background: 'var(--bg2)', 
                border: '2px dashed var(--b2)',
                borderRadius: '8px',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChevronRight size={24} style={{ color: 'var(--t4)', transform: 'rotate(-90deg)' }} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '16px' }}>No resume found in your profile.</p>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}>Create Resume</button>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card" 
    style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg2)', display: 'flex' }}>
        {icon}
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--t1)', marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '12px', color: 'var(--t3)' }}>
      {sub}
    </div>
  </motion.div>
);

const DetailRow = ({ label, value, border, last }) => (
  <div style={{ 
    padding: '16px 24px', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: border ? '1px solid var(--b1)' : 'none'
  }}>
    <span style={{ color: 'var(--t3)', fontSize: '14px' }}>{label}</span>
    <span style={{ color: 'var(--t2)', fontSize: '14px', fontWeight: '600' }}>{value}</span>
  </div>
);

export default Profile;
