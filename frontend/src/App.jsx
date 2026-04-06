import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Practice = lazy(() => import('./pages/Practice'));
const CompanyPrep = lazy(() => import('./pages/CompanyPrep'));
const Aptitude = lazy(() => import('./pages/Aptitude'));
const Jobs = lazy(() => import('./pages/Jobs'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const InterviewExperience = lazy(() => import('./pages/InterviewExperience'));
const MockInterview = lazy(() => import('./pages/MockInterview'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const RevisionScheduler = lazy(() => import('./pages/RevisionScheduler'));
const CommunicationLab = lazy(() => import('./pages/CommunicationLab'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const JobRecommendations = lazy(() => import('./pages/JobRecommendations'));
const ProjectIdeas = lazy(() => import('./pages/ProjectIdeas'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));

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
        <Suspense fallback={<div style={{ color: 'var(--t2)', padding: 24 }}>Loading page...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<P><Dashboard /></P>} />
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/practice" element={<P><Practice /></P>} />
            <Route path="/company-prep" element={<P><CompanyPrep /></P>} />
            <Route path="/aptitude" element={<P><Aptitude /></P>} />
            <Route path="/jobs" element={<P><Jobs /></P>} />
            <Route path="/recommendations" element={<P><JobRecommendations /></P>} />
            <Route path="/project-ideas" element={<P><ProjectIdeas /></P>} />
            <Route path="/resume-builder" element={<P><ResumeBuilder /></P>} />
            <Route path="/interviews" element={<P><InterviewExperience /></P>} />
            <Route path="/mock-interviews" element={<P><MockInterview /></P>} />
            <Route path="/roadmap" element={<P><Roadmap /></P>} />
            <Route path="/revision-scheduler" element={<P><RevisionScheduler /></P>} />
            <Route path="/developer-dashboard" element={<P><DeveloperDashboard /></P>} />
            <Route path="/ai" element={<P><AIAssistant /></P>} />
            <Route path="/communication" element={<P><CommunicationLab /></P>} />
            <Route path="/about" element={<P><About /></P>} />
            <Route path="/profile" element={<P><Profile /></P>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
