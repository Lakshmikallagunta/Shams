import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.ATLAS_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ ATLAS_URI or MONGO_URI missing in .env');
    throw new Error('Database URI not provided');
  }
  
  try {
    // Node.js 22+ compatible options for MongoDB Atlas
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tlsInsecure: false,
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Connection URI:', uri.replace(/\/\/(.*):(.*)@/, '//****:****@')); // Hide credentials
    throw error;
  }
};