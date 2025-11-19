# SHAMS - Hostel Management System Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm package manager

## Deployment Steps

### 1. Install Dependencies
```bash
# From the root directory
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database - MongoDB Connection
ATLAS_URI=mongodb://localhost:27017/shams
# For MongoDB Atlas, use:
# ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/shams?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL
CLIENT_URL=http://localhost:3000
```

### 3. Build the Application
```bash
# From the root directory
npm run deploy
```

Or manually build:
```bash
# Build frontend
cd frontend
npm run build
cd ..
```

### 4. Run in Production Mode
```bash
# From the backend directory
cd backend
$env:NODE_ENV="production"
node server.js
```

The application will be accessible at http://localhost:5000

## Development Mode
To run in development mode with both frontend and backend servers:
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Project Structure
```
shams/
├── backend/          # Node.js Express API server
├── frontend/         # React frontend application
├── deploy.js         # Deployment script
└── DEPLOYMENT.md     # This file
```

## Features
- Role-based access: Admin, Warden, Student
- Hostel management
- Room allocation
- Mess management
- Attendance tracking
- Leave management
- Complaint system
- Face recognition for attendance
- Real-time notifications with Socket.IO

## Troubleshooting
1. **Database Connection Issues**: Ensure MongoDB is running and connection string is correct
2. **Port Conflicts**: Change PORT in .env if 5000 is in use
3. **Build Errors**: Ensure all dependencies are installed with `npm install`