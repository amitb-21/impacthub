import express from 'express';
const router = express.Router();
import airouter from './ai.routes.js';
import authrouter from './auth.routes.js';
import dashboardrouter from './dashboard.routes.js';
import eventrouter from './event.routes.js';
import ngorouter from './ngo.routes.js';
import testrouter from './test.routes.js';

router.use('/auth', authrouter);
router.use('/ngo', ngorouter);
router.use('/event', eventrouter);
router.use('/ai', airouter);
router.use('/dash', dashboardrouter);
router.use('/test', testrouter);

export default router;