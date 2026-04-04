import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Camera, 
  Smile, 
  Calendar, 
  Users, 
  BookOpen, 
  UserRound, 
  AlertCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  Brain,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'AI Chatbot', icon: MessageSquare },
  { path: '/zen-zone', label: 'Zen Zone', icon: Sparkles },
  { path: '/emotion', label: 'Emotion Detection', icon: Camera },
  { path: '/mood', label: 'Mood Tracker', icon: Smile },
  { path: '/planner', label: 'Study Planner', icon: Calendar },
  { path: '/forum', label: 'Peer Forum', icon: Users },
  { path: '/resources', label: 'Resources', icon: BookOpen },
  { path: '/professionals', label: 'Professionals', icon: UserRound },
  { path: '/emergency', label: 'Emergency', icon: AlertCircle },
  { path: '/help', label: 'Help Desk', icon: HelpCircle },
];

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row relative">
      <div className="atmosphere-bg" />
      <div className="atmosphere-blur" />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 glass-panel sticky top-0 h-screen z-50 border-r border-white/5">
        <div className="p-10">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-12 h-12 bg-white/5 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10 relative overflow-hidden group/logo"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              <img 
                src="https://images.unsplash.com/photo-1606151328565-69816055a555?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="DZen AI Logo" 
                className="w-8 h-8 object-contain relative z-10"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Brain className="text-blue-400 hidden relative z-10" size={28} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white leading-none">
                DZen AI
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 mt-1">
                Mind & Study
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto py-4 relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative ${
                  isActive
                    ? 'text-white'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-2xl z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon 
                  size={20} 
                  className={`relative z-10 transition-all duration-500 ${
                    isActive ? 'text-blue-400 scale-110' : 'group-hover:scale-110 group-hover:text-white/80'
                  }`} 
                />
                <span className={`relative z-10 font-bold tracking-tight text-sm transition-all duration-500 ${
                  isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute right-4 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-4 px-5 py-5 mb-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 font-black text-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-white truncate tracking-tight">{user?.name}</p>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white/20 hover:text-blue-400 hover:bg-blue-500/10 rounded-2xl transition-all duration-500 font-black uppercase tracking-[0.2em] text-[10px]"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden glass-panel p-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1606151328565-69816055a555?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="DZen AI Logo" 
              className="w-5 h-5 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Brain className="text-blue-400 hidden" size={18} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">DZen AI</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white/60"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="md:hidden fixed inset-0 z-40 bg-[#020617] pt-24 px-6"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-5 rounded-3xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-blue-500/20 text-white border border-blue-500/20'
                      : 'text-white/40'
                  }`}
                >
                  <item.icon size={24} className={location.pathname === item.path ? 'text-blue-400' : ''} />
                  <span className="text-xl font-bold">{item.label}</span>
                </Link>
              ))}
              <div className="pt-8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-5 text-blue-400 bg-blue-500/10 rounded-3xl font-bold"
                >
                  <LogOut size={24} />
                  <span className="text-xl">Logout</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
