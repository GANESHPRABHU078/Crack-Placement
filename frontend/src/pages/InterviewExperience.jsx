import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { MessageSquare, Calendar, Building2, User, Send, Plus } from 'lucide-react';

const getInitial = (value, fallback = '?') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : fallback;
};

const InterviewExperience = () => {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', description: '' });

  useEffect(() => {
    fetchExps();
  }, []);

  const fetchExps = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/interviews/experiences');
      if (!res.data || res.data.length === 0) throw new Error('Empty data');
      setExps(res.data);
    } catch (err) {
      console.warn('Backend unavailable, using mock experiences.', err);
      setExps([
        { id: 1, company: 'Amazon', role: 'SDE-1', date: 'Oct 2024', userName: 'Rahul K.', description: 'The online assessment had 2 coding questions (sliding window and DP) and leadership principles. Round 1 covered OOPs and a system design problem (URL shortener). My advice: communicate your approach clearly before coding.' },
        { id: 2, company: 'Google', role: 'SWE Intern', date: 'Sept 2024', userName: 'Anjali P.', description: 'Consisted of two intense coding rounds back-to-back. The first was focused on graph traversals (BFS). Second question was a hard array manipulation question based on Two Pointers. Keep calm and run through edge cases.' },
        { id: 3, company: 'Microsoft', role: 'Software Engineer', date: 'Aug 2024', userName: 'Harsh V.', description: 'First round was a codility test with 3 scenarios. Technical interviews focused heavily on Operating Systems, threading concepts and object-oriented design patterns. Very good candidate experience.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/interviews/experiences', formData);
      setShowForm(false);
      fetchExps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-page on">
      <div className="section-hdr">
        <div>
          <h1 className="section-title">Interview Experiences Hub</h1>
          <p className="section-sub">Read and share real interview experiences from top companies.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Share Your Experience
        </button>
      </div>

      {showForm && (
        <div className="card mb24">
          <div className="card-hdr">
            <div className="card-title">Share Your Journey</div>
            <button className="tc" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Company</label>
                <div className="input-wrap">
                  <input type="text" placeholder="e.g. Google, Amazon" onChange={(e) => setFormData({...formData, company: e.target.value})} required />
                </div>
              </div>
              <div className="field">
                <label>Role</label>
                <div className="input-wrap">
                  <input type="text" placeholder="e.g. SDE Intern" onChange={(e) => setFormData({...formData, role: e.target.value})} required />
                </div>
              </div>
            </div>
            <div className="field">
              <label>Experience Details</label>
              <textarea 
                className="input-wrap fw" 
                style={{ minHeight: '120px', padding: '12px', background: 'var(--bg2)', border: '1px solid var(--b1)', color: 'var(--t1)', borderRadius: '8px' }}
                placeholder="Talk about the rounds, questions asked, and your advice..."
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary fw">
              <Send size={14} /> Submit Experience
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="tc" style={{ padding: '40px' }}>Loading experiences...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {exps.map((exp) => (
            <div key={exp.id} className="card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div className="auth-logo-ico" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                  {getInitial(exp.company)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="f14 fw7">{exp.company} — {exp.role}</div>
                    <div className="f11 tc faic gap6"><Calendar size={12} /> {exp.date}</div>
                  </div>
                  <div className="f12 tc mb8 faic gap6"><User size={12} /> {exp.userName || 'Anonymous'}</div>
                  <div className="f13 t2c" style={{ lineHeight: '1.6', background: 'var(--bg4)', padding: '12px', borderRadius: '8px' }}>
                    {exp.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewExperience;
