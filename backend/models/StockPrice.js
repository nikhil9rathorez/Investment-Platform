const mongoose = require('mongoose');

const stockPriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Stock name is required']
  },
  exchange: {
    type: String,
    required: [true, 'Exchange is required'],
    enum: ['NSE', 'BSE', 'NASDAQ', 'NYSE'],
    default: 'NSE'
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  previousClose: {
    type: Number,
    required: [true, 'Previous close is required'],
    min: [0, 'Price cannot be negative']
  },
  change: {
    type: Number,
    required: true
  },
  changePercent: {
    type: Number,
    required: true
  },
  dayHigh: {
    type: Number,
    required: [true, 'Day high is required'],
    min: [0, 'Price cannot be negative']
  },
  dayLow: {
    type: Number,
    required: [true, 'Day low is required'],
    min: [0, 'Price cannot be negative']
  },
  volume: {
    type: Number,
    default: 0,
    min: [0, 'Volume cannot be negative']
  },
  marketCap: {
    type: Number,
    min: [0, 'Market cap cannot be negative']
  },
  peRatio: {
    type: Number,
    min: [0, 'PE ratio cannot be negative']
  },
  week52High: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  week52Low: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sector: {
    type: String,
    enum: ['Technology', 'Banking', 'Energy', 'Healthcare', 'Consumer', 'Industrial', 'Real Estate', 'Utilities', 'Materials', 'Telecom'],
    default: 'Technology'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
stockPriceSchema.index({ symbol: 1, lastUpdated: -1 });
stockPriceSchema.index({ exchange: 1, isActive: 1 });
stockPriceSchema.index({ sector: 1, currentPrice: -1 });

// Virtual for market status
stockPriceSchema.virtual('isGainer').get(function() {
  return this.change > 0;
});

// Virtual for formatted change
stockPriceSchema.virtual('formattedChange').get(function() {
  const sign = this.change >= 0 ? '+' : '';
  return `${sign}${this.change.toFixed(2)} (${sign}${this.changePercent.toFixed(2)}%)`;
});

// Virtual for price trend
stockPriceSchema.virtual('trend').get(function() {
  if (this.change > 0) return 'up';
  if (this.change < 0) return 'down';
  return 'neutral';
});

// Method to update price data
stockPriceSchema.methods.updatePrice = function(priceData) {
  this.currentPrice = priceData.currentPrice;
  this.change = priceData.currentPrice - this.previousClose;
  this.changePercent = ((this.change / this.previousClose) * 100);
  this.dayHigh = Math.max(this.dayHigh, priceData.currentPrice);
  this.dayLow = Math.min(this.dayLow, priceData.currentPrice);
  this.volume = priceData.volume || this.volume;
  this.lastUpdated = Date.now();
};

// Static method to get top gainers
stockPriceSchema.statics.getTopGainers = function(limit = 10) {
  return this.find({ isActive: true, change: { $gt: 0 } })
    .sort({ changePercent: -1 })
    .limit(limit);
};

// Static method to get top losers
stockPriceSchema.statics.getTopLosers = function(limit = 10) {
  return this.find({ isActive: true, change: { $lt: 0 } })
    .sort({ changePercent: 1 })
    .limit(limit);
};

// Static method to get most active stocks
stockPriceSchema.statics.getMostActive = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ volume: -1 })
    .limit(limit);
};

module.exports = mongoose.model('StockPrice', stockPriceSchema);
