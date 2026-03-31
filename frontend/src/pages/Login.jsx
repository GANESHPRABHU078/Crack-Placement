import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, CheckCircle2, Globe } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    college: '',
    branch: '',
    gradYear: '',
    primaryGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen active" id="s-auth">
      <div className="auth-left">
        <div className="auth-blob ab1"></div>
        <div className="auth-blob ab2"></div>
        <div className="auth-blob ab3"></div>
        <div className="auth-grid"></div>
        <div className="auth-top">
          <div className="auth-logo">
            <div className="auth-logo-ico">PO</div>
            <div>
              <div className="auth-logo-name">PlacementOS</div>
              <div style={{ fontSize: '9px', color: 'var(--t4)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '1px' }}>Full Stack Platform</div>
            </div>
          </div>
          <div className="auth-tagline">Your path to<br /><span className="hl">dream companies</span><br />starts here.</div>
          <div className="auth-sub">Practice DSA, crack aptitude, build projects, track progress, and land the job — 100% free, forever.</div>

          <div className="auth-feature">
            <div className="af-icon afi-o"><CheckCircle2 size={16} /></div>
            <div className="af-text"><b>LeetCode-style coding</b> — Integrated with Spring Boot & MySQL.</div>
          </div>
          <div className="auth-feature">
            <div className="af-icon afi-g"><Globe size={16} /></div>
            <div className="af-text"><b>Live job board</b> — Real-time updates from our backend API.</div>
          </div>
        </div>
        <div className="auth-bottom">
          <div className="auth-stats">
            <div><div className="as-num">28K+</div><div className="as-lbl">Active students</div></div>
            <div><div className="as-num">4,200</div><div className="as-lbl">Placements</div></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? 'on' : ''}`} onClick={() => setIsLogin(true)}>Sign In</button>
            <button className={`auth-tab ${!isLogin ? 'on' : ''}`} onClick={() => setIsLogin(false)}>Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-view on">
            <div className="auth-heading">{isLogin ? 'Welcome back 👋' : 'Create your account'}</div>
            <div className="auth-subhead">{isLogin ? 'Sign in to continue your placement journey.' : 'Step 1 of 1 — Start your journey for free.'}</div>

            {error && <div className="field-err show mb16">{error}</div>}

            {!isLogin && (
              <div className="field-row">
                <div className="field">
                  <label>First name</label>
                  <div className="input-wrap">
                    <span className="input-ico"><UserIcon size={14} /></span>
                    <input type="text" id="firstName" placeholder="Arjun" onChange={handleChange} required />
                  </div>
                </div>
                <div className="field">
                  <label>Last name</label>
                  <div className="input-wrap">
                    <span className="input-ico"><UserIcon size={14} /></span>
                    <input type="text" id="lastName" placeholder="Kumar" onChange={handleChange} required />
                  </div>
                </div>
              </div>
            )}

            <div className="field">
              <label>Email address</label>
              <div className="input-wrap">
                <span className="input-ico"><Mail size={14} /></span>
                <input type="email" id="email" placeholder="you@college.edu" onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-ico"><Lock size={14} /></span>
                <input type="password" id="password" placeholder="••••••••" onChange={handleChange} required />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="field">
                  <label>College</label>
                  <div className="input-wrap">
                    <span className="input-ico"><Globe size={14} /></span>
                    <input type="text" id="college" placeholder="IIT Madras" onChange={handleChange} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Branch</label>
                    <div className="input-wrap">
                      <select id="branch" onChange={handleChange} style={{ paddingLeft: '38px' }}>
                        <option value="">Select</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Grad Year</label>
                    <div className="input-wrap">
                      <select id="gradYear" onChange={handleChange} style={{ paddingLeft: '38px' }}>
                        <option value="">Year</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              <span className="btn-txt">{isLogin ? 'Sign In →' : 'Create Account →'}</span>
              <div className="btn-spinner"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
