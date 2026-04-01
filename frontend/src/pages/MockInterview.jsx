import React from 'react';
import {
  Video,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  PlayCircle,
  ClipboardCheck,
  MessageSquareQuote,
  Save,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'mock_interview_workspace';

const defaultSessions = [
  {
    id: 1,
    topic: 'Frontend React',
    role: 'Frontend Developer',
    roundType: 'Technical',
    duration: 45,
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'Scheduled'
  },
  {
    id: 2,
    topic: 'HR Communication',
    role: 'Graduate Trainee',
    roundType: 'HR',
    duration: 30,
    scheduledTime: new Date(Date.now() + 172800000).toISOString(),
    status: 'Planned'
  }
];

const roundPlans = {
  Technical: ['Introduction and resume walk-through', 'Two coding or concept questions', 'Project deep dive', 'Question time with feedback'],
  HR: ['Introduction and comfort warm-up', 'Motivation and strengths questions', 'Behavioral story round', 'Wrap-up and fit summary'],
  'System Design': ['Clarify requirements', 'Draw high-level design', 'Discuss scaling and tradeoffs', 'Review decisions and improvements'],
  Communication: ['60-second pitch', 'Confidence and clarity round', 'Group discussion style response', 'Reflection and refinement']
};

const loadState = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      sessions: Array.isArray(stored.sessions) && stored.sessions.length ? stored.sessions : defaultSessions,
      activeSessionId: stored.activeSessionId || (stored.sessions?.[0]?.id ?? defaultSessions[0].id),
      feedback: stored.feedback || '',
      strengths: stored.strengths || '',
      improvements: stored.improvements || ''
    };
  } catch (error) {
    return {
      sessions: defaultSessions,
      activeSessionId: defaultSessions[0].id,
      feedback: '',
      strengths: '',
      improvements: ''
    };
  }
};

