import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Brain, 
  Camera, 
  Calendar, 
  Users, 
  Shield,
  ArrowRight,
  Zap,
  Star,
  Github,
  Mail,
  Linkedin
} from 'lucide-react';

export default function HelpDesk() {
  const sections = [
    {
      title: "Zen Points & Rewards",
      icon: <Trophy className="text-blue-400" />,
      content: "Zen Points are our way of rewarding your commitment to wellness and productivity. You earn points by completing study sessions, logging your mood, and participating in the peer forum. These points help you unlock exclusive Zen Zone content and track your personal growth journey.",
      points: [
        { action: "Complete Study Session", value: "+50 XP" },
        { action: "Daily Mood Log", value: "+20 XP" },
        { action: "Forum Contribution", value: "+15 XP" },
        { action: "Emotion Analysis", value: "+10 XP" }
      ]
    },
    {
      title: "AI Study Architect",
      icon: <Brain className="text-cyan-400" />,
      content: "Our AI analyzes your current stress levels and academic workload to create the perfect study schedule. It automatically builds in 'Zen Breaks' to prevent burnout and ensure you stay in the flow state longer."
    },
    {
      title: "Emotion AI Detection",
      icon: <Camera className="text-sky-400" />,
      content: "Using advanced computer vision, DZen AI can detect signs of stress, fatigue, or focus in real-time. This data is used to suggest immediate wellness activities like breathing exercises or a quick mental refresh game."
    },
    {
      title: "Zen Zone",
      icon: <Sparkles className="text-blue-500" />,
      content: "A dedicated space for mental rejuvenation. Here you'll find mindfulness exercises, focus-enhancing music, and 'Zen Games' designed to lower cognitive load and refresh your mind between study blocks."
    }
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* Developer Spotlight */}
      <div className="glass-card p-16 rounded-[4rem] border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 group-hover:bg-blue-400/20 transition-colors duration-1000 animate-pulse" />
        
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <motion.div 
            whileHover={{ rotate: -1, scale: 1.02 }}
            className="w-72 h-72 bg-white/5 rounded-[4rem] flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden flex-shrink-0"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full animate-pulse" />
            <img 
              src="/developer-photo.png" 
              alt="Deeraj T" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 relative z-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-60 z-20" />
          </motion.div>

          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
                Developer Spotlight
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter leading-none">
                Deeraj T
              </h2>
              <p className="text-white/40 leading-relaxed font-medium text-xl max-w-2xl">
                If you have any queries, feel free to reach out. <br />
                Open to feedback, collaboration, and opportunities.
              </p>
            </div>

            <div className="flex gap-4">
              {/* Email Button */}
              <a 
                href="mailto:tdeeraj4545@gmail.com"
                className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-blue-600 hover:border-blue-500/50 transition-all duration-500 group/social relative overflow-hidden"
                title="Email Developer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity" />
                <Mail size={24} className="relative z-10 group-hover/social:scale-110 transition-transform" />
              </a>

              {/* LinkedIn Button */}
              <a 
                href="https://www.linkedin.com/in/deerajt/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5]/50 transition-all duration-500 group/social relative overflow-hidden"
                title="LinkedIn Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity" />
                <Linkedin size={24} className="relative z-10 group-hover/social:scale-110 transition-transform" />
              </a>

              {/* GitHub Button */}
              <a 
                href="https://github.com/tdeeraj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#24292e] hover:border-[#24292e]/50 transition-all duration-500 group/social relative overflow-hidden"
                title="GitHub Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity" />
                <Github size={24} className="relative z-10 group-hover/social:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <div className="w-8 h-[1px] bg-white/20" />
          Support Center
        </motion.div>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
          How It <br />
          <span className="text-white/20 italic font-serif font-light">Works</span>
        </h1>
        <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium">
          Everything you need to know about mastering your mind and maximizing your productivity with DZen AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-12 rounded-[4rem] space-y-8 group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">{section.title}</h2>
            </div>
            
            <p className="text-white/40 text-lg leading-relaxed font-medium">
              {section.content}
            </p>

            {section.points && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                {section.points.map((p, j) => (
                  <div key={j} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{p.action}</span>
                    <span className="text-xs font-black text-blue-400">{p.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card p-16 rounded-[4rem] text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
        <HelpCircle className="mx-auto text-blue-400" size={64} />
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter">Still have questions?</h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg font-medium">
            Our support team and AI companion are always here to help you navigate your journey.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="mailto:tdeeraj4545@gmail.com"
            className="btn-primary px-12 py-6 rounded-[2rem] flex items-center gap-4"
          >
            Contact Support
            <ArrowRight size={20} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
