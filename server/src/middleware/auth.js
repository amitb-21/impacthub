import admin from '../config/firebase.js';

export default async function auth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { id: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
