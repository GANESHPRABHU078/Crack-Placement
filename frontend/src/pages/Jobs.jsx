import React, { useState, useEffect } from 'react';
import { jobService } from '../api/jobService';
import { Search, Briefcase, MapPin, DollarSign, ExternalLink, Heart } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAll(filter);
      if (!data || data.length === 0) throw new Error('Empty jobs data');
      setJobs(data);
    } catch (err) {
      console.warn('Backend unavailable, using mock jobs.', err);
      setJobs([
        { id: '1', title: 'Software Engineering Intern', company: 'Google', location: 'Bangalore', type: 'Internship', salary: '₹1,00,000/mo', skills: ['C++', 'Python', 'DSA'], logoEmoji: '🚀', applyLink: '#', new: true },
        { id: '2', title: 'SDE-1 (Frontend)', company: 'Amazon', location: 'Hyderabad', type: 'FullTime', salary: '₹24 - 32 LPA', skills: ['React', 'JavaScript', 'AWS'], logoEmoji: '📦', applyLink: '#', new: true },
        { id: '3', title: 'Backend Developer', company: 'Microsoft', location: 'Remote', type: 'FullTime', salary: '₹20 - 28 LPA', skills: ['C#', 'SQL', '.NET'], logoEmoji: '💻', applyLink: '#', new: false },
        { id: '4', title: 'Data Science Intern', company: 'Uber', location: 'Remote', type: 'Internship', salary: '₹80,000/mo', skills: ['Python', 'SQL', 'ML'], logoEmoji: '🚗', applyLink: '#', new: false }
      ].filter(j => !filter || j.type === filter));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page on">
      <div className="section-hdr">
        <div>
          <h1 className="section-title">Jobs & Internships</h1>
          <p className="section-sub">Curated openings for 2024, 2025, and 2026 graduates.</p>
        </div>
      </div>

      <div className="card mb24" style={{ padding: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="input-wrap" style={{ flex: 1 }}>
            <span className="input-ico"><Search size={14} /></span>
            <input type="text" placeholder="Search by role, company, or keywords..." style={{ paddingLeft: '38px' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'FullTime', 'Internship', 'Remote'].map((f) => (
              <button 
                key={f}
                className={`btn btn-sm ${filter === (f === 'All' ? '' : f) ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f === 'All' ? '' : f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="g3">
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--t3)' }}>Loading jobs...</div>
        ) : (
          jobs.map((j) => (
            <div key={j.id} className="job-card">
              <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'flex-start' }}>
                <div className="job-logo">{j.logoEmoji}</div>
                {j.new && <span className="badge br">NEW</span>}
              </div>
              
              <h3 className="job-title mt8">{j.title}</h3>
              <p className="job-co">{j.company}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                <span className="badge bdark"><MapPin size={10} /> {j.location}</span>
                <span className="badge bdark"><Briefcase size={10} /> {j.type}</span>
                <span className="badge bdark"><DollarSign size={10} /> {j.salary}</span>
              </div>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {j.skills?.map((s, i) => (
                  <span key={i} className="badge bc">{s}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={j.applyLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm fw" style={{ textDecoration: 'none' }}>
                  <span>Apply Now</span>
                  <ExternalLink size={12} />
                </a>
                <button className="btn btn-ghost btn-sm">
                  <Heart size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
