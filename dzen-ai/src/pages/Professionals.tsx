import React from 'react';
import { motion } from 'motion/react';
import { 
  UserRound, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar, 
  Star, 
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

const professionals = [
  {
    name: "Dr. Radhika Murugesan",
    specialization: "Psychiatrist (Chennai Minds)",
    hospital: "Chennai Minds",
    address: "S 11, 24 Arunachalam Road, Saligramam, Chennai 600093",
    contact: "+91 96770 04220",
    website: "https://chennaiminds.com",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
    hospitalImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800&h=400"
  },
  {
    name: "Dr. Arunkumar S",
    specialization: "Psychiatrist (AGAM Clinic)",
    hospital: "Anxiety Wellness Clinic",
    address: "23, MCK Layout, 2nd Main Rd, Nolambur, Chennai 600095",
    contact: "+91 95003 28282",
    website: "https://agamclinic.com",
    rating: 4.8,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
    hospitalImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=400"
  },
  {
    name: "Dr. Gauthamadas Udipi",
    specialization: "Neuropsychiatrist",
    hospital: "Doc Gautham's Neuro Centre",
    address: "4/68, Pachaiappas College Hostel Rd, Chetpet, Chennai 600031",
    contact: "+91 95661 33660",
    website: "https://docgautham.com",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400",
    hospitalImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800&h=400"
  },
  {
    name: "Dr. V.U. Karthikeyan",
    specialization: "Psychiatrist",
    hospital: "Indira Mind Clinic",
    address: "2/162, 1st floor, Sothupakkam road, Redhills, Chennai 600052",
    contact: "+91 79048 75468",
    website: "https://indiramindclinic.com",
    rating: 4.7,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=400&h=400",
    hospitalImage: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800&h=400"
  },
  {
    name: "Dr. M.S. Karthik",
    specialization: "Neuropsychiatrist",
    hospital: "Neuropsychiatry Clinic",
    address: "Lakshmi Talkies Road, Shenoy Nagar, Chennai 600030",
    contact: "+91 72008 20040",
    website: "https://practo.com",
    rating: 4.8,
    reviews: 118,
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=400&h=400",
    hospitalImage: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800&h=400"
  }
];

export default function Professionals() {
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
            Experts
          </motion.div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
            Mental <br />
            <span className="text-white/20 italic font-serif font-light">Professionals</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search experts..." 
              className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all w-72 backdrop-blur-xl"
            />
          </div>
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {professionals.map((pro, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass-card rounded-[3.5rem] border border-white/5 transition-all group overflow-hidden"
          >
            {/* Hospital Background Image */}
            <div className="h-48 w-full relative overflow-hidden">
              <img 
                src={pro.hospitalImage} 
                alt={pro.hospital}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
            </div>

            <div className="p-10 -mt-20 relative z-10">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="relative shrink-0">
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={pro.image} 
                      alt={pro.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-3 rounded-2xl shadow-2xl border-4 border-[#020617]">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">{pro.name}</h2>
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Star size={18} fill="currentColor" />
                        <span className="text-lg font-black">{pro.rating}</span>
                      </div>
                    </div>
                    <p className="text-blue-400/60 font-black text-xs uppercase tracking-[0.2em]">{pro.specialization}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-4 text-white/40 text-sm font-medium leading-relaxed">
                      <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>{pro.hospital} • {pro.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
                      <Phone size={18} className="text-blue-500 shrink-0" />
                      <span>{pro.contact}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <a 
                      href={pro.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-center hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      <Calendar size={18} />
                      Book Appointment
                    </a>
                    <button className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl">
                      <Globe size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verification Badge */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-card p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent"
      >
        <div className="w-24 h-24 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-blue-400 shadow-2xl border border-blue-500/20">
          <ShieldCheck size={48} />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-3xl font-black text-white tracking-tight">Verified Professionals</h3>
          <p className="text-white/40 font-medium leading-relaxed">
            All listed professionals are vetted and verified by Deeraj's AI to ensure they meet the highest standards of student care.
          </p>
        </div>
        <button className="px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all shadow-2xl">
          Learn More
        </button>
      </motion.div>
    </div>
  );
}
