const StockPrice = require('../models/StockPrice');
const StockHistory = require('../models/StockHistory');
const marketDataService = require('../services/marketDataService');

// @desc    Get all stocks with current prices
// @route   GET /api/stocks
// @access  Public
const getAllStocks = async (req, res) => {
  try {
    const { sector, exchange, limit = 20, sort = '-changePercent' } = req.query;
    
    const filter = { isActive: true };
    if (sector) filter.sector = sector;
    if (exchange) filter.exchange = exchange;
    
    const stocks = await StockPrice.find(filter)
      .sort(sort)
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    console.error('Get all stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stocks'
    });
  }
};

// @desc    Get stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Public
const getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const stock = await StockPrice.findOne({ 
      symbol: symbol.toUpperCase(), 
      isActive: true 
    });
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stock'
    });
  }
};

// @desc    Get stock price history
// @route   GET /api/stocks/:symbol/history
// @access  Public
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { 
      range = '1M', // 1D, 5D, 1M, 3M, 6M, 1Y, 5Y
      timeframe = '1day',
      limit = 100 
    } = req.query;
    
    let days;
    switch (range) {
      case '1D': days = 1; break;
      case '5D': days = 5; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      case '6M': days = 180; break;
      case '1Y': days = 365; break;
      case '5Y': days = 1825; break;
      default: days = 30;
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const history = await StockHistory.getHistoryByDateRange(
      symbol, 
      startDate, 
      new Date(), 
      timeframe
    );
    
    // Format data for charts
    const chartData = history.map(item => item.toChartData());
    
    res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      range,
      timeframe,
      count: chartData.length,
      data: chartData
    });
  } catch (error) {
    console.error('Get stock history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stock history'
    });
  }
};

// @desc    Get market movers (gainers, losers, most active)
// @route   GET /api/stocks/movers
// @access  Public
const getMarketMovers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const movers = await marketDataService.getMarketMovers();
    
    res.status(200).json({
      success: true,
      data: {
        gainers: movers.gainers.slice(0, limit),
        losers: movers.losers.slice(0, limit),
        mostActive: movers.mostActive.slice(0, limit)
      }
    });
  } catch (error) {
    console.error('Get market movers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market movers'
    });
  }
};

// @desc    Get stocks by sector
// @route   GET /api/stocks/sector/:sector
// @access  Public
const getStocksBySector = async (req, res) => {
  try {
    const { sector } = req.params;
    const { limit = 10 } = req.query;
    
    const stocks = await StockPrice.find({ 
      sector: sector,
      isActive: true 
    })
    .sort({ marketCap: -1 })
    .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      sector,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    console.error('Get stocks by sector error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stocks by sector'
    });
  }
};

// @desc    Search stocks
// @route   GET /api/stocks/search
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const stocks = await StockPrice.find({
      isActive: true,
      $or: [
        { symbol: new RegExp(q, 'i') },
        { name: new RegExp(q, 'i') }
      ]
    })
    .limit(parseInt(limit))
    .select('symbol name currentPrice change changePercent sector exchange');
    
    res.status(200).json({
      success: true,
      query: q,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching stocks'
    });
  }
};

// @desc    Force update stock prices (admin only)
// @route   POST /api/stocks/update
// @access  Private/Admin
const forceUpdatePrices = async (req, res) => {
  try {
    await marketDataService.updateAllStockPrices();
    
    res.status(200).json({
      success: true,
      message: 'Stock price update initiated'
    });
  } catch (error) {
    console.error('Force update prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating prices'
    });
  }
};

// @desc    Initialize historical data (admin only)
// @route   POST /api/stocks/initialize
// @access  Private/Admin
const initializeData = async (req, res) => {
  try {
    const { symbol, days = 30 } = req.body;
    
    if (symbol) {
      // Initialize data for specific symbol
      await marketDataService.initializeHistoricalData(symbol, days);
      res.status(200).json({
        success: true,
        message: `Historical data initialized for ${symbol}`
      });
    } else {
      // Initialize data for all stocks
      await marketDataService.initializeAllHistoricalData();
      res.status(200).json({
        success: true,
        message: 'Historical data initialization started for all stocks'
      });
    }
  } catch (error) {
    console.error('Initialize data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while initializing data'
    });
  }
};

// @desc    Get market summary
// @route   GET /api/stocks/summary
// @access  Public
const getMarketSummary = async (req, res) => {
  try {
    const totalStocks = await StockPrice.countDocuments({ isActive: true });
    const gainers = await StockPrice.countDocuments({ 
      isActive: true, 
      change: { $gt: 0 } 
    });
    const losers = await StockPrice.countDocuments({ 
      isActive: true, 
      change: { $lt: 0 } 
    });
    const unchanged = totalStocks - gainers - losers;
    
    // Get sector performance
    const sectorPerformance = await StockPrice.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$sector',
          avgChange: { $avg: '$changePercent' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgChange: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStocks,
          gainers,
          losers,
          unchanged,
          gainerPercentage: ((gainers / totalStocks) * 100).toFixed(1),
          loserPercentage: ((losers / totalStocks) * 100).toFixed(1)
        },
        sectorPerformance
      }
    });
  } catch (error) {
    console.error('Get market summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market summary'
    });
  }
};

module.exports = {
  getAllStocks,
  getStock,
  getStockHistory,
  getMarketMovers,
  getStocksBySector,
  searchStocks,
  forceUpdatePrices,
  initializeData,
  getMarketSummary
};
