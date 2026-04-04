import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chat() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm Deeraj's AI. I'm here to support you with your mental health and academic journey. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are Deeraj's AI, a supportive mental health and academic companion for university students. Your goal is to provide empathetic, practical, and encouraging advice. Help students manage stress, academic pressure, and emotional well-being. If a user expresses severe distress or self-harm, gently guide them to professional help and provide emergency resources."
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'bot', content: response.text || '' }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I couldn't generate a response. Please try again." }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: "Something went wrong. Please check your connection and API key configuration." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', content: "Chat cleared. How can I help you now?" }]);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative w-full">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            <div className="w-8 h-[1px] bg-blue-500/20" />
            AI Companion
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Deeraj's <span className="text-white/20 italic font-serif font-light">Chat</span></h1>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Online</span>
        </div>
      </header>

      <div className="flex-1 glass-card rounded-[4rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black border transition-all duration-500 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                    : 'bg-white/5 text-blue-400 border-white/10'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-medium ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-2xl shadow-blue-900/20'
                    : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5 backdrop-blur-xl'
                }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">AI is thinking</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white/5 border-t border-white/5 backdrop-blur-2xl">
          <form onSubmit={handleSend} className="flex gap-4 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-10 py-6 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10 font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white p-6 rounded-full hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 group-hover:scale-105 active:scale-95"
            >
              <Send size={24} />
            </button>
          </form>
          <div className="flex items-center justify-between mt-6 px-2">
            <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">
              AI Companion
            </p>
            <button 
              onClick={clearChat}
              className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-rose-400 transition-colors flex items-center gap-2"
            >
              <Trash2 size={12} />
              Clear Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
