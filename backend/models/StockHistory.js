const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  open: {
    type: Number,
    required: [true, 'Opening price is required'],
    min: [0, 'Price cannot be negative']
  },
  high: {
    type: Number,
    required: [true, 'High price is required'],
    min: [0, 'Price cannot be negative']
  },
  low: {
    type: Number,
    required: [true, 'Low price is required'],
    min: [0, 'Price cannot be negative']
  },
  close: {
    type: Number,
    required: [true, 'Closing price is required'],
    min: [0, 'Price cannot be negative']
  },
  volume: {
    type: Number,
    required: [true, 'Volume is required'],
    min: [0, 'Volume cannot be negative']
  },
  adjustedClose: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  timeframe: {
    type: String,
    enum: ['1min', '5min', '15min', '30min', '1hour', '1day', '1week', '1month'],
    default: '1day',
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
stockHistorySchema.index({ symbol: 1, date: -1 });
stockHistorySchema.index({ symbol: 1, timeframe: 1, date: -1 });

// Virtual for price change
stockHistorySchema.virtual('change').get(function() {
  return this.close - this.open;
});

// Virtual for price change percentage
stockHistorySchema.virtual('changePercent').get(function() {
  return ((this.close - this.open) / this.open) * 100;
});

// Static method to get historical data for a symbol
stockHistorySchema.statics.getHistoryForSymbol = function(symbol, timeframe = '1day', limit = 100) {
  return this.find({ 
    symbol: symbol.toUpperCase(), 
    timeframe 
  })
  .sort({ date: -1 })
  .limit(limit);
};

// Static method to get data for date range
stockHistorySchema.statics.getHistoryByDateRange = function(symbol, startDate, endDate, timeframe = '1day') {
  return this.find({
    symbol: symbol.toUpperCase(),
    timeframe,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .sort({ date: 1 });
};

// Static method to get latest price for a symbol
stockHistorySchema.statics.getLatestPrice = function(symbol, timeframe = '1day') {
  return this.findOne({
    symbol: symbol.toUpperCase(),
    timeframe
  })
  .sort({ date: -1 });
};

// Method to format for chart display
stockHistorySchema.methods.toChartData = function() {
  return {
    date: this.date,
    open: this.open,
    high: this.high,
    low: this.low,
    close: this.close,
    volume: this.volume,
    timestamp: this.date.getTime()
  };
};

module.exports = mongoose.model('StockHistory', stockHistorySchema);
