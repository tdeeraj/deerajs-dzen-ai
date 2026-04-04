import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Heart, 
  Shield, 
  Search,
  MoreHorizontal,
  Send,
  User,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface Post {
  id: number;
  content: string;
  author_name: string;
  is_anonymous: boolean;
  created_at: string;
  likes?: number;
  replies?: number;
  is_liked?: boolean;
}

export default function Forum() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forum');
      const data = await response.json();
      // Add mock likes/replies if not present
      const enhancedData = data.map((p: any) => ({
        ...p,
        likes: p.likes || Math.floor(Math.random() * 50),
        replies: p.replies || Math.floor(Math.random() * 10),
        is_liked: false
      }));
      setPosts(enhancedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.is_liked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
          is_liked: !post.is_liked
        };
      }
      return post;
    }));
  };

  const handleReply = (postId: number) => {
    if (replyingTo === postId) {
      setReplyingTo(null);
      setReplyContent('');
    } else {
      setReplyingTo(postId);
    }
  };

  const submitReply = (postId: number) => {
    if (!replyContent.trim()) return;
    // Mock reply submission
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: (post.replies || 0) + 1
        };
      }
      return post;
    }));
    setReplyingTo(null);
    setReplyContent('');
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost, is_anonymous: isAnonymous }),
      });

      if (response.ok) {
        setNewPost('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 relative">
      <header className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/10 rounded-[2.5rem] text-blue-400 mb-2 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
        >
          <Users size={48} />
        </motion.div>
        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">Peer <br /><span className="text-white/20 italic font-serif font-light">Support Forum</span></h1>
        <p className="text-white/40 max-w-xl mx-auto font-medium text-lg">
          A safe, anonymous space to share your experiences, challenges, and support with fellow students.
        </p>
      </header>

      {/* Create Post */}
      <div className="glass-card p-10 rounded-[3.5rem] border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share what's on your mind... (e.g., exam stress, social anxiety, or a small win!)"
            className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all h-40 resize-none placeholder:text-white/10 font-medium"
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isAnonymous ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'border-white/10 group-hover:border-blue-400/50'
                }`}>
                  {isAnonymous && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isAnonymous} 
                  onChange={() => setIsAnonymous(!isAnonymous)} 
                />
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">Post Anonymously</span>
              </label>
              <div className="flex items-center gap-3 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <Shield size={16} />
                Safe Space
              </div>
            </div>
            <button
              type="submit"
              disabled={!newPost.trim() || isPosting}
              className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isPosting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Post Message
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Recent Discussions</h2>
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all backdrop-blur-xl"
            />
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-white/20">
              <Loader2 className="animate-spin mb-6" size={48} />
              <p className="font-black uppercase tracking-[0.3em] text-xs">Synchronizing discussions...</p>
            </div>
          ) : posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 rounded-[3.5rem] border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border transition-all duration-500 ${
                    post.is_anonymous 
                      ? 'bg-white/5 text-white/20 border-white/5' 
                      : 'bg-blue-600/20 text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  }`}>
                    {post.is_anonymous ? '?' : post.author_name[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-white tracking-tight text-lg">{post.author_name}</h3>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{format(new Date(post.created_at), 'MMM dd, yyyy • p')}</p>
                  </div>
                </div>
                <button className="text-white/20 hover:text-white transition-colors p-2">
                  <MoreHorizontal size={24} />
                </button>
              </div>
              
              <p className="text-white/60 leading-relaxed mb-10 whitespace-pre-wrap text-lg font-medium">
                {post.content}
              </p>
              
              <div className="flex items-center gap-10 pt-8 border-t border-white/5">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-3 transition-all group/btn ${post.is_liked ? 'text-rose-500' : 'text-white/20 hover:text-rose-400'}`}
                >
                  <div className={`p-3 rounded-2xl transition-all ${post.is_liked ? 'bg-rose-500/10 border-rose-500/20' : 'group-hover/btn:bg-rose-500/10 border border-transparent group-hover/btn:border-rose-500/20'}`}>
                    <Heart size={20} fill={post.is_liked ? "currentColor" : "none"} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{post.likes} Support</span>
                </button>
                <button 
                  onClick={() => handleReply(post.id)}
                  className={`flex items-center gap-3 transition-all group/btn ${replyingTo === post.id ? 'text-blue-500' : 'text-white/20 hover:text-blue-400'}`}
                >
                  <div className={`p-3 rounded-2xl transition-all ${replyingTo === post.id ? 'bg-blue-500/10 border-blue-500/20' : 'group-hover/btn:bg-blue-500/10 border border-transparent group-hover/btn:border-blue-500/20'}`}>
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{post.replies} Reply</span>
                </button>
              </div>

              <AnimatePresence>
                {replyingTo === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-white/5 space-y-4"
                  >
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all h-24 resize-none placeholder:text-white/10 font-medium"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => submitReply(post.id)}
                        disabled={!replyContent.trim()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                      >
                        Send Reply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
