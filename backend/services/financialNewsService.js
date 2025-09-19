const axios = require('axios');

class FinancialNewsService {
  constructor() {
    // Using NewsAPI for financial news (free tier available)
    this.newsApiKey = process.env.NEWS_API_KEY || 'demo';
    this.newsBaseURL = 'https://newsapi.org/v2';
    
    // Alpha Vantage for additional market data (free tier available)
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    this.alphaVantageURL = 'https://www.alphavantage.co/query';
    
    this.client = axios.create({
      timeout: 10000
    });
  }

  // Get latest financial news
  async getFinancialNews(limit = 10) {
    try {
      if (this.newsApiKey === 'demo') {
        return this.generateMockNews(limit);
      }

      const response = await this.client.get(`${this.newsBaseURL}/everything`, {
        params: {
          q: 'stocks OR markets OR finance OR investment',
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: limit,
          apiKey: this.newsApiKey
        }
      });

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        image: article.urlToImage
      }));
    } catch (error) {
      console.error('Error fetching financial news:', error.message);
      return this.generateMockNews(limit);
    }
  }

  // Get market sentiment and trending topics
  async getMarketSentiment() {
    try {
      return {
        sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100
        trendingTopics: [
          'AI & Technology',
          'Green Energy',
          'Banking Sector',
          'Cryptocurrency',
          'Real Estate'
        ],
        marketMood: this.generateMarketMood()
      };
    } catch (error) {
      console.error('Error getting market sentiment:', error.message);
      return this.getDefaultSentiment();
    }
  }

  // Generate recent activity feed
  async getRecentActivities(limit = 20) {
    try {
      const activities = [];
      const activityTypes = ['investment', 'withdrawal', 'dividend', 'news', 'alert'];
      const companies = [
        'Reliance Industries', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank',
        'Hindustan Unilever', 'Asian Paints', 'Wipro', 'L&T', 'SBI'
      ];
      
      for (let i = 0; i < limit; i++) {
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;
        const time = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        let activity = {
          id: `activity_${i + 1}`,
          type,
          timestamp: time,
          company
        };

        switch (type) {
          case 'investment':
            activity.title = `New investment in ${company}`;
            activity.description = `₹${amount.toLocaleString('en-IN')} invested`;
            activity.impact = 'positive';
            break;
          case 'withdrawal':
            activity.title = `Withdrawal processed`;
            activity.description = `₹${amount.toLocaleString('en-IN')} withdrawn from ${company}`;
            activity.impact = 'neutral';
            break;
          case 'dividend':
            activity.title = `Dividend received from ${company}`;
            activity.description = `₹${(amount * 0.1).toLocaleString('en-IN')} dividend credited`;
            activity.impact = 'positive';
            break;
          case 'news':
            activity.title = `${company} announces quarterly results`;
            activity.description = 'Strong performance drives market confidence';
            activity.impact = 'positive';
            break;
          case 'alert':
            activity.title = `Price alert for ${company}`;
            activity.description = `Target price of ₹${amount} reached`;
            activity.impact = 'neutral';
            break;
        }

        activities.push(activity);
      }
      
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error generating recent activities:', error.message);
      return [];
    }
  }

  // Get market overview data
  async getMarketOverview() {
    try {
      const indices = [
        {
          name: 'NIFTY 50',
          value: 19800 + Math.floor(Math.random() * 400) - 200,
          change: Math.floor(Math.random() * 200) - 100,
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        },
        {
          name: 'SENSEX',
          value: 66500 + Math.floor(Math.random() * 1000) - 500,
          change: Math.floor(Math.random() * 500) - 250,
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        },
        {
          name: 'BANK NIFTY',
          value: 44800 + Math.floor(Math.random() * 800) - 400,
          change: Math.floor(Math.random() * 300) - 150,
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        }
      ];

      const sectors = [
        { name: 'Technology', performance: (Math.random() * 6 - 3).toFixed(2) },
        { name: 'Banking', performance: (Math.random() * 4 - 2).toFixed(2) },
        { name: 'Energy', performance: (Math.random() * 5 - 2.5).toFixed(2) },
        { name: 'Healthcare', performance: (Math.random() * 3 - 1.5).toFixed(2) },
        { name: 'Consumer', performance: (Math.random() * 4 - 2).toFixed(2) }
      ];

      const globalMarkets = [
        { name: 'S&P 500', value: 4200, change: Math.floor(Math.random() * 40) - 20 },
        { name: 'NASDAQ', value: 13100, change: Math.floor(Math.random() * 80) - 40 },
        { name: 'Nikkei', value: 32800, change: Math.floor(Math.random() * 200) - 100 }
      ];

      return {
        indices,
        sectors,
        globalMarkets,
        marketStatus: this.getMarketStatus(),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting market overview:', error.message);
      return this.getDefaultMarketOverview();
    }
  }

  // Get trending investments
  async getTrendingInvestments(limit = 10) {
    try {
      const trendingData = [
        { symbol: 'RELIANCE', name: 'Reliance Industries', trend: 'up', volume: 'high' },
        { symbol: 'TCS', name: 'Tata Consultancy Services', trend: 'up', volume: 'high' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank', trend: 'stable', volume: 'medium' },
        { symbol: 'INFY', name: 'Infosys', trend: 'up', volume: 'high' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', trend: 'down', volume: 'medium' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', trend: 'stable', volume: 'low' },
        { symbol: 'ASIANPAINT', name: 'Asian Paints', trend: 'up', volume: 'medium' },
        { symbol: 'WIPRO', name: 'Wipro', trend: 'down', volume: 'medium' },
        { symbol: 'LT', name: 'Larsen & Toubro', trend: 'up', volume: 'high' },
        { symbol: 'SBIN', name: 'State Bank of India', trend: 'stable', volume: 'medium' }
      ];

      return trendingData.slice(0, limit).map(item => ({
        ...item,
        price: Math.floor(Math.random() * 3000) + 500,
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: (Math.random() * 6 - 3).toFixed(2)
      }));
    } catch (error) {
      console.error('Error getting trending investments:', error.message);
      return [];
    }
  }

  // Mock news generator for demo mode
  generateMockNews(limit = 10) {
    const mockNews = [
      {
        title: 'Indian Markets Rally on Strong Q3 Results',
        description: 'Major indices surge as corporate earnings exceed expectations, with IT and banking sectors leading gains.',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Financial Express',
        image: null
      },
      {
        title: 'RBI Maintains Repo Rate, Focuses on Inflation',
        description: 'Central bank keeps interest rates unchanged while monitoring global economic developments.',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
        source: 'Economic Times',
        image: null
      },
      {
        title: 'Tech Giants Report Strong Digital Transformation Revenue',
        description: 'TCS, Infosys, and Wipro show robust growth in cloud and digital services amid global demand.',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
        source: 'Business Standard',
        image: null
      },
      {
        title: 'Banking Sector Shows Resilience with Lower NPAs',
        description: 'Major banks report improved asset quality and stronger provisions amid economic recovery.',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 36 * 60 * 60 * 1000).toISOString(),
        source: 'Mint',
        image: null
      },
      {
        title: 'Green Energy Investments Surge in Indian Markets',
        description: 'Renewable energy stocks attract significant investment as sustainability becomes key focus.',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 18 * 60 * 60 * 1000).toISOString(),
        source: 'Reuters',
        image: null
      }
    ];

    return mockNews.slice(0, limit);
  }

  generateMarketMood() {
    const moods = ['Optimistic', 'Cautious', 'Bullish', 'Neutral', 'Volatile'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  getMarketStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Market hours: Monday-Friday, 9:15 AM - 3:30 PM IST
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 16) {
      return {
        status: 'open',
        message: 'Market is currently open',
        nextSession: 'Closes at 3:30 PM IST'
      };
    } else {
      return {
        status: 'closed',
        message: 'Market is currently closed',
        nextSession: 'Opens at 9:15 AM IST'
      };
    }
  }

  getDefaultSentiment() {
    return {
      sentiment: 'neutral',
      confidence: 75,
      trendingTopics: ['Technology', 'Banking', 'Energy'],
      marketMood: 'Cautious'
    };
  }

  getDefaultMarketOverview() {
    return {
      indices: [
        { name: 'NIFTY 50', value: 19750, change: -25, changePercent: '-0.13' },
        { name: 'SENSEX', value: 66200, change: -150, changePercent: '-0.23' }
      ],
      sectors: [
        { name: 'Technology', performance: '1.2' },
        { name: 'Banking', performance: '-0.8' }
      ],
      globalMarkets: [
        { name: 'S&P 500', value: 4180, change: -20 }
      ],
      marketStatus: this.getMarketStatus(),
      lastUpdated: new Date()
    };
  }
}

module.exports = new FinancialNewsService();
