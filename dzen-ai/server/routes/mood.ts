import express from 'express';
import db from '../db.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'studyzen-secret-key';

// Middleware to verify token
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
  const { mood, stress_level, note } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO moods (user_id, mood, stress_level, note) VALUES (?, ?, ?, ?)');
    stmt.run(req.userId, mood, stress_level, note);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

router.get('/history', authenticate, (req: any, res) => {
  try {
    const moods = db.prepare('SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 30').all(req.userId);
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

router.post('/emotion', authenticate, (req: any, res) => {
  const { emotion, confidence } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO emotion_logs (user_id, emotion, confidence) VALUES (?, ?, ?)');
    stmt.run(req.userId, emotion, confidence);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log emotion' });
  }
});

export default router;
