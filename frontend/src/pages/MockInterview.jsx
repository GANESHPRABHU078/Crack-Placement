import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Video, Calendar, Clock, User, Plus, CheckCircle } from 'lucide-react';

const MockInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ scheduledTime: '', topic: '' });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/interviews/mock');
      if (!res.data || res.data.length === 0) throw new Error('Empty data');
      setInterviews(res.data);
    } catch (err) {
      console.warn('Backend unavailable, using mock scheduled interviews.', err);
      setInterviews([
        { id: 1, topic: 'Frontend React.js', status: 'Scheduled', scheduledTime: new Date(Date.now() + 86400000).toISOString() },
        { id: 2, topic: 'System Design', status: 'Pending', scheduledTime: new Date(Date.now() + 172800000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/interviews/mock', formData);
      setShowForm(false);
      fetchInterviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-page on">
      <div className="section-hdr">
        <div>
          <h1 className="section-title">Mock Interview Scheduler</h1>
          <p className="section-sub">Practice with peers or mentors to ace your real interviews.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Schedule Mock Session
        </button>
      </div>

      {showForm && (
        <div className="card mb24">
          <div className="card-hdr">
            <div className="card-title">Schedule New Session</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Topic / Role</label>
                <div className="input-wrap">
                  <input type="text" placeholder="e.g. Java SDE, React Frontend" onChange={(e) => setFormData({...formData, topic: e.target.value})} required />
                </div>
              </div>
              <div className="field">
                <label>Date & Time</label>
                <div className="input-wrap">
                  <input type="datetime-local" onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})} required />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary fw">
              <Calendar size={14} /> Book Session
            </button>
          </form>
        </div>
      )}

      <div className="g2">
        {loading ? (
          <div className="tc" style={{ gridColumn: '1/-1', padding: '40px' }}>Loading sessions...</div>
        ) : (
          interviews.map((int) => (
            <div key={int.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="badge bc faic gap6"><Video size={12} /> {int.topic}</div>
                <div className={`badge ${int.status === 'Scheduled' ? 'bg' : 'bdark'}`}>{int.status}</div>
              </div>
              
              <div className="f14 fw7 mb8">{int.topic} Practice Session</div>
              <div className="f12 tc mb12 faic gap8">
                <div className="faic gap4"><Calendar size={14} /> {new Date(int.scheduledTime).toLocaleDateString()}</div>
                <div className="faic gap4"><Clock size={14} /> {new Date(int.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div className="divider" style={{ margin: '12px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="faic gap8">
                  <div className="user-av" style={{ width: '24px', height: '24px', fontSize: '9px' }}>AI</div>
                  <span className="f11 tc">Mentor: AI Assistant</span>
                </div>
                <button className="btn btn-ghost btn-sm">Join Call</button>
              </div>
            </div>
          ))
        )}
        
        {interviews.length === 0 && !loading && (
          <div className="card ta-c" style={{ gridColumn: '1/-1', padding: '40px' }}>
            <div className="mb12" style={{ fontSize: '32px' }}>🗓️</div>
            <div className="f14 fw7 mb4">No mock interviews scheduled</div>
            <p className="f12 tc mb16">Start by booking a session with a peer or our AI mentor.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Schedule Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
