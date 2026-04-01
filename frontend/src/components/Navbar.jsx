import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Flame, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navItems = [
    { label: 'Explore', path: '/dashboard' },
    { label: 'Practice', path: '/practice' },
    { label: 'Contests', path: '/contests' },
    { label: 'Discuss', path: '/community' },
    { label: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="app-topbar">
      <div className="app-logo" onClick={() => navigate('/')}>
        <div className="app-logo-ico">PO</div>
        <span>PlacementOS</span>
      </div>

      <div className="tb-sep"></div>

      <div className="app-nav">
        {navItems.map((item) => (
          <button key={item.path} className="app-nav-btn" onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="tb-right">
        <span className="free-badge">Pro Plan</span>

        <button className="notif-btn">
          <Bell size={18} />
          <div className="notif-dot"></div>
        </button>

        <div className="streak-chip">
          <Flame size={14} fill="currentColor" />
          <span>{user.currentStreak} days</span>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="user-av"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
            style={{ cursor: 'pointer' }}
          >
            {user.firstName[0]}{user.lastName[0]}
          </button>
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'var(--bg1)',
              border: '1px solid var(--b1)',
              borderRadius: '8px',
              minWidth: '180px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              marginTop: '8px'
            }}>
              <div style={{ padding: '12px', borderBottom: '1px solid var(--b1)' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--t1)' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>
                  {user.email}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--t2)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 0
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--bg2)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                <User size={14} />
                My Profile
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--red)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 0,
                  borderTop: '1px solid var(--b1)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--bg2)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
