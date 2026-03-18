const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
const connectDB  = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser (needed by JWT middleware)
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./src/routes/authRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running...' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
