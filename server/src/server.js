//import 'dotenv/config';
import { connectDB } from './config/db.js';
import app from './app.js';

const PORT =5050;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
