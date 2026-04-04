import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Heart, 
  MapPin,
  ExternalLink,
  ArrowRight,
  Github,
  Copy,
  Check,
  Mail,
  Linkedin
} from 'lucide-react';

const helplines = [
  {
    name: "National Emergency Number",
    number: "112",
    desc: "Single emergency number for all services (Police, Fire, Ambulance) in India.",
    color: "bg-rose-600"
  },
  {
    name: "Police",
    number: "100",
    desc: "Direct line to local police services for immediate assistance.",
    color: "bg-slate-700"
  },
  {
    name: "Ambulance",
    number: "102",
    desc: "Emergency medical services and ambulance assistance.",
    color: "bg-emerald-600"
  },
  {
    name: "Fire Station",
    number: "101",
    desc: "Direct line to fire and rescue services.",
    color: "bg-orange-600"
  },
  {
    name: "Mental Health Helpline (KIRAN)",
    number: "1800-599-0019",
    desc: "24/7, free and confidential support for mental health concerns in India.",
    color: "bg-indigo-600"
  },
  {
    name: "Women Helpline",
    number: "1091",
    desc: "Dedicated support for women in distress or facing violence.",
    color: "bg-rose-500"
  },
  {
    name: "Child Helpline",
    number: "1098",
    desc: "24-hour emergency phone service for children in need of aid.",
    color: "bg-blue-600"
  },
  {
    name: "Vandrevala Foundation",
    number: "9999 666 555",
    desc: "24/7 crisis intervention and suicide prevention helpline.",
    color: "bg-cyan-600"
  }
];

export default function Emergency() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 relative">
      <header className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-rose-500/10 rounded-[2.5rem] text-rose-500 mb-2 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
        >
          <ShieldAlert size={48} />
        </motion.div>
        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">Emergency <br /><span className="text-white/20 italic font-serif font-light">Support</span></h1>
        <p className="text-white/40 max-w-xl mx-auto font-medium text-lg">
          If you or someone you know is in immediate danger or experiencing a mental health crisis, please reach out for help right away.
        </p>
      </header>

      {/* Immediate Action Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-rose-600 text-white p-16 rounded-[4rem] shadow-2xl shadow-rose-900/20 relative overflow-hidden border border-rose-500/20"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <AlertCircle size={300} />
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black mb-6 tracking-tighter">Immediate Danger?</h2>
          <p className="text-rose-100 text-xl mb-12 max-w-xl font-medium leading-relaxed">
            If you are in an immediate life-threatening situation, please call the national emergency number immediately.
          </p>
          <div className="flex flex-wrap gap-6">
            <a 
              href="tel:112" 
              className="px-12 py-6 bg-white text-rose-600 rounded-[2rem] font-black text-3xl hover:bg-rose-50 transition-all flex items-center gap-4 shadow-2xl"
            >
              <Phone size={32} fill="currentColor" />
              Call 112
            </a>
            <a 
              href="https://www.india.gov.in/topics/governance-administration/emergency-helpline-numbers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-6 bg-rose-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-rose-800 transition-all border border-rose-500/20 flex items-center justify-center"
            >
              State-wise Numbers
            </a>
          </div>
        </div>
      </motion.div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {helplines.map((help, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass-card p-10 rounded-[3.5rem] border border-white/5 transition-all group"
          >
            <div className={`w-16 h-16 ${help.color} rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
              <Phone size={28} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{help.name}</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed font-medium">{help.desc}</p>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 group-hover:bg-white/10 transition-colors">
              <span className="text-2xl font-black text-white tracking-tighter">{help.number}</span>
              <button className="p-3 bg-white text-black rounded-xl shadow-2xl hover:bg-blue-400 hover:text-white transition-all">
                <ExternalLink size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Warning Signs */}
      <div className="glass-card p-16 rounded-[4rem] border border-white/5">
        <h3 className="text-3xl font-black text-white mb-10 tracking-tight">When to Seek Help</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Feelings of overwhelming hopelessness",
            "Withdrawal from friends and family",
            "Significant changes in sleep or appetite",
            "Loss of interest in activities you once enjoyed",
            "Difficulty performing daily tasks or studying",
            "Thoughts of self-harm or suicide"
          ].map((sign, i) => (
            <div key={i} className="flex items-start gap-5 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors group">
              <div className="mt-1 w-8 h-8 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <AlertCircle size={16} />
              </div>
              <span className="text-white/60 text-sm font-bold leading-relaxed">{sign}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
