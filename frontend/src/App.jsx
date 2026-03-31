import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import CompanyPrep from './pages/CompanyPrep';
import Aptitude from './pages/Aptitude';
import Jobs from './pages/Jobs';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewExperience from './pages/InterviewExperience';
import MockInterview from './pages/MockInterview';
import Roadmap from './pages/Roadmap';
import Contests from './pages/Contests';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import CourseCatalog from './pages/CourseCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'var(--t2)', padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  return (
    <div id="s-app" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main" style={{ position: 'relative', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const P = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<P><Dashboard /></P>} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/practice" element={<P><Practice /></P>} />
          <Route path="/company-prep" element={<P><CompanyPrep /></P>} />
          <Route path="/aptitude" element={<P><Aptitude /></P>} />
          <Route path="/jobs" element={<P><Jobs /></P>} />
          <Route path="/resume-builder" element={<P><ResumeBuilder /></P>} />
          <Route path="/interviews" element={<P><InterviewExperience /></P>} />
          <Route path="/mock-interviews" element={<P><MockInterview /></P>} />
          <Route path="/roadmap" element={<P><Roadmap /></P>} />
          <Route path="/contests" element={<P><Contests /></P>} />
          <Route path="/ai" element={<P><AIAssistant /></P>} />
          <Route path="/community" element={<P><Community /></P>} />
          <Route path="/courses" element={<P><CourseCatalog /></P>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
