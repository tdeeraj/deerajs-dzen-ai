import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  Shield, 
  Users, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Heart,
  Zap,
  Camera
} from 'lucide-react';

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const navBg = useTransform(scrollYProgress, [0, 0.1], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]);
  const navPadding = useTransform(scrollYProgress, [0, 0.1], ["32px", "16px"]);
  const navBlur = useTransform(scrollYProgress, [0, 0.1], ["blur(0px)", "blur(16px)"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white selection:bg-white/20 relative overflow-hidden scroll-smooth">
      <div className="atmosphere-bg" />
      <div className="atmosphere-blur" />
      
      {/* Dynamic Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ 
          backgroundColor: navBg,
          backdropFilter: navBlur,
          paddingTop: navPadding,
          paddingBottom: navPadding
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/0"
      >
        <div className="flex items-center justify-between px-12 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group/logo"
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
            <span className="text-3xl font-black tracking-tighter">
              DZen AI
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link 
              to="/login" 
              className="px-8 py-3 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-50 transition-all shadow-xl shadow-white/5"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
            >
              Join Now
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-12 overflow-hidden">
        {/* Full Background Image */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          className="max-w-[1600px] mx-auto w-full relative z-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 max-w-4xl"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
              >
                <div className="w-8 h-[1px] bg-white/20" />
                The Future of Student Wellness
              </motion.div>
              <h1 className="text-[120px] font-black leading-[0.85] tracking-tighter relative">
                Master <br />
                <span className="text-white/20 italic font-serif font-light">Your</span> Mind.
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10" />
              </h1>
              <p className="text-2xl text-white/40 max-w-xl leading-relaxed font-medium">
                DZen AI seamlessly integrates mental wellness with academic precision, helping you thrive without the burnout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white text-black px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-50 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-4 group"
              >
                Start Journey
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <a 
                href="#features" 
                className="text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-colors flex items-center gap-3"
              >
                Explore Features
                <div className="w-8 h-[1px] bg-white/20" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-48 px-12 bg-white/[0.02] backdrop-blur-3xl relative z-10 border-y border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-[1600px] mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
                <div className="w-8 h-[1px] bg-white/20" />
                Capabilities
              </div>
              <h2 className="text-7xl font-black tracking-tighter">Everything to <br /><span className="text-white/20 italic font-serif font-light">Succeed.</span></h2>
            </div>
            <p className="text-white/40 max-w-md text-lg font-medium leading-relaxed">
              Our integrated platform addresses both your academic and emotional needs in one place, powered by advanced AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Sparkles />,
                title: "AI Wellness Chat",
                desc: "24/7 empathetic support and guidance for managing stress and anxiety."
              },
              {
                icon: <Camera />,
                title: "Emotion AI",
                desc: "Real-time facial analysis to suggest the right wellness activities."
              },
              {
                icon: <Calendar />,
                title: "Smart Planner",
                desc: "AI-generated schedules that balance your workload and personal time."
              },
              {
                icon: <Users />,
                title: "Peer Support",
                desc: "Connect anonymously with fellow students who understand your journey."
              },
              {
                icon: <Heart />,
                title: "Zen Zone",
                desc: "Refreshing games and mindfulness exercises to recharge your mind."
              },
              {
                icon: <Shield />,
                title: "Professional Help",
                desc: "Quick access to counselors and emergency support when you need it."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
                className="p-12 glass-card rounded-[3rem] space-y-8 group border border-white/5"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all duration-500 border border-white/5">
                  {feature.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 px-12 relative z-10"
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-24 mb-24">
            <div className="space-y-8 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/10 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606151328565-69816055a555?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="DZen AI Logo" 
                    className="w-6 h-6 object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Brain className="text-blue-400 hidden" size={20} />
                </div>
                <span className="text-2xl font-black tracking-tighter">DZen AI</span>
              </div>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Empowering students to achieve academic excellence through mental wellness and smart productivity. Crafted with precision by <span className="text-white">Deeraj T</span>.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Platform</h4>
                <ul className="space-y-4 font-bold text-sm text-white/40">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><Link to="/zen-zone" className="hover:text-white transition-colors">Zen Zone</Link></li>
                  <li><Link to="/chat" className="hover:text-white transition-colors">AI Chat</Link></li>
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Desk</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Connect</h4>
                <ul className="space-y-4 font-bold text-sm text-white/40">
                  <li><a href="mailto:tdeeraj4545@gmail.com" className="hover:text-white transition-colors">Email Support</a></li>
                  <li><a href="https://www.linkedin.com/in/deerajt/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency Support</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>© 2026 DZen AI. All rights reserved.</span>
            <div className="flex gap-12">
              <a href="mailto:tdeeraj4545@gmail.com" className="hover:text-white transition-colors">Contact</a>
              <a href="https://www.linkedin.com/in/deerajt/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Developer</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
