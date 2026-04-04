import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  Wind, 
  Heart, 
  ExternalLink, 
  Search,
  Filter,
  Clock,
  Sparkles
} from 'lucide-react';

const resources = [
  {
    title: "10-Minute Mindful Meditation",
    type: "Video",
    category: "Meditation",
    duration: "10 min",
    url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    thumbnail: "https://picsum.photos/seed/meditation1/400/250"
  },
  {
    title: "Box Breathing Technique",
    type: "Guide",
    category: "Breathing",
    duration: "5 min",
    url: "https://www.healthline.com/health/box-breathing",
    thumbnail: "https://picsum.photos/seed/breathing1/400/250"
  },
  {
    title: "Yoga for Academic Stress",
    type: "Video",
    category: "Yoga",
    duration: "20 min",
    url: "https://www.youtube.com/watch?v=sTANio_2E0Q",
    thumbnail: "https://picsum.photos/seed/yoga1/400/250"
  },
  {
    title: "Managing Exam Anxiety",
    type: "Article",
    category: "Academic",
    duration: "8 min read",
    url: "https://www.ox.ac.uk/students/academic/exams/wellbeing",
    thumbnail: "https://picsum.photos/seed/exam1/400/250"
  },
  {
    title: "Deep Sleep Meditation",
    type: "Audio",
    category: "Sleep",
    duration: "30 min",
    url: "https://www.youtube.com/watch?v=v9W8iV4AJYQ",
    thumbnail: "https://picsum.photos/seed/sleep1/400/250"
  },
  {
    title: "Mindfulness for Students",
    type: "Course",
    category: "Mindfulness",
    duration: "Self-paced",
    url: "https://www.coursera.org/learn/mindfulness",
    thumbnail: "https://picsum.photos/seed/mindful1/400/250"
  }
];

export default function Resources() {
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
            Knowledge Base
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
            Wellness <br />
            <span className="text-white/20 italic font-serif font-light">Library</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all w-72 backdrop-blur-xl"
            />
          </div>
          <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Featured Resource */}
      <motion.div 
        whileHover={{ y: -10 }}
        className="relative h-[450px] rounded-[4rem] overflow-hidden group cursor-pointer shadow-2xl shadow-blue-500/10 border border-white/5"
      >
        <img 
          src="https://picsum.photos/seed/featured/1200/600" 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-16 text-white w-full">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Featured</span>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <Clock size={14} />
              15 min session
            </span>
          </div>
          <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">Morning Mindfulness <br />for Deep Focus</h2>
          <p className="text-white/40 max-w-2xl mb-10 text-lg font-medium leading-relaxed">Start your day with clarity. This guided session is specifically designed for students to improve concentration before lectures.</p>
          <a 
            href="https://www.youtube.com/watch?v=inpok4MKVLM" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-50 transition-all shadow-2xl shadow-white/10 group inline-flex"
          >
            <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            Watch Session
          </a>
        </div>
      </motion.div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {resources.map((res, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass-card rounded-[3rem] overflow-hidden group border border-white/5 flex flex-col"
          >
            <a 
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-56 overflow-hidden block"
            >
              <img 
                src={res.thumbnail} 
                alt={res.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-black/40 backdrop-blur-xl text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                  {res.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                  {res.type === 'Video' ? <Play size={28} fill="currentColor" /> : <BookOpen size={28} />}
                </div>
              </div>
            </a>
            <div className="p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{res.type}</span>
                <span className="text-[10px] font-black text-white/20 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Clock size={12} />
                  {res.duration}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 group-hover:text-blue-400 transition-colors tracking-tight leading-tight">{res.title}</h3>
              <a 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-between w-full p-6 bg-white/5 rounded-[2rem] group-hover:bg-blue-600/10 transition-all border border-white/5 group-hover:border-blue-500/20"
              >
                <span className="text-xs font-black text-white/40 group-hover:text-blue-400 uppercase tracking-[0.2em]">Access Resource</span>
                <ExternalLink size={18} className="text-white/20 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-16 border-t border-white/5">
        {['Meditation', 'Breathing', 'Yoga', 'Academic', 'Sleep', 'Mindfulness'].map(cat => (
          <button 
            key={cat}
            className="px-8 py-3 rounded-full border border-white/10 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] hover:border-blue-500 hover:text-blue-400 transition-all backdrop-blur-xl hover:bg-blue-500/5"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
