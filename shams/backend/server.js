import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { autoMarkLeaveAttendance } from './services/autoAttendanceService.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import wardenRoutes from './routes/wardenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import messRoutes from './routes/messRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import studentReturnRoutes from './routes/studentReturnRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import adminHostelRoutes from './routes/adminHostelRoutes.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Configure CORS for multiple deployment environments
const allowedOrigins = [
  'http://localhost:3000',
  'https://shams-2.onrender.com',
  'https://shams.vercel.app',
  'https://*.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Connect to database with error handling
let dbConnected = false;
connectDB().then(() => {
  console.log('✅ Database connected successfully');
  dbConnected = true;
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  console.log('⚠️  Server will start without database connection - some features may not work');
  dbConnected = false;
});

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard patterns
        const regex = new RegExp(allowedOrigin.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (!isAllowed) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Health check endpoint that also shows database status
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminHostelRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/student-return', studentReturnRoutes);
app.use('/api/password', passwordRoutes);

// For development, we'll handle the root route to show API status
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'SHAMS API Server Running',
      database: dbConnected ? 'connected' : 'disconnected'
    });
  });
}

app.use(notFound);
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Auto-attendance cron job - runs daily at 12:01 AM
cron.schedule('1 0 * * *', async () => {
  console.log('🕐 Running auto-attendance job...');
  try {
    // Only run if database is connected
    if (dbConnected) {
      const result = await autoMarkLeaveAttendance();
      if (result.success) {
        console.log(`✅ Auto-attendance completed: ${result.count} students marked`);
      }
    } else {
      console.log('⚠️  Skipping auto-attendance - database not connected');
    }
  } catch (error) {
    console.error('❌ Auto-attendance failed:', error.message);
  }
});

// Manual trigger for testing (run on server start)
setTimeout(async () => {
  console.log('🔄 Running initial auto-attendance check...');
  try {
    // Only run if database is connected
    if (dbConnected) {
      await autoMarkLeaveAttendance();
    } else {
      console.log('⚠️  Skipping initial auto-attendance - database not connected');
    }
  } catch (error) {
    console.error('❌ Initial auto-attendance failed:', error.message);
  }
}, 5000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`✅ SHAMS API on :${PORT} with Socket.io enabled`));