import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Flame, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="app-topbar">
      <div className="app-logo" onClick={() => navigate('/')}>
        <div className="app-logo-ico">PO</div>
        <span>PlacementOS</span>
      </div>

      <div className="tb-sep"></div>

      <div className="app-nav">
        <button className="app-nav-btn on">Explore</button>
        <button className="app-nav-btn">Practice</button>
        <button className="app-nav-btn">Contests</button>
        <button className="app-nav-btn">Discuss</button>
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

        <div className="user-av">
          {user.firstName[0]}{user.lastName[0]}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
