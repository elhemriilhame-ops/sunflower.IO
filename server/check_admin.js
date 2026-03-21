const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const checkAndAuthorize = async () => {
  console.log('--- STARTING ADMIN AUTHORIZATION ---');
  try {
    console.log('Connecting to:', MONGO_URI.substring(0, 30) + '...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected successfully!');
    
    // Check for admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('Admin user exists:', admin.email);
      // To be absolutely sure, update their role again
      admin.role = 'admin';
      await admin.save();
      console.log('Admin authorization confirmed.');
    } else {
      console.log('No admin found. Creating default admin...');
      const newAdmin = await User.create({
        name: 'Sunflower Admin',
        email: 'admin@sunflower.io',
        password: 'password123',
        role: 'admin'
      });
      console.log('CREATED: admin@sunflower.io / password123');
    }
    
    console.log('--- AUTHORIZATION COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('--- ERROR ---');
    console.error(err.message);
    process.exit(1);
  }
};

checkAndAuthorize();
