import express from 'express';
const router = express.Router();

// Import all route modules
import authRouter from './auth.routes.js';
import ngoRouter from './ngo.routes.js';
import eventRouter from './event.routes.js';
import aiRouter from './ai.routes.js';
import dashboardRouter from './dashboard.routes.js';
import participationRouter from './participation.routes.js';
import verificationRouter from './verification.routes.js';
import testRouter from './test.routes.js';
import userRouter from './user.routes.js';

// Mount all routes
router.use('/auth', authRouter);
router.use('/ngos', ngoRouter);
router.use('/events', eventRouter);
router.use('/ai', aiRouter);
router.use('/dashboard', dashboardRouter);
router.use('/participations', participationRouter);
router.use('/verification-reports', verificationRouter);
router.use('/test', testRouter);
router.use('/users', userRouter); // For admin verification of NGO admins

export default router;