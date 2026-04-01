import React, { useRef, useState } from 'react';
import { Save, Printer, Plus, Trash2, ChevronDown, ChevronUp, Activity, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { downloadResumePdf } from '../utils/resumePdf';

const ResumeBuilder = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showAts, setShowAts] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState([]);
  const [downloadMessage, setDownloadMessage] = useState('');
  const resumePreviewRef = useRef(null);

  const [resume, setResume] = useState({
    personal: { name: 'Arjun Kumar', email: 'arjun@college.edu', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/arjunkumar', github: 'github.com/arjuncodes' },
    education: [{ school: 'Indian Institute of Technology, Madras', degree: 'Bachelor of Technology in Computer Science', date: 'Aug 2021 - May 2025', location: 'Chennai, TN', gpa: '9.2/10.0' }],
    experience: [{ company: 'Google', role: 'Software Engineering Intern', location: 'Bengaluru, KA', date: 'May 2024 - Aug 2024', desc: '• Engineered a scalable microservices architecture using Spring Boot, reducing API latency by 20%.\n• Collaborated with cross-functional teams to integrate a new Kafka-based messaging queue.\n• Developed and deployed Docker containers to AWS ECS.' }],
    projects: [{ name: 'PlacementOS', tech: 'React, Spring Boot, MySQL', date: 'Jan 2024 - Present', desc: '• Built a comprehensive full-stack platform for placement preparation serving 28,000+ students.\n• Implemented an integrated LeetCode-style code execution engine.\n• Designed an ATS-friendly resume builder and an interactive dashboard track progress.' }],
    skills: { languages: 'Java, C++, Python, JavaScript, TypeScript', frameworks: 'React, Spring Boot, Node.js, Express', tools: 'Git, Docker, AWS, MySQL, MongoDB' }
  });

  const handleChange = (sec, idx, field, val) => {
    const newResume = { ...resume };
    if (idx === null) newResume[sec][field] = val;
    else newResume[sec][idx][field] = val;
    setResume(newResume);
  };

  const addItem = (sec, template) => {
    setResume({ ...resume, [sec]: [...resume[sec], template] });
  };

  const removeItem = (sec, idx) => {
    const newResume = { ...resume };
    newResume[sec].splice(idx, 1);
    setResume(newResume);
  };

  const toggleSection = (sec) => {
    setActiveSection(activeSection === sec ? '' : sec);
  };

  const calculateAtsScore = () => {
    let score = 0;
    const feedback = [];

    // Personal (20 pts)
    if (resume.personal.email && resume.personal.phone) {
      score += 10;
    } else {
      feedback.push({ type: 'warning', text: 'Missing email or phone number.' });
    }
    if (resume.personal.linkedin || resume.personal.github) {
      score += 10;
    } else {
      feedback.push({ type: 'warning', text: 'Add LinkedIn or GitHub for better visibility.' });
    }

    // Education (15 pts)
    if (resume.education.length > 0 && resume.education[0].school) {
      score += 10;
      if (resume.education[0].gpa) score += 5;
      else feedback.push({ type: 'warning', text: 'Consider adding your GPA if it is above 3.0 or 8.0/10.' });
    } else {
      feedback.push({ type: 'error', text: 'Education section is empty.' });
    }

    // Experience (35 pts)
    if (resume.experience.length > 0 && resume.experience[0].company) {
      score += 15;
      let hasNumbers = false;
      let hasActionVerbs = false;
      resume.experience.forEach(exp => {
        if (/\d|%/.test(exp.desc)) hasNumbers = true;
        if (/aged|ered|ped|zed|ted|ed\b/i.test(exp.desc)) hasActionVerbs = true;
      });
      if (hasNumbers) score += 10;
      else feedback.push({ type: 'warning', text: 'Use numbers/metrics in Work Experience to quantify impact.' });
      if (hasActionVerbs) score += 10;
      else feedback.push({ type: 'warning', text: 'Start bullet points with strong action verbs (e.g. Developed, Managed).' });
    } else {
      feedback.push({ type: 'error', text: 'Add at least one relevant work experience.' });
    }

    // Projects (20 pts)
    if (resume.projects.length > 0 && resume.projects[0].name) {
      score += 15;
      if (resume.projects[0].tech) score += 5;
      else feedback.push({ type: 'warning', text: 'Mention the tech stack used in your projects.' });
    } else {
      feedback.push({ type: 'warning', text: 'Adding personal projects can significantly boost your profile.' });
    }

    // Skills (10 pts)
    if (resume.skills.languages || resume.skills.frameworks || resume.skills.tools) {
      score += 10;
    } else {
      feedback.push({ type: 'error', text: 'Add technical skills to pass ATS keyword filters.' });
    }

    if (score === 100 && feedback.length === 0) {
      feedback.push({ type: 'success', text: 'Excellent! Your resume is highly optimized for ATS.' });
    }

    setAtsScore(score);
    setAtsFeedback(feedback);
    setShowAts(true);
  };

  const handleDownloadPdf = () => {
    downloadResumePdf(resume);
    setDownloadMessage('PDF download started.');
  };

  const handlePrintResume = () => {
    const resumeHtml = resumePreviewRef.current?.outerHTML;
    if (!resumeHtml) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      setDownloadMessage('Popup blocked. Please allow popups to print the resume.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Print Preview</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
            }
            .resume-a4-preview {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 auto !important;
              box-shadow: none !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${resumeHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setDownloadMessage('Opened a clean print view for the resume.');
  };

  return (
    <div className="app-page on" style={{ display: 'flex', gap: '24px', padding: '24px' }}>

      {/* Scrollable Editor Form (Left side) */}
      <div style={{ flex: '1 1 45%', overflowY: 'auto', paddingRight: '8px', maxWidth: '600px' }}>
        <div className="section-hdr mb24">
          <div>
            <h1 className="section-title">Resume Builder</h1>
            <p className="section-sub">Create your ATS-friendly tech resume in minutes.</p>
            {downloadMessage && <p style={{ fontSize: '12px', color: 'var(--orange)', marginTop: '6px' }}>{downloadMessage}</p>}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--orange)', borderColor: 'var(--orange-d)' }} onClick={calculateAtsScore}>
              <Activity size={14} /> Check ATS Score
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handlePrintResume}>
              <Printer size={14} /> Print Resume
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleDownloadPdf}>
              <Download size={14} /> Download PDF
            </button>
            <button className="btn btn-ghost btn-sm">
              <Save size={14} /> Save Data
            </button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="card mb16">
          <div className="card-hdr" style={{ cursor: 'pointer', marginBottom: activeSection === 'personal' ? '16px' : '0' }} onClick={() => toggleSection('personal')}>
            <div className="card-title">Personal Details</div>
            {activeSection === 'personal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {activeSection === 'personal' && (
            <div className="field-row">
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <label>Full Name</label>
                <div className="input-wrap">
                  <input type="text" value={resume.personal.name} onChange={(e) => handleChange('personal', null, 'name', e.target.value)} />
                </div>
              </div>
              <div className="field"><label>Email</label><div class="input-wrap"><input type="email" value={resume.personal.email} onChange={(e) => handleChange('personal', null, 'email', e.target.value)} /></div></div>
              <div className="field"><label>Phone</label><div class="input-wrap"><input type="text" value={resume.personal.phone} onChange={(e) => handleChange('personal', null, 'phone', e.target.value)} /></div></div>
              <div className="field"><label>LinkedIn</label><div class="input-wrap"><input type="text" value={resume.personal.linkedin} onChange={(e) => handleChange('personal', null, 'linkedin', e.target.value)} /></div></div>
              <div className="field"><label>GitHub</label><div class="input-wrap"><input type="text" value={resume.personal.github} onChange={(e) => handleChange('personal', null, 'github', e.target.value)} /></div></div>
            </div>
          )}
        </div>

        <div className="card mb16">
          <div className="card-hdr" style={{ cursor: 'pointer', marginBottom: activeSection === 'education' ? '16px' : '0' }} onClick={() => toggleSection('education')}>
            <div className="card-title">Education</div>
            {activeSection === 'education' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {activeSection === 'education' && (
            <>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb16" style={{ paddingBottom: '16px', borderBottom: i < resume.education.length - 1 ? '1px solid var(--b1)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>Education #{i + 1}</div>
                    <button className="tc hover-red transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeItem('education', i)}><Trash2 size={14} /></button>
                  </div>
                  <div className="field-row mb12">
                    <div className="field"><label>University / School</label><div class="input-wrap"><input type="text" value={edu.school} onChange={(e) => handleChange('education', i, 'school', e.target.value)} /></div></div>
                    <div className="field"><label>Location</label><div class="input-wrap"><input type="text" value={edu.location} onChange={(e) => handleChange('education', i, 'location', e.target.value)} /></div></div>
                    <div className="field" style={{ gridColumn: 'span 2' }}><label>Degree / Branch</label><div class="input-wrap"><input type="text" value={edu.degree} onChange={(e) => handleChange('education', i, 'degree', e.target.value)} /></div></div>
                    <div className="field"><label>Date (e.g. Aug 2021 - May 2025)</label><div class="input-wrap"><input type="text" value={edu.date} onChange={(e) => handleChange('education', i, 'date', e.target.value)} /></div></div>
                    <div className="field"><label>GPA</label><div class="input-wrap"><input type="text" value={edu.gpa} onChange={(e) => handleChange('education', i, 'gpa', e.target.value)} /></div></div>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm fw" onClick={() => addItem('education', { school: '', degree: '', date: '', location: '', gpa: '' })}>
                <Plus size={14} /> Add Education
              </button>
            </>
          )}
        </div>

        <div className="card mb16">
          <div className="card-hdr" style={{ cursor: 'pointer', marginBottom: activeSection === 'experience' ? '16px' : '0' }} onClick={() => toggleSection('experience')}>
            <div className="card-title">Work Experience</div>
            {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {activeSection === 'experience' && (
            <>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb16" style={{ paddingBottom: '16px', borderBottom: i < resume.experience.length - 1 ? '1px solid var(--b1)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>Experience #{i + 1}</div>
                    <button className="tc hover-red transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeItem('experience', i)}><Trash2 size={14} /></button>
                  </div>
                  <div className="field-row mb12">
                    <div className="field"><label>Company</label><div class="input-wrap"><input type="text" value={exp.company} onChange={(e) => handleChange('experience', i, 'company', e.target.value)} /></div></div>
                    <div className="field"><label>Location</label><div class="input-wrap"><input type="text" value={exp.location} onChange={(e) => handleChange('experience', i, 'location', e.target.value)} /></div></div>
                    <div className="field"><label>Role / Title</label><div class="input-wrap"><input type="text" value={exp.role} onChange={(e) => handleChange('experience', i, 'role', e.target.value)} /></div></div>
                    <div className="field"><label>Dates</label><div class="input-wrap"><input type="text" value={exp.date} onChange={(e) => handleChange('experience', i, 'date', e.target.value)} /></div></div>
                  </div>
                  <div className="field"><label>Description (bullet points, split by newlines)</label><div class="input-wrap"><textarea style={{ width: '100%', minHeight: '80px', background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: '8px', color: 'var(--t1)', padding: '10px 12px', resize: 'vertical' }} value={exp.desc} onChange={(e) => handleChange('experience', i, 'desc', e.target.value)} /></div></div>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm fw" onClick={() => addItem('experience', { company: '', role: '', location: '', date: '', desc: '• ' })}>
                <Plus size={14} /> Add Experience
              </button>
            </>
          )}
        </div>

        <div className="card mb16">
          <div className="card-hdr" style={{ cursor: 'pointer', marginBottom: activeSection === 'projects' ? '16px' : '0' }} onClick={() => toggleSection('projects')}>
            <div className="card-title">Projects</div>
            {activeSection === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {activeSection === 'projects' && (
            <>
              {resume.projects.map((proj, i) => (
                <div key={i} className="mb16" style={{ paddingBottom: '16px', borderBottom: i < resume.projects.length - 1 ? '1px solid var(--b1)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>Project #{i + 1}</div>
                    <button className="tc hover-red transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeItem('projects', i)}><Trash2 size={14} /></button>
                  </div>
                  <div className="field-row mb12">
                    <div className="field" style={{ gridColumn: 'span 2' }}><label>Project Name</label><div class="input-wrap"><input type="text" value={proj.name} onChange={(e) => handleChange('projects', i, 'name', e.target.value)} /></div></div>
                    <div className="field"><label>Tech Stack</label><div class="input-wrap"><input type="text" value={proj.tech} onChange={(e) => handleChange('projects', i, 'tech', e.target.value)} /></div></div>
                    <div className="field"><label>Date (Optional)</label><div class="input-wrap"><input type="text" value={proj.date} onChange={(e) => handleChange('projects', i, 'date', e.target.value)} /></div></div>
                  </div>
                  <div className="field"><label>Description (bullet points, split by newlines)</label><div class="input-wrap"><textarea style={{ width: '100%', minHeight: '80px', background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: '8px', color: 'var(--t1)', padding: '10px 12px', resize: 'vertical' }} value={proj.desc} onChange={(e) => handleChange('projects', i, 'desc', e.target.value)} /></div></div>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm fw" onClick={() => addItem('projects', { name: '', tech: '', date: '', desc: '• ' })}>
                <Plus size={14} /> Add Project
              </button>
            </>
          )}
        </div>

        <div className="card mb24">
          <div className="card-hdr" style={{ cursor: 'pointer', marginBottom: activeSection === 'skills' ? '16px' : '0' }} onClick={() => toggleSection('skills')}>
            <div className="card-title">Technical Skills</div>
            {activeSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {activeSection === 'skills' && (
            <div className="field-row">
              <div className="field" style={{ gridColumn: 'span 2' }}><label>Languages</label><div class="input-wrap"><input type="text" value={resume.skills.languages} onChange={(e) => handleChange('skills', null, 'languages', e.target.value)} /></div></div>
              <div className="field" style={{ gridColumn: 'span 2' }}><label>Frameworks</label><div class="input-wrap"><input type="text" value={resume.skills.frameworks} onChange={(e) => handleChange('skills', null, 'frameworks', e.target.value)} /></div></div>
              <div className="field" style={{ gridColumn: 'span 2' }}><label>Developer Tools</label><div class="input-wrap"><input type="text" value={resume.skills.tools} onChange={(e) => handleChange('skills', null, 'tools', e.target.value)} /></div></div>
            </div>
          )}
        </div>
      </div>

      {/* A4 Resume Preview (Right side) */}
      <div style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#e0e0e0', padding: '30px', borderRadius: '12px', overflowY: 'auto', border: '1px solid var(--b2)', position: 'relative' }}>

        {/* ATS Score Checker Overlay */}
        {showAts && (
          <div style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '500px', background: 'var(--bg1)', borderRadius: '12px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 10, border: '1px solid var(--b2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--t1)', marginBottom: '4px' }}>ATS Compatibility Score</h2>
                <p style={{ fontSize: '13px', color: 'var(--t3)' }}>Based on industry standard parsing algorithms.</p>
              </div>
              <button className="btn btn-ghost tc" style={{ border: 'none', background: 'transparent' }} onClick={() => setShowAts(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(${atsScore >= 80 ? 'var(--green)' : atsScore >= 50 ? 'var(--orange)' : 'var(--red)'} ${atsScore}%, var(--bg3) 0)` }}>
                <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '6px', background: 'var(--bg1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: atsScore >= 80 ? 'var(--green)' : atsScore >= 50 ? 'var(--orange)' : 'var(--red)' }}>{atsScore}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--t1)', marginBottom: '4px' }}>
                  {atsScore >= 80 ? 'Excellent Resume!' : atsScore >= 50 ? 'Needs Optimization' : 'Requires Major Updates'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                  {atsScore >= 80 ? 'Your resume is highly parsable and optimized for applicant tracking systems.' : 'Fix the issues below to improve your chances of passing automated screens.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--t3)', letterSpacing: '0.05em', marginBottom: '4px' }}>Feedback</h3>
              {atsFeedback.map((fb, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--b1)' }}>
                  <div style={{ marginTop: '2px' }}>
                    {fb.type === 'success' ? <CheckCircle size={16} color="var(--green)" /> : fb.type === 'warning' ? <AlertTriangle size={16} color="var(--orange)" /> : <AlertTriangle size={16} color="var(--red)" />}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: '1.4' }}>{fb.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actual A4 Sheet */}
        <div
          ref={resumePreviewRef}
          className="resume-a4-preview"
          style={{
            width: '210mm',
            minHeight: '297mm',
            background: '#fff',
            color: '#000',
            padding: '20mm', // ~1 inch margins
            fontFamily: '"Times New Roman", Times, serif',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            lineHeight: '1.2'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px 0', letterSpacing: '0.02em' }}>{resume.personal.name}</h1>
            <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {resume.personal.phone && <span>{resume.personal.phone}</span>}
              {resume.personal.phone && resume.personal.email && <span>|</span>}
              {resume.personal.email && <span>{resume.personal.email}</span>}
              {resume.personal.linkedin && <span>|</span>}
              {resume.personal.linkedin && <a href={`https://${resume.personal.linkedin}`} style={{ color: '#000', textDecoration: 'none' }}>{resume.personal.linkedin}</a>}
              {resume.personal.github && <span>|</span>}
              {resume.personal.github && <a href={`https://${resume.personal.github}`} style={{ color: '#000', textDecoration: 'none' }}>{resume.personal.github}</a>}
            </div>
          </div>

          {/* Education */}
          {resume.education.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                    <span>{edu.school}</span>
                    <span>{edu.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontStyle: 'italic' }}>{edu.degree}</span>
                    <span>{edu.date}</span>
                  </div>
                  {edu.gpa && <div style={{ fontSize: '12px' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Experience</h2>
              {resume.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                    <span>{exp.role}</span>
                    <span>{exp.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontStyle: 'italic' }}>{exp.company}</span>
                    <span style={{ fontStyle: 'italic' }}>{exp.location}</span>
                  </div>
                  <ul style={{ fontSize: '12px', margin: '0', paddingLeft: '18px', listStyleType: 'disc' }}>
                    {exp.desc.split('\n').filter(line => line.trim()).map((line, j) => (
                      <li key={j} style={{ paddingLeft: '2px', marginBottom: '2px' }}>
                        {line.replace(/^•\s*/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Projects</h2>
              {resume.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span><span style={{ fontWeight: 'bold' }}>{proj.name}</span> {proj.tech && <span style={{ fontStyle: 'italic' }}>| {proj.tech}</span>}</span>
                    <span>{proj.date}</span>
                  </div>
                  <ul style={{ fontSize: '12px', margin: '0', paddingLeft: '18px', listStyleType: 'disc' }}>
                    {proj.desc.split('\n').filter(line => line.trim()).map((line, j) => (
                      <li key={j} style={{ paddingLeft: '2px', marginBottom: '2px' }}>
                        {line.replace(/^•\s*/, '').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Technical Skills */}
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Technical Skills</h2>
            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {resume.skills.languages && <div><span style={{ fontWeight: 'bold' }}>Languages:</span> {resume.skills.languages}</div>}
              {resume.skills.frameworks && <div><span style={{ fontWeight: 'bold' }}>Frameworks:</span> {resume.skills.frameworks}</div>}
              {resume.skills.tools && <div><span style={{ fontWeight: 'bold' }}>Developer Tools:</span> {resume.skills.tools}</div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
