import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Zap, 
  Clock, 
  Github, 
  ExternalLink, 
  Bookmark, 
  CheckCircle, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Trophy,
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  Smartphone,
  ShieldCheck,
  Server
} from 'lucide-react';
import { projectService } from '../api/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectIdeas = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allProjs, recProjs, progress] = await Promise.all([
        projectService.getProjects(),
        projectService.getRecommendedProjects(),
        projectService.getUserProjectStatus()
      ]);
      setProjects(allProjs);
      setRecommended(recProjs);
      setUserProgress(progress);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusForProject = (projectId) => {
    const p = userProgress.find(up => up.projectIdea.id === projectId);
    return p ? p.status : null;
  };

  const handleUpdateStatus = async (projectId, status) => {
    try {
      const updated = await projectService.updateProjectStatus(projectId, status);
      setUserProgress(prev => {
        const idx = prev.findIndex(p => p.projectIdea.id === projectId);
        if (idx > -1) {
          const newProgress = [...prev];
          newProgress[idx] = updated;
          return newProgress;
        }
        return [...prev, updated];
      });
    } catch (err) {
      console.error('Error updating project status:', err);
    }
  };

  const domains = [
    { id: 'All', label: 'All Domains', icon: Layers },
    { id: 'WEB_DEV', label: 'Web Dev', icon: Code2 },
    { id: 'AI_ML', label: 'AI / ML', icon: Cpu },
    { id: 'SYSTEM_DESIGN', label: 'System Design', icon: Server },
    { id: 'MOBILE_APP', label: 'Mobile Apps', icon: Smartphone },
    { id: 'CYBERSECURITY', label: 'Security', icon: ShieldCheck }
  ];

  const filteredProjects = projects.filter(p => {
    const matchesDomain = filter === 'All' || p.domain === filter;
    const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'BEGINNER': return '#22c55e';
      case 'INTERMEDIATE': return '#f59e0b';
      case 'ADVANCED': return '#ef4444';
      default: return 'var(--t3)';
    }
  };

  return (
    <div className="app-page on">
      {/* Header */}
      <div className="section-hdr mb32">
        <div>
          <h1 className="section-title">Project Discovery</h1>
          <p className="section-sub">Build industry-grade portfolios with step-by-step guidance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="search-box">
             <Search size={18} />
             <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {!loading && recommended.length > 0 && search === '' && filter === 'All' && (
        <section className="mb40">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--orange)" />
            <h2 className="card-title" style={{ fontSize: '18px' }}>Recommended for Your Stack</h2>
          </div>
          <div className="project-rec-grid">
            {recommended.slice(0, 3).map((rec, idx) => (
              <motion.div 
                key={rec.project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="card project-rec-card"
                onClick={() => setSelectedProject(rec.project)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)' }}>
                    {rec.matchPercent}% Match
                  </span>
                  <Trophy size={18} color="var(--orange)" opacity={0.6} />
                </div>
                <h3 className="card-title mb4">{rec.project.title}</h3>
                <p className="card-sub mb16" style={{ fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {rec.project.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {rec.project.techStack.slice(0, 2).map(t => (
                      <span key={t} className="tech-tag-sm">{t}</span>
                    ))}
                  </div>
                  <ArrowRight size={16} color="var(--t3)" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Filters Bar */}
      <div className="filters-bar mb32">
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {domains.map(dom => {
            const Icon = dom.icon;
            return (
              <button 
                key={dom.id}
                className={`filter-btn ${filter === dom.id ? 'on' : ''}`}
                onClick={() => setFilter(dom.id)}
              >
                <Icon size={16} />
                {dom.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            className="select-input" 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="project-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card skeleton" style={{ height: '240px' }} />)}
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card project-card"
              onClick={() => setSelectedProject(p)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'var(--bg2)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent)'
                }}>
                  {getDomainIcon(p.domain)}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {getStatusForProject(p.id) === 'COMPLETED' && <CheckCircle size={18} color="var(--easy)" />}
                  {getStatusForProject(p.id) === 'BOOKMARKED' && <Bookmark size={18} color="var(--orange)" fill="var(--orange)" />}
                  {getStatusForProject(p.id) === 'IN_PROGRESS' && <Zap size={18} color="var(--orange)" />}
                </div>
              </div>

              <h3 className="card-title mb8" style={{ fontSize: '16px' }}>{p.title}</h3>
              <p className="card-sub mb20" style={{ fontSize: '13px', height: '3.2em', overflow: 'hidden' }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {p.techStack.slice(0, 3).map(t => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>

              <div className="project-card-footer">
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--t3)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {p.estimatedTime}
                  </span>
                  <span style={{ color: getDifficultyColor(p.difficulty), fontWeight: '700' }}>
                    {p.difficulty}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--t2)', fontSize: '12px', fontWeight: '600' }}>
                  Impact: {p.resumeImpactScore}/10
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content project-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-hdr">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div className="project-icon-large">
                    {getDomainIcon(selectedProject.domain, 28)}
                  </div>
                  <div>
                    <h2 className="card-title" style={{ fontSize: '24px' }}>{selectedProject.title}</h2>
                    <p className="card-sub">{selectedProject.domain.replace('_', ' ')} • {selectedProject.difficulty}</p>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setSelectedProject(null)}>✕</button>
              </div>

              <div className="project-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                  
                  {/* Left Column */}
                  <div>
                    <section className="mb32">
                      <h3 className="section-sub mb12" style={{ color: 'var(--t1)', fontWeight: '700' }}>Overview</h3>
                      <p style={{ color: 'var(--t2)', lineHeight: '1.7', fontSize: '15px' }}>{selectedProject.description}</p>
                    </section>

                    <section className="mb32">
                      <h3 className="section-sub mb12" style={{ color: 'var(--t1)', fontWeight: '700' }}>Learning Path</h3>
                      <div className="step-list">
                        {selectedProject.steps.map((step, idx) => (
                          <div key={idx} className="step-item">
                            <div className="step-num">{idx + 1}</div>
                            <div className="step-content">
                              <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>{step.title}</h4>
                              <p style={{ fontSize: '14px', color: 'var(--t3)' }}>{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="section-sub mb12" style={{ color: 'var(--t1)', fontWeight: '700' }}>Real-World Use Case</h3>
                      <div className="use-case-box">
                        <BookOpen size={18} color="var(--accent)" />
                        <p>{selectedProject.realWorldUseCase}</p>
                      </div>
                    </section>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="sticky-sidebar">
                      <div className="card mb24" style={{ padding: '24px' }}>
                        <h4 className="mb16" style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Project Stats</h4>
                        <div className="stat-row">
                          <span>Complexity</span>
                          <span style={{ color: getDifficultyColor(selectedProject.difficulty) }}>{selectedProject.difficulty}</span>
                        </div>
                        <div className="stat-row">
                          <span>Timeline</span>
                          <span>{selectedProject.estimatedTime}</span>
                        </div>
                        <div className="stat-row">
                          <span>Resume Boost</span>
                          <span style={{ color: 'var(--orange)', fontWeight: '800' }}>{selectedProject.resumeImpactScore}/10</span>
                        </div>
                        
                        <div className="mt24" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button 
                            className={`btn fw ${getStatusForProject(selectedProject.id) === 'BOOKMARKED' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleUpdateStatus(selectedProject.id, 'BOOKMARKED')}
                          >
                            <Bookmark size={16} /> 
                            {getStatusForProject(selectedProject.id) === 'BOOKMARKED' ? 'Bookmarked' : 'Save for Later'}
                          </button>
                          <button 
                            className={`btn fw ${getStatusForProject(selectedProject.id) === 'IN_PROGRESS' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleUpdateStatus(selectedProject.id, 'IN_PROGRESS')}
                          >
                            <Zap size={16} /> 
                            {getStatusForProject(selectedProject.id) === 'IN_PROGRESS' ? 'In Progress' : 'Start Building'}
                          </button>
                          <button 
                            className={`btn fw ${getStatusForProject(selectedProject.id) === 'COMPLETED' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => handleUpdateStatus(selectedProject.id, 'COMPLETED')}
                          >
                            <CheckCircle size={16} /> 
                            {getStatusForProject(selectedProject.id) === 'COMPLETED' ? 'Completed' : 'Mark as Done'}
                          </button>
                        </div>
                      </div>

                      <div className="card" style={{ padding: '20px' }}>
                        <h4 className="mb12" style={{ fontSize: '13px', fontWeight: '700' }}>Resources</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <a href={selectedProject.githubLink} target="_blank" className="resource-link">
                            <Github size={16} /> Source Code <ExternalLink size={14} />
                          </a>
                          <a href="#" className="resource-link">
                            <Layers size={16} /> Reference Docs <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .project-card {
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          padding: 24px;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          background: var(--bg2);
        }
        .tech-tag {
          font-size: 11px;
          background: var(--bg1);
          color: var(--t3);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--b1);
        }
        .tech-tag-sm {
          font-size: 10px;
          background: rgba(255,255,255,0.05);
          color: var(--t4);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .project-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--b1);
        }
        .project-rec-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .project-rec-card {
          padding: 20px;
          background: linear-gradient(145deg, var(--bg-p), var(--bg1));
          border: 1px solid rgba(249,115,22,0.15);
          cursor: pointer;
        }
        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg2);
          border: 1px solid var(--b1);
          color: var(--t3);
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
        }
        .filter-btn.on {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .project-modal {
          max-width: 900px;
          width: 95%;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .project-modal-body {
          padding: 32px;
          overflow-y: auto;
        }
        .project-icon-large {
          width: 56px;
          height: 56px;
          background: var(--bg2);
          border-radius: 14px;
          display: flex;
          alignItems: center;
          justify-content: center;
          color: var(--accent);
        }
        .step-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .step-item {
          display: flex;
          gap: 16px;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .use-case-box {
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.1);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          gap: 12px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--t2);
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--b1);
          font-size: 13px;
        }
        .resource-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--bg1);
          border: 1px solid var(--b1);
          border-radius: 8px;
          color: var(--t2);
          font-size: 13px;
          text-decoration: none;
        }
        .resource-link:hover {
          background: var(--bg2);
          border-color: var(--accent);
        }
        @media (max-width: 768px) {
          .project-rec-grid { grid-template-columns: 1fr; }
          .project-modal-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const getDomainIcon = (domain, size = 20) => {
  switch (domain) {
    case 'WEB_DEV': return <Code2 size={size} />;
    case 'AI_ML': return <Cpu size={size} />;
    case 'SYSTEM_DESIGN': return <Server size={size} />;
    case 'MOBILE_APP': return <Smartphone size={size} />;
    case 'CYBERSECURITY': return <ShieldCheck size={size} />;
    case 'DATA_SCIENCE': return <Search size={size} />;
    default: return <Layers size={size} />;
  }
};

export default ProjectIdeas;
