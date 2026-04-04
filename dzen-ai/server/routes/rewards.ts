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

router.get('/stats', authenticate, (req: any, res) => {
  try {
    let stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(req.userId);
    if (!stats) {
      db.prepare('INSERT INTO user_stats (user_id, zen_points, streak_days) VALUES (?, 0, 0)').run(req.userId);
      stats = { user_id: req.userId, zen_points: 0, streak_days: 0 };
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/add-points', authenticate, (req: any, res) => {
  const { points } = req.body;
  try {
    db.prepare(`
      INSERT INTO user_stats (user_id, zen_points) 
      VALUES (?, ?) 
      ON CONFLICT(user_id) DO UPDATE SET zen_points = zen_points + ?
    `).run(req.userId, points, points);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update points' });
  }
});

export default router;
