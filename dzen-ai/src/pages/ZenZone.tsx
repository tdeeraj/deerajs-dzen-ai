import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Wind, Trophy, Sparkles, Brain, Star, ArrowRight, Play, RotateCcw, Puzzle, Heart, Moon, Sun, Circle, Palette, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type GameType = 'breathing' | 'pattern' | 'bubbles' | 'colorMatch' | 'memory' | 'idle';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface MemoryCard {
  id: number;
  icon: React.ReactNode;
  isFlipped: boolean;
  isMatched: boolean;
  type: string;
}

export default function ZenZone() {
  const { token } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<GameType>('idle');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const game = params.get('game') as GameType;
    if (game) {
      if (game === 'pattern') startPatternGame();
      else if (game === 'bubbles') startBubblesGame();
      else if (game === 'colorMatch') startColorMatch();
      else if (game === 'memory') startMemoryGame();
      else setActiveGame(game);
    }
  }, [location.search]);
  
  // Breathing Game State
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  
  // Pattern Game State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Bubble Pop State
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubblesPopped, setBubblesPopped] = useState(0);

  // Color Match State
  const [targetColor, setTargetColor] = useState('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [colorScore, setColorScore] = useState(0);

  // Memory Game State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const [pointsEarned, setPointsEarned] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/rewards/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addPoints = async (points: number) => {
    try {
      await fetch('/api/rewards/add-points', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ points })
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Breathing Logic
  useEffect(() => {
    let interval: any;
    if (activeGame === 'breathing') {
      interval = setInterval(() => {
        setTimer(t => (t >= 11 ? 0 : t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame]);

  useEffect(() => {
    if (activeGame === 'breathing') {
      if (timer <= 3) setBreathPhase('inhale');
      else if (timer <= 7) setBreathPhase('hold');
      else setBreathPhase('exhale');
    }
  }, [timer, activeGame]);

  // Pattern Game Logic
  const startPatternGame = () => {
    setActiveGame('pattern');
    setScore(0);
    const firstMove = Math.floor(Math.random() * 4);
    setSequence([firstMove]);
    showSequence([firstMove]);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    setUserSequence([]);
    for (const move of seq) {
      await new Promise(r => setTimeout(r, 600));
      setActiveButton(move);
      await new Promise(r => setTimeout(r, 400));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
  };

  const handleButtonClick = (index: number) => {
    if (isShowingSequence || activeGame !== 'pattern') return;
    
    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);
    
    // Flash button
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    // Check if correct
    if (index !== sequence[userSequence.length]) {
      // Game Over
      const earned = score * 10;
      setPointsEarned(earned);
      if (earned > 0) addPoints(earned);
      setShowReward(true);
      setActiveGame('idle');
      return;
    }

    if (newUserSeq.length === sequence.length) {
      // Level Up
      setScore(s => s + 1);
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setTimeout(() => showSequence(nextSeq), 1000);
    }
  };

  // Bubble Pop Logic
  const startBubblesGame = () => {
    setActiveGame('bubbles');
    setBubblesPopped(0);
    generateBubbles();
  };

  const generateBubbles = () => {
    const newBubbles: Bubble[] = [];
    const colors = ['bg-blue-400', 'bg-cyan-400', 'bg-sky-400', 'bg-blue-300'];
    for (let i = 0; i < 12; i++) {
      newBubbles.push({
        id: Math.random(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        size: Math.random() * 40 + 40, // 40px to 80px
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setBubbles(newBubbles);
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setBubblesPopped(prev => prev + 1);
    
    if (bubbles.length === 1) {
      // Round Complete
      const earned = 30;
      setPointsEarned(earned);
      addPoints(earned);
      setShowReward(true);
      setActiveGame('idle');
    }
  };

  // Color Match Logic
  const startColorMatch = () => {
    setActiveGame('colorMatch');
    setColorScore(0);
    generateColorRound();
  };

  const generateColorRound = () => {
    const colors = [
      'bg-blue-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-300', 
      'bg-indigo-500', 'bg-teal-500', 'bg-blue-700', 'bg-cyan-700'
    ];
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setTargetColor(options[Math.floor(Math.random() * 4)]);
    setColorOptions(options);
  };

  const handleColorChoice = (color: string) => {
    if (color === targetColor) {
      if (colorScore >= 4) {
        const earned = 40;
        setPointsEarned(earned);
        addPoints(earned);
        setShowReward(true);
        setActiveGame('idle');
      } else {
        setColorScore(s => s + 1);
        generateColorRound();
      }
    } else {
      const earned = colorScore * 5;
      setPointsEarned(earned);
      if (earned > 0) addPoints(earned);
      setShowReward(true);
      setActiveGame('idle');
    }
  };

  // Memory Game Logic
  const startMemoryGame = () => {
    setActiveGame('memory');
    setMemoryMoves(0);
    setFlippedCards([]);
    
    const icons = [
      { icon: <Moon size={24} />, type: 'moon' },
      { icon: <Sun size={24} />, type: 'sun' },
      { icon: <Heart size={24} />, type: 'heart' },
      { icon: <Star size={24} />, type: 'star' },
      { icon: <Brain size={24} />, type: 'brain' },
      { icon: <Wind size={24} />, type: 'wind' },
    ];
    
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({
        id: i,
        icon: item.icon,
        type: item.type,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(deck);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].type === cards[second].type) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        
        if (newCards.every(c => c.isMatched)) {
          const earned = Math.max(10, 100 - memoryMoves * 5);
          setPointsEarned(earned);
          addPoints(earned);
          setShowReward(true);
          setActiveGame('idle');
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const finishBreathing = () => {
    const earned = 50;
    setPointsEarned(earned);
    addPoints(earned);
    setShowReward(true);
    setActiveGame('idle');
  };

  const buttons = [
    { color: 'bg-blue-500', icon: <Moon size={24} /> },
    { color: 'bg-cyan-500', icon: <Heart size={24} /> },
    { color: 'bg-sky-500', icon: <Sun size={24} /> },
    { color: 'bg-blue-400', icon: <Star size={24} /> },
  ];

  return (
    <div className="space-y-12 pb-24 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter text-white">Zen Zone</h1>
          <p className="text-white/40 font-medium text-lg">Find your center through mindfulness and play.</p>
        </div>
        
        {stats && (
          <div className="flex gap-4">
            <div className="glass-card px-8 py-4 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 text-blue-400 rounded-2xl flex items-center justify-center border border-white/10">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Zen Points</p>
                <p className="text-2xl font-black text-white">{stats.zen_points}</p>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Interaction Area */}
        <div className="lg:col-span-2 glass-card p-12 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeGame === 'idle' && !showReward && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-12 relative z-10"
              >
                <div className="flex flex-wrap gap-8 justify-center">
                  <motion.button 
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={() => setActiveGame('breathing')}
                    className="flex flex-col items-center gap-6 group"
                  >
                    <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 transition-all duration-500">
                      <Wind className="text-white" size={40} />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Zen Breather</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={startPatternGame}
                    className="flex flex-col items-center gap-6 group"
                  >
                    <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 transition-all duration-500">
                      <Puzzle className="text-white" size={40} />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Mindful Pattern</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={startBubblesGame}
                    className="flex flex-col items-center gap-6 group"
                  >
                    <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 transition-all duration-500">
                      <Circle className="text-white" size={40} />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Bubble Pop</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={startColorMatch}
                    className="flex flex-col items-center gap-6 group"
                  >
                    <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 transition-all duration-500">
                      <Palette className="text-white" size={40} />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Color Match</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={startMemoryGame}
                    className="flex flex-col items-center gap-6 group"
                  >
                    <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 transition-all duration-500">
                      <LayoutGrid className="text-white" size={40} />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Memory Cards</span>
                  </motion.button>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Choose Your Practice</h2>
                  <p className="text-white/30 max-w-sm mx-auto font-medium">
                    Select an activity to help you refocus and recharge your mental energy.
                  </p>
                </div>
              </motion.div>
            )}

            {activeGame === 'breathing' && (
              <motion.div 
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-16 relative z-10"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: breathPhase === 'inhale' ? 1.8 : breathPhase === 'hold' ? 1.8 : 1,
                      opacity: breathPhase === 'inhale' ? 0.4 : 0.1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-64 h-64 bg-blue-500 rounded-full blur-[80px] absolute"
                  />
                  <motion.div 
                    animate={{ 
                      scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.3 : 1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center relative z-10 bg-white/5 backdrop-blur-xl"
                  >
                    <span className="text-3xl font-black text-white uppercase tracking-[0.3em]">
                      {breathPhase}
                    </span>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-3 justify-center">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          timer >= i ? 'bg-white scale-150 shadow-[0_0_10px_white]' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={finishBreathing}
                    className="text-white/30 hover:text-blue-400 font-bold text-sm uppercase tracking-widest transition-colors"
                  >
                    End Session
                  </button>
                </div>
              </motion.div>
            )}

            {activeGame === 'pattern' && (
              <motion.div 
                key="pattern"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-12 relative z-10"
              >
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Level</p>
                  <p className="text-5xl font-black text-white">{score + 1}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {buttons.map((btn, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleButtonClick(i)}
                      className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 border border-white/10 ${
                        activeButton === i ? `${btn.color} shadow-[0_0_40px_rgba(255,255,255,0.3)] scale-105` : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={activeButton === i ? 'text-white' : 'text-white/40'}>
                        {btn.icon}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
                  {isShowingSequence ? 'Watch the sequence' : 'Repeat the pattern'}
                </p>
              </motion.div>
            )}

            {activeGame === 'bubbles' && (
              <motion.div 
                key="bubbles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative min-h-[500px]"
              >
                <div className="absolute top-0 left-0 p-8 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Popped</p>
                  <p className="text-3xl font-black text-white">{bubblesPopped}</p>
                </div>
                
                <AnimatePresence>
                  {bubbles.map((bubble) => (
                    <motion.button
                      key={bubble.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.6 }}
                      exit={{ scale: 2, opacity: 0 }}
                      whileHover={{ scale: 1.1, opacity: 0.8 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => popBubble(bubble.id)}
                      style={{
                        position: 'absolute',
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: bubble.size,
                        height: bubble.size,
                      }}
                      className={`${bubble.color} rounded-full blur-[2px] border border-white/20 shadow-inner flex items-center justify-center`}
                    >
                      <div className="w-1/3 h-1/3 bg-white/20 rounded-full blur-[4px] -mt-4 -ml-4" />
                    </motion.button>
                  ))}
                </AnimatePresence>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
                    Pop all bubbles to relax
                  </p>
                </div>
              </motion.div>
            )}

            {activeGame === 'colorMatch' && (
              <motion.div 
                key="colorMatch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-12 relative z-10"
              >
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Match This Color</p>
                  <div className={`w-32 h-32 ${targetColor} rounded-[2.5rem] mx-auto shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/20`} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {colorOptions.map((color, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorChoice(color)}
                      className={`w-32 h-32 ${color} rounded-[2.5rem] border border-white/10 shadow-lg`}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Score</p>
                  <p className="text-3xl font-black text-white">{colorScore}</p>
                </div>
              </motion.div>
            )}

            {activeGame === 'memory' && (
              <motion.div 
                key="memory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-8 relative z-10"
              >
                <div className="flex justify-between items-center w-full max-w-md mx-auto">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Moves</p>
                    <p className="text-2xl font-black text-white">{memoryMoves}</p>
                  </div>
                  <button onClick={startMemoryGame} className="text-white/40 hover:text-white transition-colors">
                    <RotateCcw size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {cards.map((card) => (
                    <motion.button
                      key={card.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardClick(card.id)}
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10 ${
                        card.isFlipped || card.isMatched ? 'bg-blue-600 text-white' : 'bg-white/5 text-transparent'
                      }`}
                    >
                      <div className={card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}>
                        {card.icon}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {showReward && (
              <motion.div 
                key="reward"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-12 relative z-10"
              >
                <div className="w-32 h-32 bg-blue-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                  <Trophy className="text-white" size={64} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-white tracking-tight">Well Done</h2>
                  <p className="text-white/40 font-medium">You've earned some Zen Points for your mindfulness.</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 px-10 py-6 rounded-[2rem] inline-flex items-center gap-4 text-white font-black text-3xl">
                  <Sparkles className="text-blue-400" size={32} />
                  +{pointsEarned}
                </div>

                <div className="flex gap-6 justify-center">
                  <button 
                    onClick={() => {
                      setShowReward(false);
                      setActiveGame('idle');
                    }}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-12">
          <div className="glass-card p-10 rounded-[3rem] space-y-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Daily Progress</h3>
            <div className="space-y-6">
              {[
                { label: "Mindfulness", value: 65, color: "bg-blue-500" },
                { label: "Focus", value: 40, color: "bg-cyan-500" },
                { label: "Consistency", value: 85, color: "bg-sky-500" }
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-white/40">{stat.label}</span>
                    <span className="text-white">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`${stat.color} h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Science of Play</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Short bursts of mindful play can reduce cortisol levels by up to 25% and improve cognitive flexibility for your next study session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
