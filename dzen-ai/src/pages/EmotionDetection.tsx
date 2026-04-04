import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Camera, RefreshCw, Sparkles, Heart, Wind, Brain, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";

export default function EmotionDetection() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isStreaming]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      setIsStreaming(true);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please click the camera icon in your browser's address bar to allow access.");
      } else {
        setError("Could not access camera. Please ensure no other app is using it and try again.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const analyzeEmotion = async () => {
    if (!videoRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("Starting emotion analysis...");
      // 1. Capture frame
      const canvas = document.createElement('canvas');
      if (!videoRef.current) throw new Error("Video reference not found");
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(videoRef.current, 0, 0);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      console.log("Frame captured, calling Gemini...");

      // 2. Call Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not configured");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze the person's facial expression in this image and identify their primary emotion. Return ONLY one word from this list: happy, sad, stressed, neutral, angry. Do not include any other text."
          }
        ]
      });

      console.log("Gemini response received:", response.text);
      const result = response.text?.toLowerCase().trim() || 'neutral';
      const validEmotions = ['happy', 'sad', 'stressed', 'neutral', 'angry'];
      const finalEmotion = validEmotions.includes(result) ? result : 'neutral';
      
      setDetectedEmotion(finalEmotion);
      
      const recommendations: any = {
        happy: {
          title: "You're glowing!",
          desc: "It's a great time to tackle your most challenging study tasks while your energy is high.",
          icon: <Sparkles className="text-blue-400" />,
          activity: "Productive Sprint",
          path: "/planner"
        },
        sad: {
          title: "It's okay to feel this way",
          desc: "Consider taking a short break. A quick walk or listening to your favorite music might help.",
          icon: <Heart className="text-blue-400" />,
          activity: "Self-Care Break",
          path: "/zen-zone?game=bubbles"
        },
        stressed: {
          title: "Take a deep breath",
          desc: "Your stress levels seem high. Let's try a 4-7-8 breathing exercise to calm your nervous system.",
          icon: <Wind className="text-blue-400" />,
          activity: "Breathing Exercise",
          path: "/zen-zone?game=breathing"
        },
        neutral: {
          title: "Steady and focused",
          desc: "You're in a good state for consistent work. Try the Pomodoro technique to maintain this balance.",
          icon: <Brain className="text-blue-400" />,
          activity: "Pomodoro Session",
          path: "/planner"
        },
        angry: {
          title: "Release the tension",
          desc: "Physical movement can help process frustration. Try some quick stretching or a high-energy song.",
          icon: <RefreshCw className="text-blue-400" />,
          activity: "Physical Reset",
          path: "/zen-zone?game=bubbles"
        }
      };
      
      setRecommendation(recommendations[finalEmotion]);
      
      // Log to backend
      await fetch('/api/mood/emotion', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emotion: finalEmotion, confidence: 1.0 }),
      });

    } catch (err: any) {
      console.error('Emotion analysis error:', err);
      setError(err.message || "Failed to analyze emotion. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-16 relative">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <div className="w-8 h-[1px] bg-white/20" />
          AI Vision
        </motion.div>
        <h1 className="text-7xl font-black text-white tracking-tighter leading-none">Emotion <br /><span className="text-white/20 italic font-serif font-light">Detection</span></h1>
        <p className="text-white/40 max-w-xl font-medium text-lg">Use your camera to let Deeraj's AI analyze your mood and suggest the best activities.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Camera Feed */}
        <div className="glass-card p-10 rounded-[4rem] border border-white/5 overflow-hidden">
          <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden mb-10 group border border-white/5 shadow-2xl">
            {error && (
              <div className="absolute top-6 left-6 right-6 z-20">
                <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex items-center gap-4 text-rose-500 shadow-2xl backdrop-blur-xl">
                  <AlertCircle size={24} className="flex-shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              </div>
            )}
            {!isStreaming ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10">
                  <Camera size={48} className="opacity-20" />
                </div>
                <button 
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20"
                >
                  Enable Camera
                </button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 flex gap-3">
                  <div className="px-5 py-2 bg-black/50 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-3 border border-white/10">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
                    Live Feed
                  </div>
                </div>
              </>
            )}
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-xl flex items-center justify-center">
                <div className="text-center space-y-6">
                  <RefreshCw size={64} className="text-white animate-spin mx-auto" />
                  <p className="text-white font-black uppercase tracking-[0.3em] text-xs">Analyzing Expressions...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <button
              disabled={!isStreaming || isAnalyzing}
              onClick={analyzeEmotion}
              className="flex-1 bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              Analyze My Mood
            </button>
            {isStreaming && (
              <button
                onClick={stopCamera}
                className="px-10 py-6 border border-white/10 text-white/40 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Results & Recommendations */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {detectedEmotion ? (
              <motion.div
                key={detectedEmotion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-12 rounded-[4rem] border border-white/5 h-full flex flex-col"
              >
                <div className="flex items-center gap-8 mb-12">
                  <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner border border-white/5">
                    {detectedEmotion === 'happy' && '😊'}
                    {detectedEmotion === 'sad' && '😢'}
                    {detectedEmotion === 'stressed' && '😫'}
                    {detectedEmotion === 'neutral' && '😐'}
                    {detectedEmotion === 'angry' && '😡'}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Detected Emotion</p>
                    <h2 className="text-5xl font-black text-white capitalize tracking-tighter">{detectedEmotion}</h2>
                  </div>
                </div>

                <div className="space-y-10 flex-1 flex flex-col justify-between">
                  <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                      {recommendation?.icon}
                      <h3 className="text-xl font-black text-white tracking-tight">{recommendation?.title}</h3>
                    </div>
                    <p className="text-white/40 leading-relaxed font-medium text-lg">
                      {recommendation?.desc}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Suggested Activity</h4>
                    <div className="flex items-center justify-between p-8 bg-blue-600 text-white rounded-[3rem] shadow-2xl shadow-blue-500/20 group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                          <Wind size={32} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">{recommendation?.activity}</span>
                      </div>
                      <button 
                        onClick={() => navigate(recommendation.path)}
                        className="px-8 py-4 bg-white text-black rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-2xl"
                      >
                        Start Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-[4rem] border border-white/5 h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mb-10 border border-white/5">
                  <Sparkles className="text-white/10" size={64} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Ready to Analyze</h3>
                <p className="text-white/40 max-w-xs font-medium leading-relaxed">
                  Enable your camera and click the button to see how Deeraj's AI can help you today.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
