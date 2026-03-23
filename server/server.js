const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const helmet       = require('helmet');
const xss          = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp          = require('hpp');
const rateLimit    = require('express-rate-limit');
const colors       = require('colors');
const connectDB    = require('./src/config/db');
const errorHandler = require('./src/middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────────

// Body parser
app.use(express.json());

// Cookie parser (needed by JWT middleware)
app.use(cookieParser());

// Enable CORS with credentials support for frontend origin
app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests per window
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth',       require('./src/routes/authRoutes'));
app.use('/api/pepinieres', require('./src/routes/pepiniereRoutes'));
app.use('/api/products',   require('./src/routes/productRoutes'));
app.use('/api/admin',      require('./src/routes/adminRoutes'));
app.use('/api/articles',   require('./src/routes/articleRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running...' });
});

// Centralized Error Handler (Must be after routes)
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold);
});
