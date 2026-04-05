import express from 'express';
import db from '../db.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'studyzen-secret-key';

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', authenticate, (req: any, res) => {
  const { content, is_anonymous } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO forum_posts (user_id, content, is_anonymous) VALUES (?, ?, ?)');
    stmt.run(req.userId, content, is_anonymous ? 1 : 0);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/', (req: any, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  let currentUserId: number | null = null;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      currentUserId = decoded.userId;
    } catch (error) {}
  }

  try {
    const posts = db.prepare(`
      SELECT 
        fp.*, 
        u.name as author_name,
        (SELECT COUNT(*) FROM forum_likes WHERE post_id = fp.id) as likes,
        (SELECT COUNT(*) FROM forum_replies WHERE post_id = fp.id) as replies,
        ${currentUserId ? `(SELECT COUNT(*) FROM forum_likes WHERE post_id = fp.id AND user_id = ${currentUserId})` : '0'} as is_liked
      FROM forum_posts fp 
      JOIN users u ON fp.user_id = u.id 
      ORDER BY fp.created_at DESC
    `).all();
    
    const sanitizedPosts = posts.map((post: any) => ({
      ...post,
      author_name: post.is_anonymous ? 'Anonymous Student' : post.author_name,
      is_liked: post.is_liked > 0
    }));
    
    res.json(sanitizedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/:postId/like', authenticate, (req: any, res) => {
  const { postId } = req.params;
  try {
    const existing = db.prepare('SELECT id FROM forum_likes WHERE post_id = ? AND user_id = ?').get(postId, req.userId);
    if (existing) {
      db.prepare('DELETE FROM forum_likes WHERE post_id = ? AND user_id = ?').run(postId, req.userId);
      res.json({ success: true, liked: false });
    } else {
      db.prepare('INSERT INTO forum_likes (post_id, user_id) VALUES (?, ?)').run(postId, req.userId);
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

router.post('/:postId/reply', authenticate, (req: any, res) => {
  const { postId } = req.params;
  const { content, is_anonymous } = req.body;
  try {
    db.prepare('INSERT INTO forum_replies (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)')
      .run(postId, req.userId, content, is_anonymous ? 1 : 0);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

router.get('/:postId/replies', (req, res) => {
  const { postId } = req.params;
  try {
    const replies = db.prepare(`
      SELECT fr.*, u.name as author_name 
      FROM forum_replies fr 
      JOIN users u ON fr.user_id = u.id 
      WHERE fr.post_id = ? 
      ORDER BY fr.created_at ASC
    `).all(postId);
    
    const sanitizedReplies = replies.map((reply: any) => ({
      ...reply,
      author_name: reply.is_anonymous ? 'Anonymous Student' : reply.author_name
    }));
    
    res.json(sanitizedReplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

export default router;
