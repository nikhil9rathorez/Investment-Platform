const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/error');
const marketDataService = require('./services/marketDataService');

// Load environment variables
dotenv.config();

// Connect to database
connectDatabase();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://localhost:5173'] // Add your frontend URLs
    : true,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini Investment Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  
  // Initialize market data service
  setTimeout(async () => {
    try {
      console.log('📈 Initializing market data...');
      await marketDataService.updateAllStockPrices();
      marketDataService.startRealTimeUpdates();
      console.log('✅ Market data service initialized');
    } catch (error) {
      console.error('❌ Error initializing market data:', error.message);
    }
  }, 5000); // Wait 5 seconds after server start
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  marketDataService.stopRealTimeUpdates();
  server.close(() => {
    console.log('💀 Process terminated');
  });
});
