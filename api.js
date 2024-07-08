import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './backend/routes/authRoutes.js';
import friendshipRoutes from './backend/routes/friendshipRoutes.js';
import memoryRoutes from './backend/routes/memoryRoutes.js';
import fileRoutes from './backend/routes/fileRoutes.js';
import { initializeDatabase } from './backend/config/database.js';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
const port = 4001;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api', authRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/files', fileRoutes);
// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
