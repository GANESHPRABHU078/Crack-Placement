import React from 'react';
import { mockInterviewService } from '../api/mockInterviewService';
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
  Sparkles,
  ArrowLeft,
  Send,
  Loader2,
  Trophy,
  Target,
  LineChart
} from 'lucide-react';
import { aiService } from '../api/aiService';

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

const topicCatalog = {
  Technical: [
    'React hooks and state management',
    'Java OOP and collections',
    'DBMS and SQL joins',
    'Operating systems and threads',
    'Computer networks basics',
    'REST API design',
    'Node.js backend concepts',
    'Spring Boot fundamentals',
    'JavaScript event loop',
    'Data structures and algorithms'
  ],
  HR: [
    'Tell me about yourself',
    'Why should we hire you',
    'Strengths and weaknesses',
    'Conflict resolution example',
    'Leadership experience',
    'Failure and lessons learned',
    'Career goals and motivation',
    'Teamwork under pressure'
  ],
  'System Design': [
    'Design URL shortener',
    'Design chat application',
    'Design online coding platform',
    'Design ride-booking system',
    'Design notification service',
    'Design video streaming platform',
    'Design food delivery app',
    'Design file storage system'
  ],
  Communication: [
    'Self introduction for placement',
    'Group discussion opening',
    'Explain your project clearly',
    'Pitch yourself in 60 seconds',
    'Handle difficult interviewer question',
    'Summarize internship experience',
    'Present an opinion with examples',
    'Communicate under time pressure'
  ]
};

const MockInterview = () => {
  const [sessions, setSessions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');
  const [strengths, setStrengths] = React.useState('');
  const [improvements, setImprovements] = React.useState('');
  const [activeSessionId, setActiveSessionId] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    topic: '',
    role: '',
    roundType: 'Technical',
    duration: 45,
    scheduledTime: ''
  });
  const [isInterviewing, setIsInterviewing] = React.useState(false);

  React.useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await mockInterviewService.getMyInterviews();
      setSessions(data);
      if (data.length > 0) setActiveSessionId(data[0].id);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setMessage('Failed to load interview sessions.');
    } finally {
      setLoading(false);
    }
  };

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ||
    sessions[0] ||
    null;

  React.useEffect(() => {
    if (activeSession) {
        setFeedback(activeSession.review || activeSession.feedback || '');
        setStrengths(activeSession.strengths || '');
        setImprovements(activeSession.improvements || '');
    }
  }, [activeSessionId]);

  const activePlan = activeSession ? (roundPlans[activeSession.roundType] || roundPlans.Technical) : [];
  const suggestedTopics = topicCatalog[formData.roundType] || [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newSession = await mockInterviewService.schedule({
        topic: formData.topic.trim(),
        role: formData.role.trim(),
        roundType: formData.roundType,
        duration: String(formData.duration),
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        status: 'Scheduled'
      });

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
      setMessage('Mock interview session scheduled.');
    } catch (error) {
      console.error('Failed to schedule session:', error);
      setMessage('Failed to schedule session. Please try again.');
    }
  };

  const updateStatus = (id, status) => {
    setSessions((value) => value.map((session) => (session.id === id ? { ...session, status } : session)));
    setMessage(`Session marked as ${status.toLowerCase()}.`);
  };

  const saveReview = async () => {
    if (!activeSession) return;
    try {
        await mockInterviewService.updateFeedback(activeSession.id, {
            feedback,
            strengths,
            improvements,
            rating: 4 // Default rating for now
        });
        setSessions((value) =>
            value.map((session) =>
              session.id === activeSession.id
                ? { ...session, feedback, strengths, improvements, status: 'Completed' }
                : session
            )
          );
          setMessage('Interview notes saved and session completed.');
    } catch (error) {
        console.error('Failed to save review:', error);
        setMessage('Failed to save review.');
    }
  };

  if (isInterviewing && activeSession) {
    return (
      <InterviewWorkspace 
        session={activeSession} 
        onClose={() => {
            setIsInterviewing(false);
            loadSessions();
        }} 
      />
    );
  }

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
                    <input
                      type="text"
                      list="mock-interview-topics"
                      value={formData.topic}
                      onChange={(event) => setFormData({ ...formData, topic: event.target.value })}
                      placeholder="Example: React hooks and state management"
                      required
                    />
                    <datalist id="mock-interview-topics">
                      {suggestedTopics.map((topic) => (
                        <option key={topic} value={topic} />
                      ))}
                    </datalist>
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
                    <select
                      value={formData.roundType}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          roundType: event.target.value,
                          topic: topicCatalog[event.target.value]?.[0] || ''
                        })
                      }
                    >
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
                <div className="field" style={{ gridColumn: 'span 2' }}>
                  <label>Suggested Topics</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {suggestedTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setFormData({ ...formData, topic })}
                        style={{
                          borderColor: formData.topic === topic ? 'var(--orange)' : 'var(--b2)',
                          color: formData.topic === topic ? 'var(--orange)' : 'var(--t2)'
                        }}
                      >
                        {topic}
                      </button>
                    ))}
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
                    <button className="btn btn-primary btn-sm" onClick={() => setIsInterviewing(true)}>
                      <PlayCircle size={14} /> Start Workspace
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