const MockInterview = () => {
  const initialState = React.useMemo(loadState, []);
  const [sessions, setSessions] = React.useState(initialState.sessions);
  const [showForm, setShowForm] = React.useState(false);
  const [feedback, setFeedback] = React.useState(initialState.feedback);
  const [strengths, setStrengths] = React.useState(initialState.strengths);
  const [improvements, setImprovements] = React.useState(initialState.improvements);
  const [activeSessionId, setActiveSessionId] = React.useState(initialState.activeSessionId);
  const [message, setMessage] = React.useState('');
  const [formData, setFormData] = React.useState({
    topic: '',
    role: '',
    roundType: 'Technical',
    duration: 45,
    scheduledTime: ''
  });

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessions, activeSessionId, feedback, strengths, improvements })
    );
  }, [sessions, activeSessionId, feedback, strengths, improvements]);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ||
    sessions[0] ||
    null;

  const activePlan = activeSession ? (roundPlans[activeSession.roundType] || roundPlans.Technical) : [];

  const handleSubmit = (event) => {
    event.preventDefault();

    const newSession = {
      id: Date.now(),
      topic: formData.topic.trim(),
      role: formData.role.trim(),
      roundType: formData.roundType,
      duration: Number(formData.duration),
      scheduledTime: new Date(formData.scheduledTime).toISOString(),
      status: 'Scheduled'
    };

    setSessions((value) => [newSession, ...value]);
    setActiveSessionId(newSession.id);
    setFormData({
      topic: '',
      role: '',
      roundType: 'Technical',
      duration: 45,
      scheduledTime: ''
    });
    setShowForm(false);
    setMessage('Mock interview session created.');
  };

  const updateStatus = (id, status) => {
    setSessions((value) => value.map((session) => (session.id === id ? { ...session, status } : session)));
    setMessage(`Session marked as ${status.toLowerCase()}.`);
  };

  const saveReview = () => {
    if (!activeSession) return;
    setSessions((value) =>
      value.map((session) =>
        session.id === activeSession.id
          ? { ...session, review: feedback, strengths, improvements }
          : session
      )
    );
    setMessage('Interview notes saved.');
  };

  return (
    <div className="app-page on" style={{ padding: '28px 28px 40px' }}>
      <div style={{ maxWidth: 1180 }}>
        <div className="section-hdr mb24">
          <div>
            <h1 className="section-title">Mock Interview Workspace</h1>
            <p className="section-sub">Schedule, run, and review interview practice sessions in one place.</p>
            {message && <p style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>{message}</p>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((value) => !value)}>
            <Plus size={14} /> New Mock Interview
          </button>
        </div>

        {showForm && (
          <div className="card mb24">
            <div className="card-hdr">
              <div>
                <div className="card-title">Create New Session</div>
                <div className="card-sub">Set the topic, round type, and time so the user can practice with structure.</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Topic</label>
                  <div className="input-wrap">
                    <input type="text" value={formData.topic} onChange={(event) => setFormData({ ...formData, topic: event.target.value })} placeholder="Example: React hooks and state management" required />
                  </div>
                </div>
                <div className="field">
                  <label>Role</label>
                  <div className="input-wrap">
                    <input type="text" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })} placeholder="Example: Frontend Developer Intern" required />
                  </div>
                </div>
                <div className="field">
                  <label>Round Type</label>
                  <div className="input-wrap">
                    <select value={formData.roundType} onChange={(event) => setFormData({ ...formData, roundType: event.target.value })}>
                      {Object.keys(roundPlans).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Duration (mins)</label>
                  <div className="input-wrap">
                    <input type="number" min="15" max="120" value={formData.duration} onChange={(event) => setFormData({ ...formData, duration: event.target.value })} required />
                  </div>
                </div>
                <div className="field" style={{ gridColumn: 'span 2' }}>
                  <label>Date & Time</label>
                  <div className="input-wrap">
                    <input type="datetime-local" value={formData.scheduledTime} onChange={(event) => setFormData({ ...formData, scheduledTime: event.target.value })} required />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary fw">
                <Calendar size={14} /> Save Session
              </button>
            </form>
          </div>
        )}

        <div className="g7030">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="g3">
              {[
                { label: 'Total Sessions', value: sessions.length, icon: Video, color: 'var(--orange)' },
                { label: 'Completed', value: sessions.filter((item) => item.status === 'Completed').length, icon: CheckCircle2, color: 'var(--green)' },
                { label: 'Upcoming', value: sessions.filter((item) => item.status !== 'Completed').length, icon: Calendar, color: 'var(--blue)' }
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>{label}</span>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Interview Sessions</div>
                  <div className="card-sub">Click a session to open its practice plan and review workspace.</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => {
                        setActiveSessionId(session.id);
                        setFeedback(session.review || '');
                        setStrengths(session.strengths || '');
                        setImprovements(session.improvements || '');
                        setMessage('');
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        borderRadius: 14,
                        border: isActive ? '1px solid rgba(249,115,22,0.5)' : '1px solid var(--b1)',
                        background: isActive ? 'rgba(249,115,22,0.08)' : 'var(--bg2)',
                        color: 'var(--t1)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{session.topic}</div>
                        <div className={`badge ${session.status === 'Completed' ? 'bg' : 'bdark'}`}>{session.status}</div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>{session.role} • {session.roundType}</div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: 'var(--t2)' }}>
                        <span className="faic gap4"><Calendar size={13} /> {new Date(session.scheduledTime).toLocaleDateString()}</span>
                        <span className="faic gap4"><Clock size={13} /> {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{session.duration} mins</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {activeSession && (
              <>
                <div className="card">
                  <div className="card-hdr">
                    <div>
                      <div className="card-title">Active Interview</div>
                      <div className="card-sub">{activeSession.role} • {activeSession.roundType}</div>
                    </div>
                    <div className="badge bc faic gap6">
                      <Sparkles size={12} />
                      <span>{activeSession.duration} mins</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{activeSession.topic}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => updateStatus(activeSession.id, 'In Progress')}>
                      <PlayCircle size={14} /> Start Session
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(activeSession.id, 'Completed')}>
                      <CheckCircle2 size={14} /> Mark Completed
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activePlan.map((step) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)' }}>
                        <ClipboardCheck size={14} style={{ color: 'var(--orange)' }} />
                        <span style={{ fontSize: 13, color: 'var(--t2)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-hdr">
                    <div>
                      <div className="card-title">Feedback Workspace</div>
                      <div className="card-sub">Save notes after every mock round so the user can improve over time.</div>
                    </div>
                  </div>

                  <div className="field" style={{ marginBottom: 14 }}>
                    <label>Overall Review</label>
                    <div className="input-wrap">
                      <textarea
                        value={feedback}
                        onChange={(event) => setFeedback(event.target.value)}
                        placeholder="Write what happened in the session, key questions, and how the answer quality felt."
                        style={{ width: '100%', minHeight: 100, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Strengths</label>
                      <div className="input-wrap">
                        <textarea
                          value={strengths}
                          onChange={(event) => setStrengths(event.target.value)}
                          placeholder="Example: confidence, structure, project explanation."
                          style={{ width: '100%', minHeight: 90, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>Improvements</label>
                      <div className="input-wrap">
                        <textarea
                          value={improvements}
                          onChange={(event) => setImprovements(event.target.value)}
                          placeholder="Example: reduce filler words, improve DSA explanation, stronger closing."
                          style={{ width: '100%', minHeight: 90, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <button className="btn btn-primary btn-sm" onClick={saveReview}>
                      <Save size={14} /> Save Review
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Quick Tips</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Open with a calm 30-second summary before diving into details.',
                  'Use STAR for behavioral answers and examples.',
                  'Say your assumptions clearly during technical or design rounds.',
                  'End with one thoughtful question for the interviewer.'
                ].map((tip) => (
                  <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)' }}>
                    <MessageSquareQuote size={14} style={{ color: 'var(--green)' }} />
                    <span style={{ fontSize: 13, color: 'var(--t2)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
