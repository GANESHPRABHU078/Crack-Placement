import React from 'react';
import {
  MessageSquareText,
  Mic,
  TimerReset,
  BookMarked,
  CheckCircle2,
  Sparkles,
  Play,
  RotateCcw,
  Save,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'communication_lab_state';

const practiceTracks = [
  {
    id: 'self-intro',
    title: 'Self Introduction',
    subtitle: 'Build a strong 60-90 second personal pitch.',
    duration: 90,
    prompts: [
      'Tell me about yourself in a way that fits a software role.',
      'Walk me through your background and what led you to tech.',
      'Give a crisp introduction for a campus placement interview.'
    ],
    checklist: ['Clear opening', 'Education summary', 'Projects or internships', 'Career goal', 'Confident close']
  },
  {
    id: 'hr',
    title: 'HR Round',
    subtitle: 'Practice common confidence and motivation questions.',
    duration: 120,
    prompts: [
      'Why should we hire you for this role?',
      'What are your strengths and one real weakness?',
      'Describe a time you handled pressure or conflict.'
    ],
    checklist: ['Specific examples', 'Positive tone', 'Honest weakness', 'Role alignment', 'Strong body language']
  },
  {
    id: 'gd',
    title: 'Group Discussion',
    subtitle: 'Learn to speak with structure and clarity.',
    duration: 180,
    prompts: [
      'Is AI creating more jobs than it removes?',
      'Should coding be mandatory for all engineering students?',
      'Are remote internships as effective as on-site internships?'
    ],
    checklist: ['Strong opening', 'Balanced points', 'Examples or facts', 'Respectful tone', 'Clear conclusion']
  },
  {
    id: 'behavioral',
    title: 'Behavioral Stories',
    subtitle: 'Use STAR format to answer people-focused questions.',
    duration: 150,
    prompts: [
      'Tell me about a time you led a team to finish a task.',
      'Describe a failure and what you learned from it.',
      'Explain a situation where you solved a misunderstanding.'
    ],
    checklist: ['Situation', 'Task', 'Action', 'Result', 'Reflection']
  }
];

const frameworks = [
  { title: 'STAR', text: 'Use Situation, Task, Action, Result for stories about leadership, conflict, and problem-solving.' },
  { title: 'PREP', text: 'Use Point, Reason, Example, Point again for GD and opinion-based communication answers.' },
  { title: 'Pitch Flow', text: 'Present, Past, Proof, Purpose. This works well for self-introduction and HR rounds.' }
];

const loadInitialState = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      selectedTrackId: stored.selectedTrackId || practiceTracks[0].id,
      promptIndex: Number.isInteger(stored.promptIndex) ? stored.promptIndex : 0,
      notes: stored.notes || '',
      strengths: stored.strengths || '',
      improvements: stored.improvements || '',
      sessions: Array.isArray(stored.sessions) ? stored.sessions : []
    };
  } catch (error) {
    return {
      selectedTrackId: practiceTracks[0].id,
      promptIndex: 0,
      notes: '',
      strengths: '',
      improvements: '',
      sessions: []
    };
  }
};

