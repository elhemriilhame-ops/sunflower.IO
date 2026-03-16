const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load env vars
// dotenv.config();
// \n\n// Connect to database
// connectDB();
// \n\nconst app = express();
// \n\n// Body parser
// app.use(express.json());
// Enable CORS
// \napp.use(cors());
// Static folder for uploads
// app.use('/uploads', express.static('uploads'));
// Mount basic route for testing
// app.get('/', (req, res) => {\n  res.send('API is running...');
// \n});\n\n// We will mount our routes here
// app.use('/api/auth', require('./src/routes/auth'));
// app.use('/api/users', require('./src/routes/users'));
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// });
