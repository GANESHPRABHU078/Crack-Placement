import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, CheckCircle2, Globe, Eye, EyeOff } from 'lucide-react';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const loadGoogleScript = () => {
  const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
  if (existing) {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
  const googleButtonRef = React.useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  console.log("[DIAGNOSTIC] Current Google Client ID:", googleClientId ? googleClientId.substring(0, 10) + "..." : "NOT_FOUND");

  const { login, register, loginWithGoogle } = useAuth();
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

  React.useEffect(() => {
    if (!isLogin || !googleClientId || !googleButtonRef.current) {
      return undefined;
    }

    let cancelled = false;

    const renderGoogleButton = async () => {
      try {
        await loadGoogleScript();
        if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        console.log("[DIAGNOSTIC] Initializing Google with ID:", googleClientId ? googleClientId.substring(0, 10) + "..." : "MISSING");
        console.log("[DIAGNOSTIC] Current Origin:", window.location.origin);

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async ({ credential }) => {
            if (!credential) {
              setError('Google sign-in could not be completed.');
              return;
            }

            setLoading(true);
            setError('');
            try {
              await loginWithGoogle(credential);
              navigate('/dashboard');
            } catch (err) {
              setError(err.response?.data?.message || 'Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 320,
        });
      } catch (scriptError) {
        setError('Google sign-in is unavailable right now.');
      }
    };

    renderGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [googleClientId, loginWithGoogle, navigate]);

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
          <div className="auth-sub">Practice DSA, crack aptitude, build projects, track progress, and land the job - 100% free, forever.</div>

          <div className="auth-feature">
            <div className="af-icon afi-o"><CheckCircle2 size={16} /></div>
            <div className="af-text"><b>LeetCode-style coding</b> - Integrated with Spring Boot & MySQL.</div>
          </div>
          <div className="auth-feature">
            <div className="af-icon afi-g"><Globe size={16} /></div>
            <div className="af-text"><b>Live job board</b> - Real-time updates from our backend API.</div>
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
            <div className="auth-heading">{isLogin ? 'Welcome back' : 'Create your account'}</div>
            <div className="auth-subhead">{isLogin ? 'Sign in to continue your placement journey.' : 'Step 1 of 1 - Start your journey for free.'}</div>

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
              <div className="input-wrap" style={{ position: 'relative' }}>
                <span className="input-ico"><Lock size={14} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="********"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--t3)',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                        <option value="">Select Branch</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="ME">ME</option>
                        <option value="CE">CE</option>
                        <option value="BE">BE</option>
                        <option value="BT">BT</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Grad Year</label>
                    <div className="input-wrap">
                      <select id="gradYear" onChange={handleChange} style={{ paddingLeft: '38px' }}>
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              <span className="btn-txt">{isLogin ? 'Sign In ->' : 'Create Account ->'}</span>
              <div className="btn-spinner"></div>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
              <span style={{ color: 'var(--t4)', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase' }}>Or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
            </div>

            {googleClientId ? (
              <div
                ref={googleButtonRef}
                style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}
              />
            ) : (
              <div className="field-err show" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#bfdbfe' }}>
                Set `VITE_GOOGLE_CLIENT_ID` to enable Google sign-in.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
