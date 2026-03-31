import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  Layers3,
  Binary,
  ListTree,
  FolderTree,
  Network,
  BrainCircuit,
  Rows3,
  WholeWord,
  Filter,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  SortAsc,
  Crosshair,
  GitFork,
} from 'lucide-react';
import { practiceService } from '../api/practiceService';

const iconMap = {
  array: Binary,
  string: WholeWord,
  'linked-list': ListTree,
  stack: Layers3,
  queue: Rows3,
  tree: FolderTree,
  graph: Network,
  brain: BrainCircuit,
  sorting: SortAsc,
  'binary-search': Crosshair,
  'two-pointers': ArrowLeftRight,
  backtracking: GitFork,
};

const DIFFICULTY_STYLES = {
  Easy: { color: 'var(--easy)', background: 'var(--easy-d)' },
  Medium: { color: 'var(--med)', background: 'var(--med-d)' },
  Hard: { color: 'var(--hard)', background: 'var(--hard-d)' },
};

const PLATFORM_STYLES = {
  LeetCode: { color: '#FFA116', background: 'rgba(255, 161, 22, 0.14)' },
  GeeksForGeeks: { color: '#2F8D46', background: 'rgba(47, 141, 70, 0.14)' },
};

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVars = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

const Practice = () => {
  const [topics, setTopics] = React.useState([]);
  const [problems, setProblems] = React.useState([]);
  const [completedIds, setCompletedIds] = React.useState(new Set());
  const [selectedTopic, setSelectedTopic] = React.useState('all');
  const [difficulty, setDifficulty] = React.useState('All');
  const [platform, setPlatform] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [savingId, setSavingId] = React.useState(null);
  const [insights, setInsights] = React.useState(null);

  React.useEffect(() => {
    const loadPracticeData = async () => {
      setLoading(true);
      setError('');
      try {
        const [topicsData, problemsData] = await Promise.all([
          practiceService.getTopics(),
          practiceService.getProblems(),
        ]);

        setTopics(topicsData);
        setProblems(problemsData);

        try {
          const progressData = await practiceService.getProgress();
          setCompletedIds(new Set(progressData.completedProblemIds || []));

          try {
            const insightsData = await practiceService.getInsights();
            setInsights(insightsData);
          } catch (insightsError) {
            console.error('Failed to load practice insights', insightsError);
          }
        } catch (progressError) {
          console.error('Failed to load practice progress', progressError);
          setCompletedIds(new Set());
          setError('Topics loaded, but saved progress could not be fetched right now.');
        }
      } catch (err) {
        console.error('Failed to load practice data', err);
        setError('Unable to load the practice page right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPracticeData();
  }, []);

  const filteredProblems = React.useMemo(() => {
    return problems.filter((problem) => {
      const matchesTopic = selectedTopic === 'all' || problem.topic.slug === selectedTopic;
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesPlatform = platform === 'All' || problem.platform === platform;
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        problem.title.toLowerCase().includes(normalizedSearch) ||
        problem.topic.name.toLowerCase().includes(normalizedSearch) ||
        problem.platform.toLowerCase().includes(normalizedSearch);
      return matchesTopic && matchesDifficulty && matchesPlatform && matchesSearch;
    });
  }, [difficulty, platform, problems, search, selectedTopic]);

  const selectedTopicMeta = React.useMemo(() => {
    if (selectedTopic === 'all') {
      return {
        name: 'All Topics',
        description: 'Browse the full curated set and narrow it down with filters and search.',
      };
    }

    return topics.find((topic) => topic.slug === selectedTopic) || {
      name: 'Topic',
      description: '',
    };
  }, [selectedTopic, topics]);

  const topicCounts = React.useMemo(() => {
    return topics.reduce((acc, topic) => {
      const topicProblems = problems.filter((problem) => problem.topic.slug === topic.slug);
      const completed = topicProblems.filter((problem) => completedIds.has(problem.id)).length;
      acc[topic.slug] = { total: topicProblems.length, completed };
      return acc;
    }, {});
  }, [completedIds, problems, topics]);

  const summary = React.useMemo(() => {
    const totalProblems = problems.length;
    const completed = completedIds.size;
    return {
      totalProblems,
      completed,
      remaining: Math.max(0, totalProblems - completed),
      filtered: filteredProblems.length,
    };
  }, [completedIds, filteredProblems.length, problems.length]);

  const toggleCompleted = async (problemId, completed) => {
    setSavingId(problemId);
    try {
      await practiceService.updateProgress(problemId, completed);
      setError('');
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (completed) {
          next.add(problemId);
        } else {
          next.delete(problemId);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to update practice progress', err);
      setError('Could not save your progress. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const focusRecommendedProblems = (topicSlug) => {
    setSelectedTopic(topicSlug || 'all');
    setDifficulty('All');
    setPlatform('All');
    setSearch('');
  };

  if (loading) {
    return (
      <div className="app-page on" style={{ padding: '28px' }}>
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-title">Loading practice dashboard...</div>
          <div className="card-sub" style={{ marginTop: 8 }}>Fetching curated topics, problems, and your saved progress.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page on practice-page">
      <div className="practice-shell">
        <div className="practice-hero">
          <div>
            <div className="practice-kicker">Structured Coding Prep</div>
            <h1 className="practice-title">Practice Page</h1>
            <p className="practice-subtitle">
              Explore topic-wise curated problems, jump to LeetCode or GeeksforGeeks, and keep your completion history saved in the database.
            </p>
          </div>

          <div className="practice-summary-grid">
            <div className="practice-summary-card">
              <span>Total Problems</span>
              <strong>{summary.totalProblems}</strong>
            </div>
            <div className="practice-summary-card">
              <span>Completed</span>
              <strong style={{ color: 'var(--easy)' }}>{summary.completed}</strong>
            </div>
            <div className="practice-summary-card">
              <span>Remaining</span>
              <strong>{summary.remaining}</strong>
            </div>
            <div className="practice-summary-card">
              <span>Visible Now</span>
              <strong>{summary.filtered}</strong>
            </div>
          </div>
        </div>

        {error && <div className="practice-alert">{error}</div>}

        <motion.div variants={containerVars} initial="hidden" animate="show">
          {insights?.weakestTopic && (
            <motion.section variants={itemVars} className="practice-section">
              <div className="practice-insight-card">
                <div className="practice-insight-head">
                  <div>
                    <div className="practice-kicker">Smart Weakness Detector</div>
                    <h2 className="section-title" style={{ marginBottom: 8 }}>Focus on {insights.weakestTopic.name}</h2>
                    <p className="section-sub">{insights.headline}</p>
                  </div>
                  <div className="practice-insight-badge">
                    <Sparkles size={16} />
                    <span>{insights.weakestTopic.status}</span>
                  </div>
                </div>

                <div className="practice-insight-grid">
                  <div className="practice-insight-panel">
                    <div className="practice-insight-metric">
                      <span>Completion Rate</span>
                      <strong>{insights.weakestTopic.completionRate}%</strong>
                    </div>
                    <div className="practice-insight-metric">
                      <span>Remaining</span>
                      <strong>{insights.weakestTopic.remaining}</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => focusRecommendedProblems(insights.weakestTopic.slug)}
                    >
                      <span>Open Topic Plan</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="practice-insight-panel">
                    <div className="practice-insight-subtitle">Suggested next problems</div>
                    <div className="practice-recommendations">
                      {insights.recommendedProblems.map((problem) => (
                        <div key={problem.id} className="practice-recommendation-row">
                          <div>
                            <div className="practice-recommendation-title">{problem.title}</div>
                            <div className="practice-recommendation-meta">{problem.difficulty} · {problem.platform}</div>
                          </div>
                          <a
                            href={problem.problemUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                          >
                            Solve
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="practice-insight-panel">
                    <div className="practice-insight-subtitle">Topic health</div>
                    <div className="practice-health-list">
                      {insights.topicInsights.slice(0, 4).map((topic) => (
                        <div key={topic.slug} className="practice-health-row">
                          <div>
                            <div className="practice-health-name">{topic.name}</div>
                            <div className="practice-health-meta">{topic.completed}/{topic.total} completed</div>
                          </div>
                          <div className="practice-health-rate">{topic.completionRate}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          <motion.section variants={itemVars} className="practice-section">
            <div className="section-hdr mb20">
              <div>
                <h2 className="section-title">Topics</h2>
                <p className="section-sub">Choose a topic to focus the problem list.</p>
              </div>
            </div>

            <div className="practice-topic-grid">
              <button
                type="button"
                className={`practice-topic-card ${selectedTopic === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedTopic('all')}
              >
                <div className="practice-topic-icon" style={{ background: 'rgba(249, 115, 22, 0.12)', color: 'var(--orange)' }}>
                  <Filter size={18} />
                </div>
                <div className="practice-topic-name">All Topics</div>
                <div className="practice-topic-meta">{summary.totalProblems} curated problems</div>
              </button>

              {topics.map((topic) => {
                const Icon = iconMap[topic.iconName] || Layers3;
                const counts = topicCounts[topic.slug] || { total: topic.problemCount || 0, completed: 0 };
                return (
                  <button
                    key={topic.id}
                    type="button"
                    className={`practice-topic-card ${selectedTopic === topic.slug ? 'is-active' : ''}`}
                    onClick={() => setSelectedTopic(topic.slug)}
                    style={{ '--topic-accent': topic.accentColor }}
                  >
                    <div className="practice-topic-icon" style={{ background: `${topic.accentColor}18`, color: topic.accentColor }}>
                      <Icon size={18} />
                    </div>
                    <div className="practice-topic-name">{topic.name}</div>
                    <div className="practice-topic-desc">{topic.description}</div>
                    <div className="practice-topic-footer">
                      <span>{counts.completed}/{counts.total} completed</span>
                      <span>{counts.total} problems</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={itemVars} className="practice-section">
            <div className="section-hdr mb20">
              <div>
                <h2 className="section-title">{selectedTopicMeta.name}</h2>
                <p className="section-sub">{selectedTopicMeta.description}</p>
              </div>
            </div>

            <div className="practice-toolbar">
              <div className="practice-search">
                <Search size={14} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, topic, or platform"
                />
              </div>

              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="practice-select">
                {['All', 'Easy', 'Medium', 'Hard'].map((option) => (
                  <option key={option} value={option}>{option === 'All' ? 'All Difficulty' : option}</option>
                ))}
              </select>

              <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="practice-select">
                {['All', 'LeetCode', 'GeeksForGeeks'].map((option) => (
                  <option key={option} value={option}>{option === 'All' ? 'All Platforms' : option}</option>
                ))}
              </select>
            </div>

            <div className="practice-results-row">
              <span>
                Showing <strong>{filteredProblems.length}</strong> problems
              </span>
              {(search || difficulty !== 'All' || platform !== 'All' || selectedTopic !== 'all') && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearch('');
                    setDifficulty('All');
                    setPlatform('All');
                    setSelectedTopic('all');
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="practice-problem-list">
              {filteredProblems.map((problem) => {
                const difficultyStyle = DIFFICULTY_STYLES[problem.difficulty];
                const platformStyle = PLATFORM_STYLES[problem.platform];
                const isCompleted = completedIds.has(problem.id);

                return (
                  <div key={problem.id} className="practice-problem-card">
                    <button
                      type="button"
                      className="practice-check"
                      onClick={() => toggleCompleted(problem.id, !isCompleted)}
                      disabled={savingId === problem.id}
                      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} style={{ color: 'var(--easy)' }} />
                      ) : (
                        <Circle size={18} style={{ color: 'var(--b3)' }} />
                      )}
                    </button>

                    <div className="practice-problem-main">
                      <div className="practice-problem-top">
                        <div>
                          <div className="practice-problem-title">{problem.title}</div>
                          <div className="practice-problem-summary">{problem.summary}</div>
                        </div>

                        <a
                          className="btn btn-primary"
                          href={problem.problemUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>Solve</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>

                      <div className="practice-problem-meta">
                        <span className="practice-chip" style={{ color: difficultyStyle.color, background: difficultyStyle.background }}>
                          {problem.difficulty}
                        </span>
                        <span className="practice-chip" style={{ color: platformStyle.color, background: platformStyle.background }}>
                          {problem.platform}
                        </span>
                        <span className="practice-chip practice-chip-muted">
                          {problem.topic.name}
                        </span>
                        <span className="practice-status-text">
                          {isCompleted ? 'Completed' : 'Remaining'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredProblems.length === 0 && (
                <div className="practice-empty">
                  <Search size={30} />
                  <div>No problems match these filters yet.</div>
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default Practice;
