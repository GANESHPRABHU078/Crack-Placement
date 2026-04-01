import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Cpu,
  ExternalLink,
  Globe,
  Layers3,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roadmapService } from '../api/roadmapService';

const iconMap = {
  code: Code2,
  cpu: Cpu,
  layers: Layers3,
  globe: Globe
};

const badgeStyle = {
  Easy: { bg: '#16a34a20', fg: '#22c55e' },
  Medium: { bg: '#f59e0b20', fg: '#f59e0b' },
  Hard: { bg: '#ef444420', fg: '#ef4444' }
};

const Roadmap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = React.useState([]);
  const [activeId, setActiveId] = React.useState('');
  const [trackId, setTrackId] = React.useState('');
  const [progress, setProgress] = React.useState({});
  const [message, setMessage] = React.useState('');
  const [loadingRoadmaps, setLoadingRoadmaps] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const loadRoadmaps = async () => {
      setLoadingRoadmaps(true);
      try {
        const data = await roadmapService.getRoadmaps();
        if (cancelled) return;
        setRoadmaps(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) {
          setMessage('Could not load roadmap content from the server right now.');
        }
      } finally {
        if (!cancelled) {
          setLoadingRoadmaps(false);
        }
      }
    };

    loadRoadmaps();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!roadmaps.length) return;
    if (!activeId || !roadmaps.some((item) => item.id === activeId)) {
      setActiveId(roadmaps[0].id);
    }
  }, [roadmaps, activeId]);

  const active = roadmaps.find((item) => item.id === activeId) || roadmaps[0] || null;

  React.useEffect(() => {
    if (!active?.tracks?.length) {
      setTrackId('');
      return;
    }
    if (!trackId || !active.tracks.some((item) => item.id === trackId)) {
      setTrackId(active.tracks[0].id);
    }
  }, [active, trackId]);

  React.useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!user) {
        setProgress({});
        setLoadingProgress(false);
        return;
      }

      setLoadingProgress(true);
      try {
        const data = await roadmapService.getProgress();
        if (cancelled) return;
        const nextProgress = (data.progressEntries || []).reduce((acc, entry) => {
          acc[entry.topicId] = entry;
          return acc;
        }, {});
        setProgress(nextProgress);
      } catch (error) {
        if (!cancelled) {
          setMessage('Could not load roadmap progress from the server right now.');
        }
      } finally {
        if (!cancelled) {
          setLoadingProgress(false);
        }
      }
    };

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const statusOf = (topicId) => progress[topicId]?.status || 'not_started';

  const saveStatus = async (roadmap, levelLabel, topic, status) => {
    const previous = progress[topic.id];
    const optimisticEntry = {
      ...previous,
      roadmapId: roadmap.id,
      roadmapTitle: roadmap.title,
      levelLabel,
      topicId: topic.id,
      topicTitle: topic.title,
      status,
      startedAt: previous?.startedAt || new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    setProgress((prev) => ({ ...prev, [topic.id]: optimisticEntry }));

    try {
      const data = await roadmapService.updateProgress({
        roadmapId: roadmap.id,
        roadmapTitle: roadmap.title,
        levelLabel,
        topicId: topic.id,
        topicTitle: topic.title,
        status
      });
      setProgress((prev) => ({ ...prev, [topic.id]: data.entry }));
    } catch (error) {
      setProgress((prev) => {
        const next = { ...prev };
        if (previous) next[topic.id] = previous;
        else delete next[topic.id];
        return next;
      });
      throw error;
    }
  };

  const openResource = (resource) => {
    if (resource.internal) {
      navigate(resource.url);
      return;
    }
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const startTopic = async (topic, levelLabel) => {
    if (!active) return;
    try {
      if (statusOf(topic.id) === 'not_started') {
        await saveStatus(active, levelLabel, topic, 'in_progress');
        setMessage(`${topic.title} added to your active plan.`);
      }
      if (topic.route) navigate(topic.route);
    } catch (error) {
      setMessage('Could not save roadmap progress. Please try again.');
    }
  };

  const toggleComplete = async (topic, levelLabel) => {
    if (!active) return;
    const done = statusOf(topic.id) === 'completed';
    try {
      await saveStatus(active, levelLabel, topic, done ? 'in_progress' : 'completed');
      setMessage(done ? `${topic.title} moved back to in progress.` : `${topic.title} marked completed.`);
    } catch (error) {
      setMessage('Could not save roadmap progress. Please try again.');
    }
  };

  const progressOfRoadmap = (roadmap) => {
    const topics = roadmap?.levels?.flatMap((level) => level.topics || []) || [];
    const completed = topics.filter((topic) => statusOf(topic.id) === 'completed').length;
    const total = topics.length || 1;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  };

  const activeTrack = active?.tracks?.find((item) => item.id === trackId) || active?.tracks?.[0] || null;
  const activeProgress = active ? progressOfRoadmap(active) : { completed: 0, total: 1, percent: 0 };
  const recommendations = active
    ? active.levels
        .flatMap((level) => (level.topics || []).filter((topic) => statusOf(topic.id) !== 'completed').map((topic) => ({ ...topic, level: level.label })))
        .slice(0, 3)
    : [];
  const weakAreas = roadmaps
    .map((roadmap) => ({ roadmap, stats: progressOfRoadmap(roadmap) }))
    .sort((a, b) => a.stats.percent - b.stats.percent)
    .slice(0, 2);

  if (loadingRoadmaps && !roadmaps.length) {
    return <div className="app-page on" style={{ padding: 28, color: 'var(--t2)' }}>Loading roadmap content...</div>;
  }

  if (!active) {
    return <div className="app-page on" style={{ padding: 28, color: 'var(--t2)' }}>No roadmap content available right now.</div>;
  }

  return (
    <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
      <div style={{ maxWidth: 1220, margin: '0 auto', display: 'grid', gap: 24 }}>
        <section style={{ padding: 28, borderRadius: 20, border: '1px solid var(--b1)', background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.96))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 800, marginBottom: 10 }}>Placement Preparation Roadmaps</div>
              <h1 className="section-title" style={{ marginBottom: 10 }}>Structured roadmaps for placements with backend-driven content</h1>
              <p className="section-sub">Every roadmap card, stage, topic, plan, and resource link on this page now comes from your backend data instead of hardcoded frontend content.</p>
              {message && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--t2)' }}>{message}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(150px, 1fr))', gap: 12, minWidth: 320 }}>
              <div style={{ padding: 16, borderRadius: 16, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.28)' }}>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Active roadmap</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', marginTop: 6 }}>{active.title}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>{active.duration}</div>
              </div>
              <div style={{ padding: 16, borderRadius: 16, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)' }}>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Progress</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', marginTop: 6 }}>{activeProgress.percent}%</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>{activeProgress.completed}/{activeProgress.total} topics done</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {roadmaps.map((roadmap) => {
            const Icon = iconMap[roadmap.iconName] || Code2;
            const stats = progressOfRoadmap(roadmap);
            const selected = active.id === roadmap.id;
            return (
              <button key={roadmap.id} type="button" onClick={() => { setActiveId(roadmap.id); setMessage(`${roadmap.title} roadmap selected.`); }} style={{ padding: 20, borderRadius: 18, border: `1px solid ${selected ? `${roadmap.color}55` : 'var(--b1)'}`, background: selected ? `${roadmap.color}12` : 'var(--bg3)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${roadmap.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} style={{ color: roadmap.color }} /></div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: roadmap.color }}>{stats.percent}%</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>{roadmap.title}</div>
                <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 10 }}>{roadmap.subtitle}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)' }}><span>{roadmap.duration}</span><span>{stats.completed}/{stats.total} topics</span></div>
              </button>
            );
          })}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 24 }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ padding: 24, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 12, color: active.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{active.title} roadmap</div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{active.subtitle}</h2>
                </div>
                <button type="button" onClick={() => navigate(active.primaryRoute)} className="btn btn-primary btn-sm">Open Practice Area</button>
              </div>

              {active.tracks?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>Language tracks</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {active.tracks.map((track) => (
                      <button key={track.id} type="button" onClick={() => setTrackId(track.id)} style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${trackId === track.id ? `${active.color}55` : 'var(--b1)'}`, background: trackId === track.id ? `${active.color}18` : 'transparent', color: trackId === track.id ? active.color : 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{track.label}</button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: 16 }}>
                {active.levels.map((level, index) => (
                  <div key={level.id} style={{ padding: 18, borderRadius: 16, background: 'var(--bg4)', border: '1px solid var(--b1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${active.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active.color, fontWeight: 800 }}>{index + 1}</div>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--t1)' }}>{level.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--t3)' }}>{level.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {level.topics.map((topic) => {
                        const state = statusOf(topic.id);
                        const done = state === 'completed';
                        const doing = state === 'in_progress';
                        const badge = badgeStyle[topic.difficulty] || badgeStyle.Medium;
                        return (
                          <div key={topic.id} style={{ padding: 16, borderRadius: 14, border: `1px solid ${done ? `${active.color}55` : doing ? `${active.color}30` : 'var(--b1)'}`, background: done ? `${active.color}10` : 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
                                <div style={{ marginTop: 2 }}>{done ? <CheckCircle2 size={20} style={{ color: active.color }} /> : <Circle size={20} style={{ color: doing ? active.color : 'var(--t4)' }} />}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>{topic.title}</div>
                                    <span style={{ padding: '4px 10px', borderRadius: 999, background: badge.bg, color: badge.fg, fontSize: 11, fontWeight: 800 }}>{topic.difficulty}</span>
                                  </div>
                                  <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 12 }}>{topic.summary}</div>
                                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {topic.resources.map((resource) => (
                                      <button key={resource.label} type="button" onClick={() => openResource(resource)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 10, border: '1px solid var(--b1)', background: 'var(--bg5)', color: 'var(--t2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        <ExternalLink size={12} />
                                        {resource.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <button type="button" onClick={() => startTopic(topic, level.label)} className="btn btn-ghost btn-sm">{done ? 'Review' : doing ? 'Continue' : 'Start'}</button>
                                <button type="button" onClick={() => toggleComplete(topic, level.label)} style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${active.color}35`, background: `${active.color}12`, color: active.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{done ? 'Undo Complete' : 'Mark Complete'}</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ padding: 20, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><TrendingUp size={18} style={{ color: active.color }} /><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>Progress tracking</div></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}><span>{active.title}</span><span>{activeProgress.percent}%</span></div>
              <div style={{ height: 9, borderRadius: 999, background: 'var(--bg5)', overflow: 'hidden', marginBottom: 12 }}><div style={{ width: `${activeProgress.percent}%`, height: '100%', background: active.color, borderRadius: 999 }} /></div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>{loadingProgress ? 'Loading saved roadmap progress...' : <>Completion is saved to your account for <strong style={{ color: 'var(--t2)' }}>{user?.email || 'this user'}</strong>.</>}</div>
            </div>

            <div style={{ padding: 20, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><Clock3 size={18} style={{ color: active.color }} /><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>Daily and weekly plan</div></div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>{(active.daily || []).map((item) => <div key={item} style={{ padding: 12, borderRadius: 12, background: 'var(--bg4)', border: '1px solid var(--b1)', fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{item}</div>)}</div>
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--b1)', display: 'grid', gap: 8 }}>{(active.weekly || []).map((item) => <div key={item} style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>{item}</div>)}</div>
            </div>

            <div style={{ padding: 20, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><BookOpen size={18} style={{ color: active.color }} /><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>Resources</div></div>
              <div style={{ display: 'grid', gap: 10 }}>
                {(activeTrack?.resources || active.levels?.[0]?.topics?.[0]?.resources || []).map((resource) => (
                  <button key={resource.label} type="button" onClick={() => openResource(resource)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--b1)', background: 'var(--bg5)', color: 'var(--t2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span>{resource.label}</span>
                    <ExternalLink size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><Sparkles size={18} style={{ color: active.color }} /><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>Personalized recommendations</div></div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
                {recommendations.length > 0 ? recommendations.map((topic) => (
                  <button key={topic.id} type="button" onClick={() => startTopic(topic, topic.level)} style={{ padding: 12, borderRadius: 12, border: '1px solid var(--b1)', background: 'var(--bg4)', color: 'var(--t2)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>{topic.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>{topic.level}</div>
                  </button>
                )) : <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>This roadmap is fully complete. Move to another roadmap or start revision rounds.</div>}
              </div>

              <div style={{ paddingTop: 14, borderTop: '1px solid var(--b1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><Lightbulb size={16} style={{ color: active.color }} /><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>Weak areas</div></div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {weakAreas.map(({ roadmap, stats }) => (
                    <div key={roadmap.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: 'var(--bg4)', border: '1px solid var(--b1)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{roadmap.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>{stats.completed}/{stats.total} topics completed</div>
                      </div>
                      <button type="button" onClick={() => setActiveId(roadmap.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: roadmap.color, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                        Focus
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: 22, borderRadius: 18, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><Target size={18} style={{ color: active.color }} /><div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>Roadmap overview</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {roadmaps.map((roadmap) => {
              const stats = progressOfRoadmap(roadmap);
              return (
                <div key={roadmap.id} style={{ padding: 16, borderRadius: 14, background: 'var(--bg4)', border: '1px solid var(--b1)' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>{roadmap.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 12 }}>{roadmap.subtitle}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}><span>{roadmap.duration}</span><span>{stats.percent}% done</span></div>
                  <div style={{ height: 7, borderRadius: 999, background: 'var(--bg5)', overflow: 'hidden' }}><div style={{ height: '100%', width: `${stats.percent}%`, background: roadmap.color, borderRadius: 999 }} /></div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--t3)' }}>Roadmap definitions are now loaded from the backend database, and user progress is saved separately per account.</div>
        </section>
      </div>
    </div>
  );
};

export default Roadmap;
