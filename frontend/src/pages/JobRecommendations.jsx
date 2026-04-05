import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Target, 
  Zap, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { getRecommendations } from '../api/jobService';

const JobRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getRecommendations();
      setRecommendations(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job recommendations:', err);
      setError('Failed to load personalized recommendations. Please ensure your profile skills are updated.');
      setLoading(false);
    }
  };

  const getMatchColor = (percent) => {
    if (percent >= 80) return '#22c55e'; // Green
    if (percent >= 50) return '#f59e0b'; // Amber
    return '#94a3b8'; // Slate
  };

  const filteredJobs = recommendations.filter(rec => {
    if (filter === 'All') return true;
    if (filter === 'High Match') return rec.matchPercent >= 75;
    if (filter === 'Internship') return rec.job.type === 'Internship';
    if (filter === 'FullTime') return rec.job.type === 'FullTime';
    return true;
  });

  return (
    <div className="app-page on">
      <div className="section-hdr mb32">
        <div>
          <h1 className="section-title">Job Matching Engine</h1>
          <p className="section-sub">Personalized roles based on your verified skills and career goals.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost btn-sm" style={{ gap: '8px' }}>
            <Filter size={14} /> Filter
          </button>
          <button className="btn btn-primary btn-sm" style={{ gap: '8px' }}>
            <Zap size={14} /> Refine Profile
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        
        {/* Main Content */}
        <div>
          {/* Filters Bar */}
          <div className="mb24" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['All', 'High Match', 'Internship', 'FullTime'].map(f => (
              <button 
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f)}
                style={{ borderRadius: '20px', padding: '6px 16px' }}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map(n => (
                <div key={n} className="card skeleton" style={{ height: '180px' }}></div>
              ))}
            </div>
          ) : error ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', borderStyle: 'dashed' }}>
              <AlertCircle size={48} color="var(--red)" style={{ marginBottom: '16px' }} />
              <h3 className="card-title mb8">{error}</h3>
              <p className="card-sub mb20">Add skills to your profile to see matching jobs.</p>
              <button className="btn btn-primary">Update Profile</button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', borderStyle: 'dashed' }}>
              <Search size={48} color="var(--t3)" style={{ marginBottom: '16px' }} />
              <h3 className="card-title mb8">No matching jobs found</h3>
              <p className="card-sub">Try expanding your skills or changing filters.</p>
            </div>
          ) : (
            <AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredJobs.map((rec, idx) => (
                  <motion.div 
                    key={rec.job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card job-match-card"
                    style={{ 
                      padding: '24px', 
                      position: 'relative', 
                      overflow: 'hidden',
                      borderLeft: `4px solid ${getMatchColor(rec.matchPercent)}` 
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        background: 'var(--bg2)', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '32px',
                        border: '1px solid var(--b1)'
                      }}>
                        {rec.job.logoEmoji}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 className="card-title" style={{ fontSize: '18px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {rec.job.title}
                              {rec.job.isNew && <span className="badge badge-accent">New</span>}
                            </h3>
                            <p className="card-sub" style={{ fontSize: '14px', fontWeight: '600' }}>
                              {rec.job.company} • {rec.job.location}
                            </p>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '24px', 
                              fontWeight: '900', 
                              color: getMatchColor(rec.matchPercent),
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {rec.matchPercent}%
                              <Sparkles size={16} />
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Match Score
                            </div>
                          </div>
                        </div>

                        <div className="mt16" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {/* Matching Skills */}
                          {rec.matchingSkills.map(skill => (
                            <span 
                              key={skill} 
                              style={{ 
                                background: 'rgba(34, 197, 94, 0.1)', 
                                color: '#22c55e', 
                                padding: '4px 10px', 
                                borderRadius: '6px', 
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '600',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                              }}
                            >
                              <CheckCircle2 size={12} /> {skill}
                            </span>
                          ))}
                          
                          {/* Missing Skills */}
                          {rec.missingSkills.slice(0, 3).map(skill => (
                            <span 
                              key={skill} 
                              style={{ 
                                background: 'var(--bg2)', 
                                color: 'var(--t3)', 
                                padding: '4px 10px', 
                                borderRadius: '6px', 
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: '1px solid var(--b1)'
                              }}
                            >
                              <Lock size={12} /> {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '16px', color: 'var(--t2)', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {rec.job.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> {rec.job.salary}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> {rec.job.type}</span>
                          </div>
                          <a 
                            href={rec.job.applyLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-primary btn-sm"
                            style={{ gap: '8px' }}
                          >
                            Apply Now <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(236,72,153,0.1))', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'var(--bg1)', borderRadius: '10px' }}><Target size={20} color="var(--orange)" /></div>
              <h3 className="card-title" style={{ fontSize: '16px' }}>Goal Alignment</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: '1.6', marginBottom: '16px' }}>
              Our matching engine factors in your <strong>Primary Career Goal</strong> to boost roles that align with your desired path.
            </p>
            <div style={{ background: 'var(--bg1)', padding: '12px', borderRadius: '10px', border: '1px solid var(--b1)' }}>
              <div style={{ fontSize: '11px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '4px' }}>Current Focus</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--t1)' }}>Full Stack Engineering</div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="card-title mb16" style={{ fontSize: '15px' }}>Top Matching Companies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.slice(0, 4).map((rec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {rec.job.logoEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{rec.job.company}</div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{rec.matchPercent}% Harmony</div>
                  </div>
                  <ChevronRight size={14} color="var(--t3)" />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <Sparkles size={32} color="var(--orange)" style={{ margin: '0 auto 12px' }} />
            <h3 className="card-title mb8" style={{ fontSize: '15px' }}>Improve Your Score</h3>
            <p style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: '1.5', marginBottom: '16px' }}>
              Solve more problems in specific tracks to verify your expertise for top companies.
            </p>
            <button className="btn btn-ghost btn-sm fw">View Skill Path</button>
          </div>
        </div>

      </div>

      <style>{`
        .job-match-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .job-match-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          background: var(--bg2);
          border-color: var(--b1);
        }
        .badge-accent {
          background: linear-gradient(135deg, var(--orange), #ec4893);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};

export default JobRecommendations;
