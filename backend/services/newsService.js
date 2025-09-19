const axios = require('axios');

class NewsService {
  constructor() {
    // Using NewsAPI for real-time financial news
    this.newsApiKey = process.env.NEWS_API_KEY || 'demo';
    this.newsBaseURL = 'https://newsapi.org/v2';
    
    // Alpha Vantage for additional financial data
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    this.alphaVantageURL = 'https://www.alphavantage.co/query';
    
    this.newsClient = axios.create({
      baseURL: this.newsBaseURL,
      timeout: 10000
    });
    
    this.marketClient = axios.create({
      baseURL: this.alphaVantageURL,
      timeout: 10000
    });
  }

  async getFinancialNews(category = 'business', country = 'in') {
    try {
      // If using demo key, return simulated news
      if (this.newsApiKey === 'demo') {
        return this.generateSimulatedNews();
      }

      const response = await this.newsClient.get('/top-headlines', {
        params: {
          apiKey: this.newsApiKey,
          category,
          country,
          pageSize: 10
        }
      });

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        urlToImage: article.urlToImage,
        category: 'market_news'
      }));
    } catch (error) {
      console.error('Error fetching financial news:', error.message);
      return this.generateSimulatedNews();
    }
  }

  generateSimulatedNews() {
    const newsItems = [
      {
        title: "Indian Stock Market Reaches New Heights as IT Sector Surges",
        description: "Major IT companies like TCS and Infosys drive market gains with strong quarterly results.",
        source: "Financial Express",
        publishedAt: new Date().toISOString(),
        category: "market_news",
        sentiment: "positive"
      },
      {
        title: "HDFC Bank Reports Strong Q3 Results, Stock Up 5%",
        description: "Private sector lender shows robust growth in retail banking segment.",
        source: "Economic Times",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: "stock_update",
        sentiment: "positive"
      },
      {
        title: "Reliance Industries Announces Major Green Energy Investment",
        description: "Company commits ₹75,000 crore for renewable energy expansion.",
        source: "Business Standard",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: "corporate_news",
        sentiment: "positive"
      },
      {
        title: "Asian Paints Maintains Market Leadership in Decorative Segment",
        description: "Company reports steady growth despite challenging market conditions.",
        source: "CNBC TV18",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: "sector_news",
        sentiment: "neutral"
      },
      {
        title: "Mutual Fund Inflows Touch Record High in December",
        description: "SIP contributions continue to drive equity fund growth across all categories.",
        source: "Mint",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: "mutual_funds",
        sentiment: "positive"
      },
      {
        title: "RBI Monetary Policy: Interest Rates Expected to Remain Stable",
        description: "Central bank likely to maintain status quo amid inflation concerns.",
        source: "Moneycontrol",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: "policy_news",
        sentiment: "neutral"
      },
      {
        title: "Gold Prices Rise Amid Global Economic Uncertainty",
        description: "Precious metals see increased demand as safe-haven investment.",
        source: "Reuters",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        category: "commodities",
        sentiment: "positive"
      },
      {
        title: "Startup Funding Shows Signs of Recovery in Indian Market",
        description: "Venture capital investments pick up pace after slowdown.",
        source: "The Hindu BusinessLine",
        publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        category: "market_trends",
        sentiment: "positive"
      }
    ];

    // Randomize the order and add some variation
    return newsItems
      .sort(() => Math.random() - 0.5)
      .map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        readTime: Math.floor(Math.random() * 5) + 2 + ' min read'
      }));
  }

  async getMarketActivity() {
    try {
      const activities = [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'investment',
          title: 'New Investment in TCS',
          description: 'You invested ₹25,000 in Tata Consultancy Services',
          amount: 25000,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'completed',
          icon: 'trending-up'
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'price_alert',
          title: 'HDFC Bank Price Alert',
          description: 'HDFC Bank reached your target price of ₹1,650',
          amount: 1650,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'triggered',
          icon: 'bell'
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'dividend',
          title: 'Dividend Received',
          description: 'Dividend of ₹1,200 received from Reliance Industries',
          amount: 1200,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'credited',
          icon: 'dollar-sign'
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'portfolio_update',
          title: 'Portfolio Rebalanced',
          description: 'Your portfolio was automatically rebalanced',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          icon: 'pie-chart'
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'market_update',
          title: 'Market Update',
          description: 'IT sector gained 3.2% today, leading the market rally',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          status: 'info',
          icon: 'bar-chart'
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'redemption',
          title: 'Investment Redeemed',
          description: 'Mutual fund investment of ₹15,000 redeemed successfully',
          amount: 15000,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          icon: 'arrow-down'
        }
      ];

      return activities;
    } catch (error) {
      console.error('Error generating market activity:', error.message);
      return [];
    }
  }

  async getMarketIndices() {
    try {
      // Generate realistic market index data
      const indices = [
        {
          name: 'NIFTY 50',
          value: 21000 + Math.random() * 2000,
          change: (Math.random() - 0.5) * 200,
          changePercent: (Math.random() - 0.5) * 2,
          lastUpdated: new Date().toISOString()
        },
        {
          name: 'SENSEX',
          value: 70000 + Math.random() * 5000,
          change: (Math.random() - 0.5) * 500,
          changePercent: (Math.random() - 0.5) * 2,
          lastUpdated: new Date().toISOString()
        },
        {
          name: 'NIFTY BANK',
          value: 45000 + Math.random() * 5000,
          change: (Math.random() - 0.5) * 300,
          changePercent: (Math.random() - 0.5) * 3,
          lastUpdated: new Date().toISOString()
        },
        {
          name: 'NIFTY IT',
          value: 32000 + Math.random() * 3000,
          change: (Math.random() - 0.5) * 400,
          changePercent: (Math.random() - 0.5) * 2.5,
          lastUpdated: new Date().toISOString()
        }
      ];

      return indices.map(index => ({
        ...index,
        value: Math.round(index.value * 100) / 100,
        change: Math.round(index.change * 100) / 100,
        changePercent: Math.round(index.changePercent * 100) / 100
      }));
    } catch (error) {
      console.error('Error generating market indices:', error.message);
      return [];
    }
  }

  async getSectorPerformance() {
    try {
      const sectors = [
        'Technology', 'Banking', 'Healthcare', 'Consumer', 'Energy',
        'Materials', 'Industrial', 'Real Estate', 'Utilities', 'Telecom'
      ];

      return sectors.map(sector => ({
        sector,
        performance: Math.round((Math.random() - 0.5) * 10 * 100) / 100, // -5% to +5%
        volume: Math.floor(Math.random() * 1000) + 500,
        marketCap: Math.floor(Math.random() * 50000) + 10000,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error generating sector performance:', error.message);
      return [];
    }
  }

  async getTopMovers() {
    try {
      const stocks = [
        'Reliance Industries', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank',
        'Hindustan Unilever', 'State Bank of India', 'Asian Paints', 'Wipro',
        'Larsen & Toubro', 'Kotak Mahindra Bank', 'Axis Bank', 'Maruti Suzuki',
        'Titan Company', 'Bajaj Finance'
      ];

      const gainers = stocks.slice(0, 5).map(stock => ({
        name: stock,
        price: Math.floor(Math.random() * 3000) + 500,
        change: Math.round((Math.random() * 5 + 1) * 100) / 100, // 1% to 6%
        changePercent: Math.round((Math.random() * 5 + 1) * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000
      }));

      const losers = stocks.slice(5, 10).map(stock => ({
        name: stock,
        price: Math.floor(Math.random() * 3000) + 500,
        change: -Math.round((Math.random() * 5 + 1) * 100) / 100, // -1% to -6%
        changePercent: -Math.round((Math.random() * 5 + 1) * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000
      }));

      const mostActive = stocks.slice(10, 15).map(stock => ({
        name: stock,
        price: Math.floor(Math.random() * 3000) + 500,
        change: Math.round((Math.random() - 0.5) * 6 * 100) / 100,
        changePercent: Math.round((Math.random() - 0.5) * 6 * 100) / 100,
        volume: Math.floor(Math.random() * 5000000) + 1000000
      }));

      return { gainers, losers, mostActive };
    } catch (error) {
      console.error('Error generating top movers:', error.message);
      return { gainers: [], losers: [], mostActive: [] };
    }
  }
}

module.exports = new NewsService();