const InterviewWorkspace = ({ session, onClose }) => {
    const [messages, setMessages] = React.useState([]);
    const [userInput, setUserInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFinished, setIsFinished] = React.useState(false);
    const [summary, setSummary] = React.useState(null);
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        startInterview();
    }, []);

    React.useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const startInterview = async () => {
        setIsLoading(true);
        try {
            const prompt = `You are a professional ${session.role} interviewer. Start a ${session.roundType} interview about ${session.topic}. 
            Start by welcoming the candidate and asking the first technical or behavioral question. 
            Keep your response concise yet professional.`;
            
            const response = await aiService.chat([{ role: 'user', content: prompt }]);
            setMessages([{ role: 'assistant', content: response.reply }]);
        } catch (error) {
            console.error('Failed to start interview:', error);
            setMessages([{ role: 'assistant', content: "I'm sorry, I encountered an error starting the interview. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;

        const currentInput = userInput;
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
        setIsLoading(true);

        try {
            const lastQuestion = [...messages].reverse().find(m => m.role === 'assistant')?.content;
            
            // Get feedback for current answer
            const feedbackRes = await aiService.analyzeInterview(lastQuestion, currentInput);
            
            // Get next question
            const nextPrompt = `The candidate answered: "${currentInput}". 
            Feedback on their answer: "${feedbackRes.reply}". 
            Now, provide a very brief feedback on their response, and then ask the NEXT question for this ${session.roundType} interview on ${session.topic}. 
            If you have asked 3-4 questions already, you can conclude the interview.`;

            const response = await aiService.chat([...messages, { role: 'user', content: nextPrompt }]);
            setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I lost connection for a moment. Could you please repeat that?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const finishInterview = async () => {
        setIsLoading(true);
        try {
            const summaryPrompt = `Based on the following interview transcript for a ${session.role} role on the topic ${session.topic}, 
            provide a final summary in EXACTLY this JSON format:
            {
                "feedback": "overall summary",
                "strengths": "key strengths found",
                "improvements": "areas to work on",
                "rating": 1-5
            }
            
            TRANSCRIPT:
            ${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`;

            const response = await aiService.chat([{ role: 'user', content: summaryPrompt }]);
            
            let data;
            try {
                // Try to parse JSON from AI response
                const jsonMatch = response.reply.match(/\{.*\}/s);
                data = JSON.parse(jsonMatch ? jsonMatch[0] : response.reply);
            } catch (e) {
                data = {
                    feedback: response.reply,
                    strengths: "Evaluated during session",
                    improvements: "Refer to session notes",
                    rating: 4
                };
            }

            setSummary(data);
            await mockInterviewService.updateFeedback(session.id, data);
            setIsFinished(true);
        } catch (error) {
            console.error('Failed to finish interview:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFinished && summary) {
        return (
            <div className="app-page on" style={{ padding: '28px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div className="faic gap12 mb24" style={{ cursor: 'pointer', color: 'var(--t3)' }} onClick={onClose}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </div>

                    <div className="card text-center mb24" style={{ padding: '40px 20px' }}>
                        <div className="faic jcc mb16">
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trophy size={32} style={{ color: 'var(--orange)' }} />
                            </div>
                        </div>
                        <h1 className="section-title">Interview Completed!</h1>
                        <p className="section-sub">Excellent work. You've completed your practice session for {session.topic}.</p>
                    </div>

                    <div className="g2">
                        <div className="card">
                            <div className="card-hdr">
                                <div className="card-title faic gap8"><Target size={16} color="var(--orange)" /> Key Strengths</div>
                            </div>
                            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.6 }}>{summary.strengths}</p>
                        </div>
                        <div className="card">
                            <div className="card-hdr">
                                <div className="card-title faic gap8"><LineChart size={16} color="var(--blue)" /> Areas to Improve</div>
                            </div>
                            <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.6 }}>{summary.improvements}</p>
                        </div>
                    </div>

                    <div className="card mt24">
                        <div className="card-hdr">
                            <div className="card-title">Overall Feedback</div>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--t2)', fontSize: 14, lineHeight: 1.7 }} className="markdown-content">
                            {summary.feedback}
                        </div>
                        <div className="mt24">
                            <button className="btn btn-primary fw" onClick={onClose}>Done</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-page on" style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--b1)', background: 'var(--bg1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="faic gap12">
                    <button className="btn btn-ghost btn-sm" onClick={onClose}><ArrowLeft size={16} /></button>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{session.topic}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>{session.role} • {session.roundType}</div>
                    </div>
                </div>
                <button className="btn btn-ghost btn-sm color-orange" onClick={finishInterview}>Finish & Result</button>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                            maxWidth: '80%', 
                            padding: '14px 18px', 
                            borderRadius: 18, 
                            background: msg.role === 'user' ? 'var(--orange)' : 'var(--bg2)',
                            color: msg.role === 'user' ? '#fff' : 'var(--t1)',
                            border: msg.role === 'user' ? 'none' : '1px solid var(--b1)',
                            fontSize: 14,
                            lineHeight: 1.6,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ padding: '14px 18px', borderRadius: 18, background: 'var(--bg2)', border: '1px solid var(--b1)' }}>
                            <Loader2 size={18} className="spin" style={{ color: 'var(--t3)' }} />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '20px 24px', background: 'var(--bg1)', borderTop: '1px solid var(--b1)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 12 }}>
                    <div className="input-wrap" style={{ flex: 1 }}>
                        <input 
                            type="text" 
                            placeholder="Type your response here..." 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            style={{ height: 48, borderRadius: 24 }}
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        style={{ width: 48, height: 48, borderRadius: '50%', padding: 0, minWidth: 48 }}
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', marginTop: 12 }}>
                    Try to use frameworks like STAR or PREP for structured answers.
                </div>
            </div>
        </div>
    );
};

export default MockInterview;
