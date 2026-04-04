import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Trash2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

interface Task {
  subject: string;
  topic: string;
  duration: string;
  description: string;
  completed?: boolean;
}

interface StudyPlan {
  generated_at: string;
  exam_date: string;
  daily_hours: number;
  subjects: string[];
  tasks: Task[];
}

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function StudyPlanner() {
  const { token, user } = useAuth();
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Computer Science', 'Psychology']);
  const [newSubject, setNewSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [studyHours, setStudyHours] = useState(4);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch('/api/planner', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch plan");
        const data = await response.json();
        if (data && data.plan_data) {
          setPlan(data.plan_data);
          if (data.plan_data.subjects) setSubjects(data.plan_data.subjects);
          if (data.plan_data.exam_date) setExamDate(data.plan_data.exam_date);
          if (data.plan_data.daily_hours) setStudyHours(data.plan_data.daily_hours);
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
      }
    };
    if (token) fetchPlan();
  }, [token]);

  // Pomodoro Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = !isBreak;
      setIsBreak(nextMode);
      setTimeLeft(nextMode ? BREAK_TIME : POMODORO_TIME);
      // Optional: Play sound or notification
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (s: string) => {
    setSubjects(subjects.filter(item => item !== s));
  };

  const toggleTask = (index: number) => {
    if (!plan) return;
    const newTasks = [...plan.tasks];
    newTasks[index].completed = !newTasks[index].completed;
    const newPlan = { ...plan, tasks: newTasks };
    setPlan(newPlan);
    savePlan(newPlan);
  };

  const savePlan = async (planData: StudyPlan) => {
    try {
      await fetch('/api/planner', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan_data: planData }),
      });
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const generatePlan = async () => {
    if (!examDate) {
      alert("Please select an exam date first.");
      return;
    }
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not configured");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate a professional study plan for a student with the following subjects: ${subjects.join(', ')}. 
      The next major exam is on ${examDate}. The student can study ${studyHours} hours per day.
      Provide a list of 5 specific, actionable study tasks. Each task should have a subject, a specific topic, a duration (e.g., "1.5 hours"), and a brief description of what to focus on.
      Return the response in JSON format matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["subject", "topic", "duration", "description"]
                }
              }
            },
            required: ["tasks"]
          }
        }
      });

      if (!response.text) throw new Error("No response from AI");
      const result = JSON.parse(response.text);
      const newPlan: StudyPlan = {
        generated_at: new Date().toISOString(),
        exam_date: examDate,
        daily_hours: studyHours,
        subjects: subjects,
        tasks: result.tasks.map((t: any) => ({ ...t, completed: false }))
      };

      await savePlan(newPlan);
      setPlan(newPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to mock data if AI fails
      const fallbackTasks: Task[] = subjects.flatMap(subject => [
        { subject, topic: 'Core Concepts Review', duration: '1.5 hours', description: 'Review fundamental principles and key formulas.', completed: false },
        { subject, topic: 'Practice Exercises', duration: '1 hour', description: 'Solve previous year questions and practice problems.', completed: false }
      ]).slice(0, 5);
      
      const fallbackPlan: StudyPlan = {
        generated_at: new Date().toISOString(),
        exam_date: examDate,
        daily_hours: studyHours,
        subjects: subjects,
        tasks: fallbackTasks
      };
      setPlan(fallbackPlan);
      savePlan(fallbackPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            <div className="w-8 h-[1px] bg-white/20" />
            Productivity Suite
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
            Study <br />
            <span className="text-white/20 italic font-serif font-light">Architect</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-8 py-4 rounded-3xl flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <Timer size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Focus Timer</p>
              <p className="text-2xl font-black text-white font-mono">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Parameters</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Active Subjects</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add subject..."
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm text-white placeholder:text-white/10"
                  />
                  <button 
                    onClick={addSubject}
                    className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {subjects.map(s => (
                      <motion.span 
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-4 py-2 bg-white/5 text-white/60 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 border border-white/5"
                      >
                        {s}
                        <button onClick={() => removeSubject(s)} className="hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Exam Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Daily Intensity</label>
                  <span className="text-blue-400 font-black text-sm">{studyHours}h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <button
                onClick={generatePlan}
                disabled={isGenerating || subjects.length === 0}
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                {isGenerating ? 'Architecting...' : 'Generate AI Plan'}
              </button>
            </div>
          </div>

          {/* Pomodoro Widget */}
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 border border-white/5">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-white tracking-tight">Deep Work</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${isBreak ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                {isBreak ? 'Break' : 'Focus'}
              </span>
            </div>
            
            <div className="text-center space-y-8">
              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`p-5 rounded-2xl transition-all ${isActive ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20'}`}
                >
                  {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                </button>
                <button 
                  onClick={() => {
                    setIsActive(false);
                    setTimeLeft(isBreak ? BREAK_TIME : POMODORO_TIME);
                  }}
                  className="p-5 bg-white/5 text-white/40 rounded-2xl hover:text-white hover:bg-white/10 transition-all border border-white/5"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Display */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {plan ? (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Brain size={200} />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-white tracking-tighter">Strategic Timeline</h2>
                      <p className="text-white/30 font-medium">AI-optimized path to your academic goals.</p>
                    </div>
                    <div className="px-6 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 flex items-center gap-3">
                      <CheckCircle2 size={14} />
                      Neural Optimized
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {plan.tasks.map((task, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative flex gap-8 p-8 rounded-[2.5rem] border transition-all duration-500 ${
                          task.completed 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-white/5 border-white/5 hover:border-blue-500/30 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <button 
                            onClick={() => toggleTask(i)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                              task.completed 
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20' 
                                : 'bg-white/5 text-white/20 border-white/5 group-hover:border-blue-500/50 group-hover:text-blue-400'
                            }`}
                          >
                            {task.completed ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                          </button>
                          {i < plan.tasks.length - 1 && (
                            <div className={`w-[1px] h-full rounded-full transition-colors duration-500 ${task.completed ? 'bg-emerald-500/20' : 'bg-white/5'}`} />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-colors duration-500 ${
                              task.completed 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                            }`}>
                              {task.subject}
                            </span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{task.duration}</span>
                          </div>
                          
                          <div>
                            <h3 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${task.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                              {task.topic}
                            </h3>
                            <p className="text-white/30 text-sm leading-relaxed font-medium">
                              {task.description}
                            </p>
                          </div>
                          
                          <div className="pt-4 flex items-center gap-6">
                            <button 
                              onClick={() => toggleTask(i)}
                              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                                task.completed ? 'text-emerald-400' : 'text-white/20 hover:text-white'
                              }`}
                            >
                              {task.completed ? 'Completed' : 'Mark as Done'}
                            </button>
                            <a 
                              href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(task.subject + ' ' + task.topic)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 transition-colors group/link"
                            >
                              View Resources
                              <ExternalLink size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-20 rounded-[4rem] border border-white/5 h-full flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/5 relative">
                  <Calendar className="text-white/10" size={64} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tighter">No Active Strategy</h3>
                  <p className="text-white/30 max-w-md mx-auto font-medium text-lg">
                    Configure your academic parameters on the left to architect your personalized AI study plan.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 pt-8">
                  {[
                    { label: "Dynamic Load", icon: <Zap size={16} /> },
                    { label: "Stress Aware", icon: <Brain size={16} /> },
                    { label: "Goal Driven", icon: <Target size={16} /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                      <span className="text-blue-500">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
