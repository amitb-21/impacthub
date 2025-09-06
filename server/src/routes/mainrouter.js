import express from 'express'
const router=express.Router();
import airouter from './ai.routes';
import authrouter from './auth.routes';
import dashboardrouter from './dashboard.routes';
import eventrouter from './event.routes';
import ngorouter from './ngo.routes';
import testrouter from './test.routes';
router.use(airouter);
router.use(authrouter);
router.use(dashboardrouter);
router.use(eventrouter);
router.use(ngorouter);
router.use(testrouter);
export default router;