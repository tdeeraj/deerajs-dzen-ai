import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Smile, 
  Frown, 
  Meh, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  MessageSquare,
  Camera,
  Users
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodRes, planRes, statsRes] = await Promise.all([
          fetch('/api/mood/history', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/planner', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/rewards/stats', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const moodData = await moodRes.json();
        const planData = await planRes.json();
        const statsData = await statsRes.json();
        
        setMoodHistory(moodData);
        setStudyPlan(planData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const chartData = moodHistory.slice().reverse().map(m => ({
    date: format(new Date(m.created_at), 'MMM dd'),
    stress: m.stress_level,
  }));

  const latestMood = moodHistory[0];

  return (
    <div className="space-y-16 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            <div className="w-8 h-[1px] bg-white/20" />
            Overview
          </motion.div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
            Focus & <br />
            <span className="text-white/20 italic font-serif font-light">Flow</span>
          </h1>
        </div>
        
        {stats && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-6"
          >
            <div className="glass-card px-10 py-6 rounded-[2.5rem] flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 text-blue-400 rounded-2xl flex items-center justify-center border border-white/10">
                <Star size={28} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Zen Points</p>
                <p className="text-3xl font-black text-white">{stats.zen_points}</p>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Mood Summary Card */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="lg:col-span-1 glass-card p-12 rounded-[4rem] flex flex-col justify-between min-h-[450px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Current Vibe</h2>
            <Smile className="text-white/40" />
          </div>
          
          {latestMood ? (
            <div className="text-center space-y-8">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                {latestMood.mood === 'happy' && '😊'}
                {latestMood.mood === 'calm' && '😌'}
                {latestMood.mood === 'neutral' && '😐'}
                {latestMood.mood === 'stressed' && '😫'}
                {latestMood.mood === 'sad' && '😢'}
                {latestMood.mood === 'angry' && '😡'}
              </motion.div>
              <div>
                <p className="text-5xl font-black text-white capitalize tracking-tighter">{latestMood.mood}</p>
                <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em] mt-2">Logged {format(new Date(latestMood.created_at), 'p')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <p className="text-white/20 font-bold uppercase tracking-widest">No mood logged today</p>
              <button 
                onClick={() => navigate('/mood')}
                className="btn-primary w-full"
              >
                Log Mood
              </button>
            </div>
          )}

          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Recommendation</p>
            <p className="text-sm font-medium text-white/60 leading-relaxed">
              {latestMood?.mood === 'stressed' ? 'Your stress levels are elevated. Try a 5-minute Zen Breather session.' : 'Your energy is high! Perfect time for deep focus work.'}
            </p>
          </div>
        </motion.div>

        {/* Analytics Chart */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="lg:col-span-2 glass-card p-12 rounded-[4rem] flex flex-col"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-white tracking-tight">Stress Analytics</h2>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 text-white/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
              <TrendingUp size={14} />
              7 Day Trend
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800}} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111',
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                    padding: '16px 20px'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="stress" stroke="#fff" strokeWidth={4} fillOpacity={1} fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Study Tasks */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="glass-card p-12 rounded-[4rem]"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-white tracking-tight">Study Flow</h2>
            <Calendar className="text-white/40" />
          </div>
          
          {studyPlan ? (
            <div className="space-y-6">
              {studyPlan.plan_data.tasks?.slice(0, 3).map((task, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/5 group-hover:scale-110 transition-transform">
                    <Clock size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-white tracking-tight">{task.subject}</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{task.duration} • {task.topic}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500">
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => navigate('/planner')}
                className="w-full py-6 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-colors"
              >
                View Full Schedule
              </button>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <p className="text-white/20 font-bold uppercase tracking-widest">No study plan generated yet</p>
              <button 
                onClick={() => navigate('/planner')}
                className="btn-primary w-full"
              >
                Create Plan
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-8">
          {[
            { label: 'Zen Zone', icon: Sparkles, color: 'bg-blue-500', path: '/zen-zone' },
            { label: 'AI Chat', icon: MessageSquare, color: 'bg-cyan-600', path: '/chat' },
            { label: 'Emotion AI', icon: Camera, color: 'bg-sky-500', path: '/emotion' },
            { label: 'Peer Forum', icon: Users, color: 'bg-blue-400', path: '/forum' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="p-10 glass-card rounded-[3rem] flex flex-col items-center justify-center gap-6 group text-center border border-white/5"
            >
              <div className={`w-16 h-16 ${action.color} rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                <action.icon size={32} />
              </div>
              <span className="text-lg font-black text-white tracking-tighter">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
