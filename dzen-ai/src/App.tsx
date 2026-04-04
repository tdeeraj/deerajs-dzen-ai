import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import EmotionDetection from './pages/EmotionDetection';
import MoodTracker from './pages/MoodTracker';
import StudyPlanner from './pages/StudyPlanner';
import Forum from './pages/Forum';
import Resources from './pages/Resources';
import Professionals from './pages/Professionals';
import Emergency from './pages/Emergency';
import Login from './pages/Login';
import Register from './pages/Register';
import ZenZone from './pages/ZenZone';
import HelpDesk from './pages/HelpDesk';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/emotion" element={<EmotionDetection />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/zen-zone" element={<ZenZone />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/help" element={<HelpDesk />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
