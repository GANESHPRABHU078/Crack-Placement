import React from 'react';
import { useLocation } from 'react-router-dom';
import { Map, Trophy, Sparkles, Users, BookOpen, Construction } from 'lucide-react';

const pageConfig = {
    '/roadmap': { icon: Map, title: 'Study Roadmap', sub: 'Structured learning paths for cracking top companies.', color: 'var(--blue)', bg: 'var(--blue-d)' },
    '/contests': { icon: Trophy, title: 'Contests', sub: 'Weekly coding contests with leaderboards and prizes.', color: 'var(--med)', bg: 'var(--med-d)' },
    '/ai': { icon: Sparkles, title: 'AI Assistant', sub: 'Your 24/7 AI mentor for doubt solving and code review.', color: 'var(--purple)', bg: 'var(--p-d)' },
    '/community': { icon: Users, title: 'Community', sub: 'Connect with peers, share resources, build together.', color: 'var(--easy)', bg: 'var(--easy-d)' },
    '/courses': { icon: BookOpen, title: 'Course Catalog', sub: 'Expert-led video courses for every skill level.', color: 'var(--orange)', bg: 'var(--orange-d)' },
};

const ComingSoon = () => {
    const { pathname } = useLocation();
    const cfg = pageConfig[pathname] || { icon: Construction, title: 'Coming Soon', sub: 'This page is under construction.', color: 'var(--t2)', bg: 'var(--bg4)' };
    const Icon = cfg.icon;

    return (
        <div className="app-page on" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 0 24px ${cfg.color}22` }}>
                    <Icon size={32} style={{ color: cfg.color }} />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>{cfg.title}</h1>
                <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 32 }}>{cfg.sub}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 100, padding: '8px 20px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Coming Soon — We're building this feature</span>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
