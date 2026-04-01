import React from 'react';
import { Code2, Globe, Layers3, Mail, MapPin, Link, Rocket, ShieldCheck, Users } from 'lucide-react';

const projectHighlights = [
  'Placement preparation dashboard with streaks, progress, and practice tracking',
  'Company prep, aptitude, resume builder, mock interviews, and communication practice',
  'Frontend deployed on Vercel and backend deployed on Render',
  'Built as a student-focused platform for campus placement readiness'
];

const techStack = ['React', 'Vite', 'Spring Boot', 'MySQL', 'JWT Authentication', 'Render', 'Vercel'];

const developerDetails = {
  name: 'Ganeshprabhu S',
  role: 'Full Stack Developer',
  location: 'India',
  email: 'gp561910@gmail.com',
  github: 'https://github.com/GANESHPRABHU078',
  linkedin: 'www.linkedin.com/in/ganeshprabhu-csehprabhu-s',
  bio: 'This project was built to help students prepare for placements with one practical workspace for coding, aptitude, resume building, interviews, and communication improvement.'
};

const About = () => {
  return (
    <div className="app-page on" style={{ padding: '28px 28px 40px' }}>
      <div style={{ maxWidth: 1180 }}>
        <div className="section-hdr mb24">
          <div>
            <h1 className="section-title">About PlacementOS</h1>
            <p className="section-sub">Project overview, product direction, and developer details in one place.</p>
          </div>
        </div>

        <div className="g7030">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Project Overview</div>
                  <div className="card-sub">What this platform is built to solve for students.</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 16 }}>
                PlacementOS is a full-stack placement preparation platform designed to bring the most important student workflows into one product. Instead of jumping across multiple websites, users can practice problems, prepare for target companies, build resumes, improve communication, and track interview readiness from one dashboard.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {projectHighlights.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)' }}>
                    <Rocket size={14} style={{ color: 'var(--orange)' }} />
                    <span style={{ fontSize: 13, color: 'var(--t2)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Tech Stack</div>
                  <div className="card-sub">The main tools used to build and deploy the project.</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {techStack.map((item) => (
                  <div key={item} style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--b1)', fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Why This Project Matters</div>
                  <div className="card-sub">The product goal behind the platform.</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {[
                  { icon: Users, title: 'Student Focused', text: 'Built around campus placement preparation, not generic interview prep.' },
                  { icon: ShieldCheck, title: 'Practical Flow', text: 'Combines preparation, progress tracking, and self-review in one workspace.' },
                  { icon: Globe, title: 'Deployed Product', text: 'The project is already live with frontend and backend connected for real users.' }
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} style={{ padding: '16px', borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--b1)' }}>
                    <Icon size={18} style={{ color: 'var(--orange)', marginBottom: 10 }} />
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="card-hdr">
                <div>
                  <div className="card-title">Developer Details</div>
                  <div className="card-sub">Update these placeholders with your personal details if needed.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div className="user-av" style={{ width: 52, height: 52, fontSize: 18 }}>PD</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{developerDetails.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 700 }}>{developerDetails.role}</div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 16 }}>
                {developerDetails.bio}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="faic gap8"><MapPin size={14} /> <span>{developerDetails.location}</span></div>
                <div className="faic gap8"><Mail size={14} /> <span>{developerDetails.email}</span></div>
                <div className="faic gap8"><Link size={14} /> <span>{developerDetails.github}</span></div>
                <div className="faic gap8"><Link size={14} /> <span>{developerDetails.linkedin}</span></div>
              </div>
            </div>

            <div className="card">
              <div className="card-hdr">
                <div className="card-title">Build Summary</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: Code2, text: 'Frontend built with React and Vite for a fast SPA experience.' },
                  { icon: Layers3, text: 'Backend built with Spring Boot for APIs, auth, and user progress features.' },
                  { icon: Rocket, text: 'Designed to keep growing into a stronger placement preparation platform.' }
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)' }}>
                    <Icon size={14} style={{ color: 'var(--green)' }} />
                    <span style={{ fontSize: 13, color: 'var(--t2)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
