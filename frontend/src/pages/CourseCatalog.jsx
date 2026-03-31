import React, { useState } from 'react';
import { Star, Clock, Users, PlayCircle, BookOpen, Search, ChevronRight, Zap } from 'lucide-react';

const categories = ['All', 'DSA', 'System Design', 'Web Dev', 'Machine Learning', 'CS Fundamentals'];

const courses = [
    { id: 1, title: 'DSA Masterclass — From Zero to FAANG', instructor: 'Striver', rating: 4.9, reviews: 12400, students: 84200, hours: 48, level: 'Beginner', cat: 'DSA', price: 999, orig: 4999, tags: ['Arrays', 'DP', 'Graphs'], color: 'var(--orange)', bestseller: true },
    { id: 2, title: 'System Design Interview Handbook', instructor: 'Gaurav Sen', rating: 4.8, reviews: 8700, students: 51000, hours: 36, level: 'Advanced', cat: 'System Design', price: 1299, orig: 5999, tags: ['HLD', 'LLD', 'Scalability'], color: 'var(--purple)' },
    { id: 3, title: 'Full Stack Web Development Bootcamp', instructor: 'Harkirat Singh', rating: 4.7, reviews: 6300, students: 38000, hours: 72, level: 'Intermediate', cat: 'Web Dev', price: 1499, orig: 6999, tags: ['React', 'Node', 'MongoDB'], color: 'var(--blue)' },
    { id: 4, title: 'Machine Learning A-Z with Python', instructor: 'Krish Naik', rating: 4.8, reviews: 9200, students: 62000, hours: 55, level: 'Intermediate', cat: 'Machine Learning', price: 1199, orig: 5499, tags: ['Python', 'ML', 'Deep Learning'], color: 'var(--easy)' },
    { id: 5, title: 'Operating Systems Demystified', instructor: 'Gate Smashers', rating: 4.6, reviews: 4100, students: 28000, hours: 24, level: 'Beginner', cat: 'CS Fundamentals', price: 699, orig: 2999, tags: ['OS', 'DBMS', 'Networks'], color: 'var(--med)' },
    { id: 6, title: 'Advanced Data Structures & Competitive Programming', instructor: 'Errichto', rating: 4.9, reviews: 5600, students: 31000, hours: 40, level: 'Advanced', cat: 'DSA', price: 1099, orig: 4299, tags: ['Segment Tree', 'Trie', 'Flows'], color: 'var(--hard)' },
];

const levelColor = { Beginner: 'var(--easy)', Intermediate: 'var(--med)', Advanced: 'var(--hard)' };
const levelBg = { Beginner: 'var(--easy-d)', Intermediate: 'var(--med-d)', Advanced: 'var(--hard-d)' };

const Stars = ({ rating }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={11} fill={s <= Math.round(rating) ? '#FFD700' : 'none'} stroke={s <= Math.round(rating) ? '#FFD700' : 'var(--t4)'} />
        ))}
        <span style={{ color: '#FFD700', fontWeight: 800, fontSize: 12, marginLeft: 2 }}>{rating}</span>
        <span style={{ color: 'var(--t3)', fontSize: 11 }}>({(rating >= 10000 ? (rating / 1000).toFixed(0) + 'k' : rating.toLocaleString())})</span>
    </span>
);

const CourseCatalog = () => {
    const [cat, setCat] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = courses.filter(c =>
        (cat === 'All' || c.cat === cat) &&
        (search === '' || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="app-page on" style={{ padding: '28px 28px 48px' }}>
            <div style={{ maxWidth: 1100 }}>

                {/* header */}
                <div className="section-hdr mb28">
                    <div>
                        <h1 className="section-title">Course Catalog</h1>
                        <p className="section-sub">Expert-led courses from India's top educators. Learn. Practice. Get placed.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 14px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 8 }}>
                        <Zap size={13} style={{ color: 'var(--orange)' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)' }}>Pro Plan: All Courses Free</span>
                    </div>
                </div>

                {/* stats row */}
                <div className="g4 mb28">
                    {[
                        { label: 'Courses Available', val: '120+', color: 'var(--orange)' },
                        { label: 'Total Students', val: '2.8L+', color: 'var(--purple)' },
                        { label: 'Hours of Content', val: '4,000+', color: 'var(--easy)' },
                        { label: 'Avg Rating', val: '4.8 ⭐', color: 'var(--med)' },
                    ].map(({ label, val, color }) => (
                        <div key={label} style={{ padding: '16px 18px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, textAlign: 'center', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = color + '30'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: -0.5, marginBottom: 4 }}>{val}</div>
                            <div style={{ fontSize: 11, color: 'var(--t2)' }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* search & filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 10, padding: '8px 14px' }}>
                        <Search size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontSize: 13, fontFamily: 'var(--sans)' }} />
                    </div>
                    <select style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 10, color: 'var(--t1)', fontSize: 12, outline: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                        <option>All Levels</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                {/* category tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 16px', borderRadius: 100, border: `1px solid ${cat === c ? 'var(--orange)' : 'var(--b2)'}`, background: cat === c ? 'var(--orange-d)' : 'transparent', color: cat === c ? 'var(--orange)' : 'var(--t3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* course grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
                    {filtered.map(course => (
                        <div key={course.id} style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = course.color + '35'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${course.color}0A`; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                            {/* thumbnail */}
                            <div style={{ height: 140, background: `linear-gradient(135deg, ${course.color}20 0%, var(--bg4) 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: course.color + '20', border: `1px solid ${course.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={26} style={{ color: course.color }} />
                                </div>
                                {course.bestseller && (
                                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#FFD700', color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 9px', borderRadius: 4, letterSpacing: '0.05em' }}>BESTSELLER</div>
                                )}
                                <div style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PlayCircle size={18} style={{ color: '#fff' }} />
                                </div>
                            </div>

                            <div style={{ padding: '16px 18px' }}>
                                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: 4, background: levelBg[course.level], color: levelColor[course.level], fontSize: 10, fontWeight: 800 }}>{course.level}</span>
                                    <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--bg4)', color: 'var(--t3)', fontSize: 10, border: '1px solid var(--b1)' }}>{course.cat}</span>
                                </div>

                                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{course.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>by {course.instructor}</div>

                                <div style={{ marginBottom: 10 }}><Stars rating={course.rating} /></div>

                                <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--t3)', marginBottom: 14 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {course.hours}h</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> {(course.students / 1000).toFixed(0)}k+ students</span>
                                </div>

                                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                                    {course.tags.map(t => <span key={t} style={{ padding: '2px 8px', borderRadius: 4, background: course.color + '10', color: course.color, fontSize: 10, fontWeight: 600, border: `1px solid ${course.color}20` }}>{t}</span>)}
                                </div>

                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--easy)' }}>₹{course.price}</span>
                                        <span style={{ fontSize: 12, color: 'var(--t3)', textDecoration: 'line-through', marginLeft: 8 }}>₹{course.orig}</span>
                                    </div>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', background: 'var(--grad-o)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 4px 12px rgba(249,115,22,0.3)', transition: 'all 0.15s' }}
                                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(249,115,22,0.45)'; }}
                                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.3)'; }}>
                                        Enroll <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--t3)' }}>
                        <BookOpen size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No courses found</div>
                        <div style={{ fontSize: 13 }}>Try a different search or category.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalog;
