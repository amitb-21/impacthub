import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Import routes (stub for now)
// import authRoutes from './routes/auth.routes.js';
// import ngoRoutes from './routes/ngo.routes.js';
// import eventRoutes from './routes/event.routes.js';
// import aiRoutes from './routes/ai.routes.js';
// import dashboardRoutes from './routes/dashboard.routes.js';
// import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/ngos', ngoRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
// app.use(errorHandler);

export default app;
