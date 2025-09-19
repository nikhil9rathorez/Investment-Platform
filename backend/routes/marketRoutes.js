const express = require('express');
const {
  getFinancialNews,
  getMarketActivities,
  getMarketIndices,
  getSectorPerformance,
  getTopMovers,
  getMarketOverview,
  getTrendingTopics,
  getPortfolioInsights
} = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/news', getFinancialNews);
router.get('/indices', getMarketIndices);
router.get('/sectors', getSectorPerformance);
router.get('/movers', getTopMovers);
router.get('/overview', getMarketOverview);
router.get('/trending', getTrendingTopics);

// Private routes (require authentication)
router.get('/activities', protect, getMarketActivities);
router.get('/insights', protect, getPortfolioInsights);

module.exports = router;
