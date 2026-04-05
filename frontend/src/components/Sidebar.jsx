import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  Map,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Award,
  Video,
  Target,
  Sparkles,
  Building2,
  Info,
  History,
  Star,
  Lightbulb
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { label: 'PREPARATION', type: 'label' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'Practice Page', path: '/practice' },
    { icon: Building2, label: 'Company Prep', path: '/company-prep' },
    { icon: BookOpen, label: 'Resume Builder', path: '/resume-builder' },
    { icon: Calculator, label: 'Aptitude Quiz', path: '/aptitude' },
    { icon: Map, label: 'Study Roadmap', path: '/roadmap' },
    { icon: History, label: 'Revision Scheduler', path: '/revision-scheduler' },

    { label: 'OPPORTUNITIES', type: 'label' },
    { icon: Briefcase, label: 'Jobs & Interns', path: '/jobs' },
    { icon: Sparkles, label: 'Recommended Jobs', path: '/recommendations' },
    { icon: Lightbulb, label: 'Project Ideas', path: '/project-ideas' },

    { label: 'PLACEMENT PREP', type: 'label' },
    { icon: GraduationCap, label: 'Interview Exp', path: '/interviews' },
    { icon: Video, label: 'Mock Interviews', path: '/mock-interviews' },
    { icon: MessageSquare, label: 'Communication', path: '/communication' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/ai' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <div className="app-sidebar">
      {menuItems.map((item, idx) => {
        if (item.type === 'label') {
          return <div key={idx} className="sb-lbl mt12">{item.label}</div>;
        }

        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
