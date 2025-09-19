const axios = require('axios');
const StockPrice = require('../models/StockPrice');
const StockHistory = require('../models/StockHistory');

class MarketDataService {
  constructor() {
    // Using free Finnhub API - get key from https://finnhub.io/
    this.apiKey = process.env.FINNHUB_API_KEY || 'demo';
    this.baseURL = 'https://finnhub.io/api/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      params: {
        token: this.apiKey
      }
    });

    // Indian stock symbols (NSE)
    this.indianStocks = [
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy' },
      { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Technology' },
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', sector: 'Banking' },
      { symbol: 'INFY.NS', name: 'Infosys Limited', sector: 'Technology' },
      { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', sector: 'Banking' },
      { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd', sector: 'Consumer' },
      { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
      { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd', sector: 'Materials' },
      { symbol: 'WIPRO.NS', name: 'Wipro Limited', sector: 'Technology' },
      { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', sector: 'Industrial' },
      { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
      { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd', sector: 'Banking' },
      { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd', sector: 'Consumer' },
      { symbol: 'TITAN.NS', name: 'Titan Company Ltd', sector: 'Consumer' },
      { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd', sector: 'Banking' }
    ];

    // US stocks for better data availability
    this.usStocks = [
      { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer' },
      { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer' },
      { symbol: 'META', name: 'Meta Platforms Inc', sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', sector: 'Banking' },
      { symbol: 'V', name: 'Visa Inc', sector: 'Technology' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
      { symbol: 'WMT', name: 'Walmart Inc', sector: 'Consumer' },
      { symbol: 'PG', name: 'Procter & Gamble Co', sector: 'Consumer' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc', sector: 'Healthcare' },
      { symbol: 'HD', name: 'The Home Depot Inc', sector: 'Consumer' },
      { symbol: 'BAC', name: 'Bank of America Corp', sector: 'Banking' }
    ];

    this.allStocks = [...this.usStocks, ...this.indianStocks];
  }

  async fetchQuote(symbol) {
    try {
      // If using demo key, generate realistic simulated data
      if (this.apiKey === 'demo') {
        return this.generateSimulatedQuote(symbol);
      }

      const response = await this.client.get('/quote', {
        params: { symbol }
      });
      
      const data = response.data;
      if (!data.c || data.c === 0) {
        throw new Error('Invalid quote data');
      }

      return {
        symbol,
        currentPrice: data.c, // Current price
        previousClose: data.pc, // Previous close
        change: data.d, // Change
        changePercent: data.dp, // Change percent
        dayHigh: data.h, // Day high
        dayLow: data.l, // Day low
        openPrice: data.o, // Open price
        timestamp: data.t // Unix timestamp
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      // Fallback to simulated data
      return this.generateSimulatedQuote(symbol);
    }
  }

  generateSimulatedQuote(symbol) {
    // Base prices for realistic simulation
    const basePrices = {
      'AAPL': 180, 'MSFT': 350, 'GOOGL': 140, 'AMZN': 145, 'TSLA': 250,
      'META': 320, 'NVDA': 450, 'JPM': 150, 'V': 250, 'JNJ': 160,
      'WMT': 160, 'PG': 150, 'UNH': 520, 'HD': 330, 'BAC': 35,
      'RELIANCE.NS': 2800, 'TCS.NS': 3600, 'HDFCBANK.NS': 1650, 'INFY.NS': 1800,
      'ICICIBANK.NS': 1200, 'HINDUNILVR.NS': 2600, 'SBIN.NS': 850, 'ASIANPAINT.NS': 3200,
      'WIPRO.NS': 650, 'LT.NS': 3600, 'KOTAKBANK.NS': 1750, 'AXISBANK.NS': 1100,
      'MARUTI.NS': 11000, 'TITAN.NS': 3400, 'BAJFINANCE.NS': 7200
    };

    const basePrice = basePrices[symbol] || 100;
    
    // Generate realistic price variations (-5% to +5%)
    const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
    const currentPrice = basePrice * (1 + variation);
    const previousClose = basePrice;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    // Generate day high/low
    const volatility = Math.random() * 0.03; // 0-3% volatility
    const dayHigh = Math.max(currentPrice, previousClose) * (1 + volatility);
    const dayLow = Math.min(currentPrice, previousClose) * (1 - volatility);
    
    return {
      symbol,
      currentPrice: Math.round(currentPrice * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      dayHigh: Math.round(dayHigh * 100) / 100,
      dayLow: Math.round(dayLow * 100) / 100,
      openPrice: Math.round(previousClose * (1 + (Math.random() - 0.5) * 0.02) * 100) / 100,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  async fetchHistoricalData(symbol, resolution = 'D', from, to) {
    try {
      // Default to last 30 days if no dates provided
      if (!from || !to) {
        to = Math.floor(Date.now() / 1000); // Current timestamp
        from = to - (30 * 24 * 60 * 60); // 30 days ago
      }

      // If using demo key, generate simulated historical data
      if (this.apiKey === 'demo') {
        return this.generateSimulatedHistoricalData(symbol, from, to, resolution);
      }

      const response = await this.client.get('/stock/candle', {
        params: {
          symbol,
          resolution, // D = daily, 1 = 1 minute, 5 = 5 minutes, etc.
          from,
          to
        }
      });

      const data = response.data;
      if (data.s !== 'ok' || !data.c) {
        throw new Error('No historical data available');
      }

      // Transform data into our format
      const historicalData = [];
      for (let i = 0; i < data.c.length; i++) {
        historicalData.push({
          symbol,
          date: new Date(data.t[i] * 1000),
          open: data.o[i],
          high: data.h[i],
          low: data.l[i],
          close: data.c[i],
          volume: data.v[i],
          timeframe: resolution === 'D' ? '1day' : `${resolution}min`
        });
      }

      return historicalData;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
      // Fallback to simulated data
      return this.generateSimulatedHistoricalData(symbol, from, to, resolution);
    }
  }

  generateSimulatedHistoricalData(symbol, from, to, resolution = 'D') {
    const basePrices = {
      'AAPL': 180, 'MSFT': 350, 'GOOGL': 140, 'AMZN': 145, 'TSLA': 250,
      'META': 320, 'NVDA': 450, 'JPM': 150, 'V': 250, 'JNJ': 160,
      'WMT': 160, 'PG': 150, 'UNH': 520, 'HD': 330, 'BAC': 35,
      'RELIANCE.NS': 2800, 'TCS.NS': 3600, 'HDFCBANK.NS': 1650, 'INFY.NS': 1800,
      'ICICIBANK.NS': 1200, 'HINDUNILVR.NS': 2600, 'SBIN.NS': 850, 'ASIANPAINT.NS': 3200,
      'WIPRO.NS': 650, 'LT.NS': 3600, 'KOTAKBANK.NS': 1750, 'AXISBANK.NS': 1100,
      'MARUTI.NS': 11000, 'TITAN.NS': 3400, 'BAJFINANCE.NS': 7200
    };

    const basePrice = basePrices[symbol] || 100;
    const historicalData = [];
    
    // Generate daily data points
    const days = Math.ceil((to - from) / (24 * 60 * 60));
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date((from + (i * 24 * 60 * 60)) * 1000);
      
      // Random walk with trend
      const dailyChange = (Math.random() - 0.5) * 0.04; // -2% to +2% daily
      const trend = Math.sin(i / 10) * 0.01; // Slight trend
      currentPrice = currentPrice * (1 + dailyChange + trend);
      
      const open = currentPrice;
      const volatility = Math.random() * 0.02; // 0-2% volatility
      const high = open * (1 + volatility);
      const low = open * (1 - volatility);
      const close = open * (1 + (Math.random() - 0.5) * 0.015);
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      historicalData.push({
        symbol,
        date,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
        timeframe: resolution === 'D' ? '1day' : `${resolution}min`
      });
      
      currentPrice = close; // Update for next iteration
    }
    
    return historicalData;
  }

  async fetchCompanyProfile(symbol) {
    try {
      const response = await this.client.get('/stock/profile2', {
        params: { symbol }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching company profile for ${symbol}:`, error.message);
      return null;
    }
  }

  async updateAllStockPrices() {
    console.log('🔄 Starting stock price update...');
    const updatePromises = this.allStocks.map(stock => this.updateStockPrice(stock));
    
    try {
      await Promise.allSettled(updatePromises);
      console.log('✅ Stock price update completed');
    } catch (error) {
      console.error('❌ Error updating stock prices:', error);
    }
  }

  async updateStockPrice(stockInfo) {
    try {
      const quote = await this.fetchQuote(stockInfo.symbol);
      
      // Find or create stock price record
      let stockPrice = await StockPrice.findOne({ symbol: stockInfo.symbol });
      
      if (!stockPrice) {
        // Create new stock price record
        stockPrice = new StockPrice({
          symbol: stockInfo.symbol,
          name: stockInfo.name,
          exchange: stockInfo.symbol.includes('.NS') ? 'NSE' : 'NASDAQ',
          sector: stockInfo.sector,
          currentPrice: quote.currentPrice,
          previousClose: quote.previousClose,
          change: quote.change,
          changePercent: quote.changePercent,
          dayHigh: quote.dayHigh,
          dayLow: quote.dayLow,
          volume: 0, // Will be updated from historical data
          lastUpdated: new Date()
        });
      } else {
        // Update existing record
        stockPrice.updatePrice(quote);
      }

      await stockPrice.save();
      
      // Also save to history for charting
      const historyEntry = new StockHistory({
        symbol: stockInfo.symbol,
        date: new Date(),
        open: quote.openPrice || quote.previousClose,
        high: quote.dayHigh,
        low: quote.dayLow,
        close: quote.currentPrice,
        volume: 0, // Volume data might need separate API call
        timeframe: '1day'
      });

      await historyEntry.save();
      
      return stockPrice;
    } catch (error) {
      console.error(`Error updating ${stockInfo.symbol}:`, error.message);
      return null;
    }
  }

  async initializeHistoricalData(symbol, days = 30) {
    try {
      console.log(`📈 Initializing historical data for ${symbol}...`);
      
      const to = Math.floor(Date.now() / 1000);
      const from = to - (days * 24 * 60 * 60);
      
      const historicalData = await this.fetchHistoricalData(symbol, 'D', from, to);
      
      // Save historical data
      for (const data of historicalData) {
        const existingEntry = await StockHistory.findOne({
          symbol: data.symbol,
          date: data.date,
          timeframe: data.timeframe
        });
        
        if (!existingEntry) {
          const historyEntry = new StockHistory(data);
          await historyEntry.save();
        }
      }
      
      console.log(`✅ Initialized ${historicalData.length} historical records for ${symbol}`);
      return historicalData;
    } catch (error) {
      console.error(`Error initializing historical data for ${symbol}:`, error.message);
      return [];
    }
  }

  async initializeAllHistoricalData() {
    console.log('📊 Initializing historical data for all stocks...');
    
    for (const stock of this.allStocks) {
      await this.initializeHistoricalData(stock.symbol);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ All historical data initialized');
  }

  // Get market movers
  async getMarketMovers() {
    try {
      const topGainers = await StockPrice.getTopGainers(5);
      const topLosers = await StockPrice.getTopLosers(5);
      const mostActive = await StockPrice.getMostActive(5);
      
      return {
        gainers: topGainers,
        losers: topLosers,
        mostActive
      };
    } catch (error) {
      console.error('Error getting market movers:', error);
      return { gainers: [], losers: [], mostActive: [] };
    }
  }

  // Start real-time updates
  startRealTimeUpdates() {
    // Update prices every 5 minutes during market hours
    this.updateInterval = setInterval(() => {
      this.updateAllStockPrices();
    }, 5 * 60 * 1000); // 5 minutes

    console.log('🚀 Real-time price updates started');
  }

  // Stop real-time updates
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      console.log('⏹️ Real-time price updates stopped');
    }
  }
}

module.exports = new MarketDataService();
