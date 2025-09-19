const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Investment must belong to a user']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Investment must be associated with a product']
  },
  amount: {
    type: Number,
    required: [true, 'Please specify investment amount'],
    min: [1, 'Investment amount must be at least 1']
  },
  units: {
    type: Number,
    required: [true, 'Please specify number of units'],
    min: [1, 'Units must be at least 1']
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please specify price per unit']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'matured', 'redeemed', 'cancelled'],
    default: 'pending'
  },
  investmentDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date,
    required: function() {
      return this.product && (this.product.category === 'fixed_deposit' || this.product.category === 'bonds');
    }
  },
  expectedReturn: {
    type: Number,
    required: [true, 'Please specify expected return']
  },
  currentValue: {
    type: Number,
    default: function() {
      return this.amount;
    }
  },
  returns: {
    type: Number,
    default: 0
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'bank_transfer', 'upi', 'card'],
    default: 'wallet'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
investmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique transaction ID
investmentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Calculate maturity date based on product tenure
investmentSchema.pre('save', function(next) {
  if (this.isNew && this.product && this.product.tenure) {
    const maturityDate = new Date(this.investmentDate);
    maturityDate.setMonth(maturityDate.getMonth() + this.product.tenure);
    this.maturityDate = maturityDate;
  }
  next();
});

// Virtual for profit/loss
investmentSchema.virtual('profitLoss').get(function() {
  return this.currentValue - this.amount;
});

// Virtual for profit/loss percentage
investmentSchema.virtual('profitLossPercentage').get(function() {
  return ((this.currentValue - this.amount) / this.amount) * 100;
});

// Virtual for days to maturity
investmentSchema.virtual('daysToMaturity').get(function() {
  if (!this.maturityDate) return null;
  const today = new Date();
  const diffTime = this.maturityDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Investment', investmentSchema);