const CommunicationLab = () => {
  const initialState = React.useMemo(loadInitialState, []);
  const [selectedTrackId, setSelectedTrackId] = React.useState(initialState.selectedTrackId);
  const [promptIndex, setPromptIndex] = React.useState(initialState.promptIndex);
  const [notes, setNotes] = React.useState(initialState.notes);
  const [strengths, setStrengths] = React.useState(initialState.strengths);
  const [improvements, setImprovements] = React.useState(initialState.improvements);
  const [sessions, setSessions] = React.useState(initialState.sessions);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState('');

  const selectedTrack = practiceTracks.find((track) => track.id === selectedTrackId) || practiceTracks[0];
  const currentPrompt = selectedTrack.prompts[promptIndex] || selectedTrack.prompts[0];

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedTrackId, promptIndex, notes, strengths, improvements, sessions })
    );
  }, [selectedTrackId, promptIndex, notes, strengths, improvements, sessions]);

  React.useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (secondsLeft === 0 && isRunning) {
        setIsRunning(false);
      }
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [isRunning, secondsLeft]);

  React.useEffect(() => {
    setPromptIndex(0);
    setSecondsLeft(selectedTrack.duration);
    setIsRunning(false);
    setSaveMessage('');
  }, [selectedTrackId, selectedTrack.duration]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const nextPrompt = () => {
    setPromptIndex((value) => (value + 1) % selectedTrack.prompts.length);
    setSaveMessage('');
  };

  const startTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(selectedTrack.duration);
    }
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(selectedTrack.duration);
  };

  const saveSession = () => {
    const entry = {
      id: Date.now(),
      trackTitle: selectedTrack.title,
      prompt: currentPrompt,
      notes: notes.trim(),
      strengths: strengths.trim(),
      improvements: improvements.trim(),
      createdAt: new Date().toLocaleString()
    };

    setSessions((value) => [entry, ...value].slice(0, 8));
    setSaveMessage('Practice session saved.');
  };

  const completionRate = Math.min(100, sessions.length * 10);

  return (
    <div className="app-page on" style={{ padding: '28px 28px 40px' }}>
      <div style={{ maxWidth: 1180 }}>
        <div className="section-hdr mb24">
          <div>
            <h1 className="section-title">Communication Lab</h1>
            <p className="section-sub">Practice HR answers, self-introductions, group discussions, and speaking structure in one place.</p>
            {saveMessage && <p style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>{saveMessage}</p>}
          </div>
          <div className="badge bc faic gap6" style={{ padding: '10px 14px' }}>
            <Sparkles size={14} />
            <span>{sessions.length} saved sessions</span>
          </div>
        </div>

        <div className="g4 mb24">
          {[
            { icon: Mic, label: 'Track', value: selectedTrack.title, tone: 'var(--orange)' },
            { icon: TimerReset, label: 'Practice Timer', value: formatTime(secondsLeft), tone: 'var(--green)' },
            { icon: CheckCircle2, label: 'Completion', value: `${completionRate}%`, tone: 'var(--blue)' },
            { icon: BookMarked, label: 'Current Prompt', value: `${promptIndex + 1}/${selectedTrack.prompts.length}`, tone: 'var(--yellow)' }
          ].map(({ icon: Icon, label, value, tone }) => (
            <div key={label} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                <Icon size={16} style={{ color: tone }} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="g7030">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Choose Practice Mode</div>
                  <div className="card-sub">{selectedTrack.subtitle}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {practiceTracks.map((track) => {
                  const active = track.id === selectedTrackId;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrackId(track.id)}
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        borderRadius: 14,
                        border: active ? '1px solid rgba(249,115,22,0.55)' : '1px solid var(--b1)',
                        background: active ? 'rgba(249,115,22,0.08)' : 'var(--bg2)',
                        color: 'var(--t1)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{track.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10 }}>{track.subtitle}</div>
                      <div style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700 }}>{track.duration}s session</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Live Practice Prompt</div>
                  <div className="card-sub">Speak out loud, record yourself if you want, then write a short review.</div>
                </div>
              </div>

              <div style={{ padding: '18px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(255,255,255,0.02))', border: '1px solid rgba(249,115,22,0.18)', marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, marginBottom: 10 }}>{selectedTrack.title}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.4 }}>{currentPrompt}</div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                <button className="btn btn-primary btn-sm" onClick={startTimer}>
                  <Play size={14} /> Start Timer
                </button>
                <button className="btn btn-ghost btn-sm" onClick={resetTimer}>
                  <RotateCcw size={14} /> Reset Timer
                </button>
                <button className="btn btn-ghost btn-sm" onClick={nextPrompt}>
                  <ChevronRight size={14} /> Next Prompt
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'var(--t3)' }}>Your response notes</label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Write the answer outline or key points you spoke."
                    style={{ width: '100%', minHeight: 120, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'var(--t3)' }}>What went well</label>
                  <textarea
                    value={strengths}
                    onChange={(event) => setStrengths(event.target.value)}
                    placeholder="Example: good eye contact, clear examples, steady pace."
                    style={{ width: '100%', minHeight: 120, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'var(--t3)' }}>Improve next time</label>
                <textarea
                  value={improvements}
                  onChange={(event) => setImprovements(event.target.value)}
                  placeholder="Example: reduce filler words, make result stronger, improve opening."
                  style={{ width: '100%', minHeight: 100, background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 12, color: 'var(--t1)', padding: '12px 14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-sm" onClick={saveSession}>
                  <Save size={14} /> Save Practice Session
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Speaking Checklist</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedTrack.checklist.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
                    <span style={{ fontSize: 13, color: 'var(--t2)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Answer Frameworks</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {frameworks.map((item) => (
                  <div key={item.title} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--b1)' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Practice History</div>
              </div>
              {sessions.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--t3)' }}>No saved sessions yet. Practice one round and save your notes here.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sessions.map((session) => (
                    <div key={session.id} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--b1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{session.trackTitle}</div>
                        <div style={{ fontSize: 11, color: 'var(--t4)' }}>{session.createdAt}</div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}>{session.prompt}</div>
                      {session.strengths && <div style={{ fontSize: 12, color: 'var(--green)', marginBottom: 4 }}>Strong: {session.strengths}</div>}
                      {session.improvements && <div style={{ fontSize: 12, color: 'var(--orange)' }}>Improve: {session.improvements}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Daily Routine</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.7 }}>
                1. Pick one track and speak for the full timer.
                <br />
                2. Review your answer and note one strength.
                <br />
                3. Note one improvement and repeat once.
                <br />
                4. Save the session so you can compare progress later.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationLab;
