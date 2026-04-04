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
  const { plan_data } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO study_plans (user_id, plan_data) VALUES (?, ?)');
    stmt.run(req.userId, JSON.stringify(plan_data));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save study plan' });
  }
});

router.get('/', authenticate, (req: any, res) => {
  try {
    const plan: any = db.prepare('SELECT * FROM study_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.userId);
    if (plan) {
      plan.plan_data = JSON.parse(plan.plan_data);
    }
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study plan' });
  }
});

export default router;
