const newsService = require('../services/newsService');

// @desc    Get financial news
// @route   GET /api/market/news
// @access  Public
const getFinancialNews = async (req, res) => {
  try {
    const { category = 'business', country = 'in', limit = 10 } = req.query;
    
    const news = await newsService.getFinancialNews(category, country);
    const limitedNews = news.slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: limitedNews.length,
      data: limitedNews
    });
  } catch (error) {
    console.error('Get financial news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching financial news'
    });
  }
};

// @desc    Get recent market activities
// @route   GET /api/market/activities
// @access  Private
const getMarketActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const activities = await newsService.getMarketActivity();
    const limitedActivities = activities.slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: limitedActivities.length,
      data: limitedActivities
    });
  } catch (error) {
    console.error('Get market activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market activities'
    });
  }
};

// @desc    Get market indices
// @route   GET /api/market/indices
// @access  Public
const getMarketIndices = async (req, res) => {
  try {
    const indices = await newsService.getMarketIndices();
    
    res.status(200).json({
      success: true,
      count: indices.length,
      data: indices
    });
  } catch (error) {
    console.error('Get market indices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market indices'
    });
  }
};

// @desc    Get sector performance
// @route   GET /api/market/sectors
// @access  Public
const getSectorPerformance = async (req, res) => {
  try {
    const sectors = await newsService.getSectorPerformance();
    
    res.status(200).json({
      success: true,
      count: sectors.length,
      data: sectors
    });
  } catch (error) {
    console.error('Get sector performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sector performance'
    });
  }
};

// @desc    Get top movers (gainers, losers, most active)
// @route   GET /api/market/movers
// @access  Public
const getTopMovers = async (req, res) => {
  try {
    const movers = await newsService.getTopMovers();
    
    res.status(200).json({
      success: true,
      data: movers
    });
  } catch (error) {
    console.error('Get top movers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top movers'
    });
  }
};

// @desc    Get comprehensive market overview
// @route   GET /api/market/overview
// @access  Public
const getMarketOverview = async (req, res) => {
  try {
    // Fetch all market data in parallel
    const [indices, sectors, movers, news] = await Promise.all([
      newsService.getMarketIndices(),
      newsService.getSectorPerformance(),
      newsService.getTopMovers(),
      newsService.getFinancialNews('business', 'in')
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        indices: indices.slice(0, 4),
        sectors: sectors.slice(0, 5),
        movers: {
          gainers: movers.gainers.slice(0, 3),
          losers: movers.losers.slice(0, 3),
          mostActive: movers.mostActive.slice(0, 3)
        },
        news: news.slice(0, 5),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get market overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market overview'
    });
  }
};

// @desc    Get trending topics
// @route   GET /api/market/trending
// @access  Public
const getTrendingTopics = async (req, res) => {
  try {
    const trendingTopics = [
      {
        id: 1,
        topic: 'AI & Technology Stocks',
        description: 'Artificial intelligence companies see massive growth',
        volume: 15000,
        sentiment: 'positive',
        change: '+12.5%'
      },
      {
        id: 2,
        topic: 'Green Energy',
        description: 'Renewable energy investments surge globally',
        volume: 12000,
        sentiment: 'positive',
        change: '+8.3%'
      },
      {
        id: 3,
        topic: 'Banking Sector',
        description: 'Private banks report strong quarterly results',
        volume: 10000,
        sentiment: 'positive',
        change: '+5.7%'
      },
      {
        id: 4,
        topic: 'Cryptocurrency',
        description: 'Digital assets show renewed investor interest',
        volume: 8000,
        sentiment: 'neutral',
        change: '+2.1%'
      },
      {
        id: 5,
        topic: 'Real Estate',
        description: 'Property markets stabilize after recent volatility',
        volume: 7500,
        sentiment: 'neutral',
        change: '-1.2%'
      }
    ];
    
    res.status(200).json({
      success: true,
      count: trendingTopics.length,
      data: trendingTopics
    });
  } catch (error) {
    console.error('Get trending topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trending topics'
    });
  }
};

// @desc    Get portfolio insights
// @route   GET /api/market/insights
// @access  Private
const getPortfolioInsights = async (req, res) => {
  try {
    const insights = [
      {
        id: 1,
        type: 'recommendation',
        title: 'Portfolio Diversification Opportunity',
        description: 'Consider increasing allocation to healthcare sector for better balance',
        priority: 'medium',
        actionRequired: true,
        impact: 'positive'
      },
      {
        id: 2,
        type: 'alert',
        title: 'High Tech Exposure',
        description: 'Your portfolio has 45% allocation in technology - consider rebalancing',
        priority: 'high',
        actionRequired: true,
        impact: 'warning'
      },
      {
        id: 3,
        type: 'opportunity',
        title: 'Banking Stocks Undervalued',
        description: 'Current market conditions present good entry points for banking stocks',
        priority: 'low',
        actionRequired: false,
        impact: 'positive'
      },
      {
        id: 4,
        type: 'performance',
        title: 'Strong Portfolio Performance',
        description: 'Your portfolio outperformed market by 3.2% this quarter',
        priority: 'info',
        actionRequired: false,
        impact: 'positive'
      }
    ];
    
    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    console.error('Get portfolio insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching portfolio insights'
    });
  }
};

module.exports = {
  getFinancialNews,
  getMarketActivities,
  getMarketIndices,
  getSectorPerformance,
  getTopMovers,
  getMarketOverview,
  getTrendingTopics,
  getPortfolioInsights
};
