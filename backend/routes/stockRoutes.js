const express = require('express');
const {
  getAllStocks,
  getStock,
  getStockHistory,
  getMarketMovers,
  getStocksBySector,
  searchStocks,
  forceUpdatePrices,
  initializeData,
  getMarketSummary
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllStocks);
router.get('/search', searchStocks);
router.get('/movers', getMarketMovers);
router.get('/summary', getMarketSummary);
router.get('/sector/:sector', getStocksBySector);
router.get('/:symbol', getStock);
router.get('/:symbol/history', getStockHistory);

// Admin only routes
router.post('/update', protect, authorize('admin'), forceUpdatePrices);
router.post('/initialize', protect, authorize('admin'), initializeData);

module.exports = router;
