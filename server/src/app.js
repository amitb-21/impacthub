import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import mainRouter from './routes/mainrouter.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'https://impacthub-two.vercel.app',
    credentials: true,
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', mainRouter);

// Root route - plain JSON welcome
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to ImpactHub API',
    docs: '/api',
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handler
app.use(errorHandler);

export default app;
