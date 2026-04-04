import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smile, 
  Frown, 
  Meh, 
  AlertCircle, 
  Save, 
  History, 
  Calendar,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const moodOptions = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#fbbf24' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#34d399' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#94a3b8' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#6366f1' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#60a5fa' },
  { id: 'angry', label: 'Angry', emoji: '😡', color: '#f87171' },
];

export default function MoodTracker() {
  const { token } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/mood/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood: selectedMood, stress_level: stressLevel, note }),
      });
      
      if (response.ok) {
        setSuccess(true);
        setSelectedMood(null);
        setStressLevel(5);
        setNote('');
        fetchHistory();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodDistribution = moodOptions.map(option => ({
    name: option.label,
    count: history.filter((h: any) => h.mood === option.id).length,
    color: option.color
  })).filter(d => d.count > 0);

  return (
    <div className="space-y-16 relative">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <div className="w-8 h-[1px] bg-white/20" />
          Emotional Journey
        </motion.div>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">Mood <br /><span className="text-white/20 italic font-serif font-light">Tracker</span></h1>
        <p className="text-white/40 max-w-xl font-medium text-lg">Track your emotional journey and identify patterns in your well-being.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Log Mood Form */}
        <div className="lg:col-span-1 glass-card p-10 rounded-[4rem] border border-white/5">
          <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight">
            <Calendar className="text-blue-500" size={24} />
            How are you feeling?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-3 gap-4">
              {moodOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedMood(option.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                    selectedMood === option.id 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105' 
                      : 'border-white/5 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <span className="text-4xl mb-2">{option.emoji}</span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Stress Level</label>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  stressLevel > 7 ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20' : 
                  stressLevel > 4 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' : 
                  'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                }`}>
                  {stressLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
                <span>Relaxed</span>
                <span>Very Stressed</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Notes (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all h-32 resize-none placeholder:text-white/10 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedMood || loading}
              className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? 'Saving...' : success ? 'Saved!' : 'Log Mood'}
              {!loading && !success && <Save size={20} />}
            </button>
          </form>
        </div>

        {/* Analytics & History */}
        <div className="lg:col-span-2 space-y-12">
          {/* Mood Distribution Chart */}
          <div className="glass-card p-12 rounded-[4rem] border border-white/5">
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight">
              <TrendingUp className="text-blue-500" size={24} />
              Mood Distribution
            </h2>
            <div className="h-80 w-full">
              {moodDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.02)'}}
                      contentStyle={{ 
                        backgroundColor: '#111',
                        borderRadius: '24px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                        padding: '16px 20px'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 800 }}
                    />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-6">
                  <TrendingUp size={64} className="opacity-10" />
                  <p className="font-black uppercase tracking-[0.3em] text-xs">Log some moods to see your analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent History */}
          <div className="glass-card p-12 rounded-[4rem] border border-white/5">
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight">
              <History className="text-blue-500" size={24} />
              Recent Logs
            </h2>
            <div className="space-y-6">
              {history.slice(0, 5).map((log: any) => {
                const mood = moodOptions.find(m => m.id === log.mood);
                return (
                  <div key={log.id} className="flex items-center gap-8 p-8 bg-white/5 rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{mood?.emoji}</div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-white capitalize tracking-tight">{log.mood}</span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{format(new Date(log.created_at), 'MMM dd, p')}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${log.stress_level * 10}%` }}
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">STRESS: {log.stress_level}/10</span>
                      </div>
                      {log.note && (
                        <p className="text-sm text-white/40 font-medium italic leading-relaxed">"{log.note}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {history.length === 0 && (
                <div className="text-center py-20 space-y-6">
                  <History size={64} className="text-white/10 mx-auto" />
                  <p className="font-black uppercase tracking-[0.3em] text-xs text-white/20">No history yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
