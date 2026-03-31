import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, BadgeHelp, BarChart3, Clock3, Code2, FileText } from 'lucide-react';
import { practiceService } from '../api/practiceService';

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVars = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

const getDifficultyBadge = (aptitudeLevel) => {
  const normalized = aptitudeLevel?.toLowerCase() || '';
  if (normalized.includes('hard')) {
    return {
      label: 'High Intensity',
      color: '#fca5a5',
      background: 'rgba(239, 68, 68, 0.18)',
      borderColor: 'rgba(239, 68, 68, 0.32)',
    };
  }
  if (normalized.includes('medium')) {
    return {
      label: 'Balanced',
      color: '#fde68a',
      background: 'rgba(245, 158, 11, 0.18)',
      borderColor: 'rgba(245, 158, 11, 0.30)',
    };
  }
  return {
    label: 'Foundational',
    color: '#86efac',
    background: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(34, 197, 94, 0.28)',
  };
};

const CompanyPrep = () => {
  const [companies, setCompanies] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [companyPrep, setCompanyPrep] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const loadCompanyProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const profiles = await practiceService.getCompanyProfiles();
        setCompanies(profiles);
        if (profiles.length > 0) {
          setSelectedCompany(profiles[0].company);
        }
      } catch (err) {
        console.error('Failed to load company profiles', err);
        setError('Unable to load company preparation mode right now.');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyProfiles();
  }, []);

  React.useEffect(() => {
    if (!selectedCompany) {
      return;
    }

    const loadCompanyPrep = async () => {
      try {
        const data = await practiceService.getCompanyPrep(selectedCompany);
        setCompanyPrep(data);
      } catch (err) {
        console.error('Failed to load company preparation data', err);
        setError('Company details could not be loaded right now.');
      }
    };

    loadCompanyPrep();
  }, [selectedCompany]);

  if (loading) {
    return (
      <div className="app-page on practice-page">
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-title">Loading company preparation mode...</div>
          <div className="card-sub" style={{ marginTop: 8 }}>Fetching company patterns, asked questions, and suggested problems.</div>
        </div>
      </div>
    );
  }

  const difficultyBadge = companyPrep ? getDifficultyBadge(companyPrep.aptitudeLevel) : null;
  const companyBrandStyle = companyPrep ? { '--company-brand': companyPrep.brandColor || '#38bdf8' } : {};

  return (
    <div className="app-page on practice-page">
      <div className="practice-shell">
        <div className="practice-hero">
          <div>
            <div className="practice-kicker">Company Focused Prep</div>
            <h1 className="practice-title">Company Preparation Mode</h1>
            <p className="practice-subtitle">
              Select a target company and get a focused dashboard with aptitude expectations, interview pattern, common asked questions, and pattern-based coding practice.
            </p>
          </div>

          <div className="practice-summary-grid">
            <div className="practice-summary-card">
              <span>Companies</span>
              <strong>{companies.length}</strong>
            </div>
            <div className="practice-summary-card">
              <span>Selected</span>
              <strong style={{ fontSize: 22 }}>{selectedCompany || 'None'}</strong>
            </div>
          </div>
        </div>

        {error && <div className="practice-alert">{error}</div>}

        {companyPrep && (
          <motion.div variants={containerVars} initial="hidden" animate="show">
            <motion.section variants={itemVars} className="practice-section">
              <div className="practice-company-card" style={companyBrandStyle}>
                <div className="practice-company-head">
                  <div className="practice-company-hero">
                    <div className="practice-company-logo" aria-hidden="true">
                      {companyPrep.logoText}
                    </div>
                    <div>
                      <div className="practice-kicker">Company-Based Preparation Mode</div>
                      <div className="practice-company-title-row">
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Prepare for {companyPrep.company}</h2>
                        {difficultyBadge && (
                          <span
                            className="practice-company-badge"
                            style={{
                              color: difficultyBadge.color,
                              background: difficultyBadge.background,
                              borderColor: difficultyBadge.borderColor,
                            }}
                          >
                            {difficultyBadge.label}
                          </span>
                        )}
                      </div>
                      <p className="section-sub" style={{ marginTop: 8 }}>{companyPrep.prepPlan}</p>
                    </div>
                  </div>

                  <div className="practice-company-select-wrap">
                    <select
                      value={selectedCompany}
                      onChange={(event) => setSelectedCompany(event.target.value)}
                      className="practice-select"
                    >
                      {companies.map((company) => (
                        <option key={company.company} value={company.company}>{company.company}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="practice-company-stats-grid">
                  <div className="practice-company-stat-card">
                    <FileText size={15} />
                    <div>
                      <span>OA Questions</span>
                      <strong>{companyPrep.stats.onlineAssessmentQuestions}</strong>
                    </div>
                  </div>
                  <div className="practice-company-stat-card">
                    <BarChart3 size={15} />
                    <div>
                      <span>Interview Rounds</span>
                      <strong>{companyPrep.stats.interviewRounds}</strong>
                    </div>
                  </div>
                  <div className="practice-company-stat-card">
                    <Code2 size={15} />
                    <div>
                      <span>Coding Questions</span>
                      <strong>{companyPrep.stats.codingQuestions}</strong>
                    </div>
                  </div>
                  <div className="practice-company-stat-card">
                    <Clock3 size={15} />
                    <div>
                      <span>Interview Time</span>
                      <strong>{companyPrep.stats.interviewDurationMinutes} mins</strong>
                    </div>
                  </div>
                </div>

                <div className="practice-company-grid">
                  <div className="practice-company-panel">
                    <div className="practice-company-stat">
                      <Briefcase size={16} />
                      <div>
                        <span>Aptitude Level</span>
                        <strong>{companyPrep.aptitudeLevel}</strong>
                      </div>
                    </div>
                    <div className="practice-company-stat">
                      <Building2 size={16} />
                      <div>
                        <span>Interview Pattern</span>
                        <strong>{companyPrep.roundPattern}</strong>
                      </div>
                    </div>
                    <div className="practice-company-tags">
                      {companyPrep.focusAreas.map((area) => (
                        <span key={area} className="practice-chip practice-chip-muted">{area}</span>
                      ))}
                    </div>
                  </div>

                  <div className="practice-company-panel">
                    <div className="practice-insight-subtitle">Asked questions / common patterns</div>
                    <div className="practice-company-list">
                      {companyPrep.askedQuestions.map((question) => (
                        <div key={question} className="practice-company-list-row">
                          <BadgeHelp size={14} />
                          <span>{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="practice-company-panel">
                    <div className="practice-insight-subtitle">Pattern-based problems</div>
                    <div className="practice-recommendations">
                      {companyPrep.recommendedProblems.map((problem) => (
                        <div key={problem.id} className="practice-recommendation-row">
                          <div>
                            <div className="practice-recommendation-title">{problem.title}</div>
                            <div className="practice-recommendation-meta">{problem.topic.name} · {problem.difficulty} · {problem.platform}</div>
                            {problem.summary && (
                              <div className="practice-recommendation-meta" style={{ marginTop: 4 }}>
                                {problem.summary}
                              </div>
                            )}
                          </div>
                          <a
                            href={problem.problemUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            Solve
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;
