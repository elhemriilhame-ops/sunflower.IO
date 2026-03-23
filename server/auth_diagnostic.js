const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const diagnostic = async () => {
  console.log('--- STARTING DIAGNOSTIC ---');
  try {
    const MONGO_URI = process.env.MONGO_URI;
    console.log('Target URI:', MONGO_URI.substring(0, 30) + '...');
    
    await mongoose.connect(MONGO_URI, { 
      serverSelectionTimeoutMS: 10000 
    });
    console.log('>>> CONNECTED TO DB');

    const email = 'admin@sunflower.io';
    const rawPassword = 'password123';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('CRITICAL: Admin user not found in database!');
      process.exit(1);
    }

    console.log('User found in DB:', user.email);
    console.log('Role found in DB:', user.role);

    const isMatch = await user.matchPassword(rawPassword);
    console.log('Password match diagnosis:', isMatch ? 'SUCCESS' : 'FAILURE');

    process.exit(0);
  } catch (err) {
    console.error('DIAGNOSTIC FAILED:', err.message);
    process.exit(1);
  }
};

diagnostic();
