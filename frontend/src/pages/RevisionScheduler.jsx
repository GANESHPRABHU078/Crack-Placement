import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  Clock, 
  BrainCircuit,
  Trophy,
  Filter,
  ExternalLink
} from 'lucide-react';
import { practiceService } from '../api/practiceService';

const DIFFICULTY_COLORS = {
  Easy: 'var(--easy)',
  Medium: 'var(--med)',
  Hard: 'var(--hard)',
};

const RevisionScheduler = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('due'); // 'due' | 'upcoming' | 'completed'

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await practiceService.getRevisions();
      setRevisions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load revisions:', err);
      setError('Could not load your revision schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const { dueToday, upcoming, history } = useMemo(() => {
    const now = new Date();
    return {
      dueToday: revisions.filter(r => r.isDue),
      upcoming: revisions.filter(r => !r.isDue),
      history: revisions.filter(r => r.lastRevisedAt).sort((a, b) => new Date(b.lastRevisedAt) - new Date(a.lastRevisedAt))
    };
  }, [revisions]);

  const handleMarkRevised = async (problemId) => {
    try {
      await practiceService.completeRevision(problemId);
      // Optional: Add a success toast here
      loadData();
    } catch (err) {
      console.error('Failed to mark as revised:', err);
      setError('Failed to update revision. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="app-page on" style={{ padding: '28px' }}>
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-title">Analysing your memory...</div>
          <div className="card-sub" style={{ marginTop: 8 }}>Calculating next revision intervals based on spaced repetition.</div>
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'due' ? dueToday : activeTab === 'upcoming' ? upcoming : history;

  return (
    <div className="app-page on revision-page">
      <div className="practice-shell">
        <div className="practice-hero">
          <div className="flex-row-between">
            <div>
              <div className="practice-kicker">Performance Optimization</div>
              <h1 className="practice-title">Revision Scheduler</h1>
              <p className="practice-subtitle">
                Automated spaced repetition to move problems from short-term to long-term memory.
              </p>
            </div>
            <div className="revision-stat-summary">
              <div className="rev-stat">
                <strong>{dueToday.length}</strong>
                <span>Required Today</span>
              </div>
              <div className="rev-stat">
                <strong>{upcoming.length}</strong>
                <span>Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="practice-alert" style={{ marginBottom: 24 }}>{error}</div>}

        <div className="revision-tabs">
          <button 
            className={`rev-tab ${activeTab === 'due' ? 'on' : ''}`}
            onClick={() => setActiveTab('due')}
          >
            <AlertCircle size={14} />
            Due Today
            <span className="rev-count">{dueToday.length}</span>
          </button>
          <button 
            className={`rev-tab ${activeTab === 'upcoming' ? 'on' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Clock size={14} />
            Upcoming
          </button>
          <button 
            className={`rev-tab ${activeTab === 'completed' ? 'on' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <History size={14} />
            Revision History
          </button>
        </div>

        <div className="revision-content">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="revision-grid"
            >
              {currentList.length > 0 ? (
                currentList.map((item) => (
                  <div key={item.id} className="revision-card">
                    <div className="rev-card-top">
                      <div className="rev-topic-badge" style={{ background: `${item.topic.accentColor}15`, color: item.topic.accentColor }}>
                        {item.topic.name}
                      </div>
                      <div className="rev-difficulty" style={{ color: DIFFICULTY_COLORS[item.difficulty] }}>
                        {item.difficulty}
                      </div>
                    </div>
                    
                    <h3 className="rev-problem-title">{item.title}</h3>
                    
                    <div className="rev-details">
                      <div className="rev-detail-item">
                        <Zap size={12} />
                        <span>Step {item.revisionStep}</span>
                      </div>
                      <div className="rev-detail-item">
                        <Calendar size={12} />
                        <span>Due {formatDate(item.nextRevisionDate)}</span>
                      </div>
                    </div>

                    <div className="rev-card-actions">
                      <a 
                        href={item.problemUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-ghost btn-sm"
                      >
                        <ExternalLink size={14} />
                        Solve
                      </a>
                      {activeTab === 'due' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkRevised(item.id)}
                        >
                          <CheckCircle2 size={14} />
                          Mark Revised
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="revision-empty">
                  <div className="rev-empty-icon">
                    {activeTab === 'due' ? <CheckCircle2 size={48} /> : <Calendar size={48} />}
                  </div>
                  <h3>{activeTab === 'due' ? "You're all caught up!" : "No upcoming revisions"}</h3>
                  <p>
                    {activeTab === 'due' 
                      ? "Great job! Keep completing new problems to see them scheduled for revision here." 
                      : "Schedule is clear for now. Focus on mastering new topics."}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .revision-page {
          padding: 0;
        }

        .flex-row-between {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .revision-stat-summary {
          display: flex;
          gap: 16px;
        }

        .rev-stat {
          background: var(--bg2);
          border: 1px solid var(--b1);
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 120px;
        }

        .rev-stat strong {
          font-size: 24px;
          color: var(--t1);
          line-height: 1;
        }

        .rev-stat span {
          font-size: 11px;
          color: var(--t3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 6px;
        }

        .revision-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--b1);
          padding-bottom: 1px;
        }

        .rev-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--t3);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .rev-tab.on {
          color: var(--t1);
          border-bottom-color: var(--accent);
        }

        .rev-count {
          background: var(--accent);
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 4px;
        }

        .revision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .revision-card {
          background: var(--bg1);
          border: 1px solid var(--b1);
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .revision-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .rev-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .rev-topic-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .rev-difficulty {
          font-size: 12px;
          font-weight: 500;
        }

        .rev-problem-title {
          font-size: 17px;
          color: var(--t1);
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .rev-details {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .rev-detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--t3);
        }

        .rev-card-actions {
          display: flex;
          gap: 10px;
        }

        .revision-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          color: var(--t3);
        }

        .rev-empty-icon {
          margin-bottom: 20px;
          color: var(--b2);
        }

        .revision-empty h3 {
          font-size: 20px;
          color: var(--t2);
          margin-bottom: 8px;
        }

        .revision-empty p {
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .btn-sm {
          padding: 8px 12px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default RevisionScheduler;
