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

router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT fp.*, u.name as author_name 
      FROM forum_posts fp 
      JOIN users u ON fp.user_id = u.id 
      ORDER BY fp.created_at DESC
    `).all();
    
    const sanitizedPosts = posts.map((post: any) => ({
      ...post,
      author_name: post.is_anonymous ? 'Anonymous Student' : post.author_name
    }));
    
    res.json(sanitizedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

export default router;
