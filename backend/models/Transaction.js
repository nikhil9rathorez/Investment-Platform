const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user']
  },
  investment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investment',
    required: function() {
      return this.type === 'investment' || this.type === 'redemption';
    }
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: [
      'investment',
      'redemption',
      'deposit',
      'withdrawal',
      'dividend',
      'interest',
      'fee',
      'refund'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Please specify transaction amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Please provide transaction description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  transactionId: {
    type: String,
    unique: true,
    required: [true, 'Transaction ID is required']
  },
  referenceId: {
    type: String, // For external payment gateway reference
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'bank_transfer', 'upi', 'card', 'net_banking'],
    required: function() {
      return this.type === 'investment' || this.type === 'deposit' || this.type === 'withdrawal';
    }
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    upiId: String,
    cardLast4: String
  },
  balanceBefore: {
    type: Number,
    required: [true, 'Balance before transaction is required']
  },
  balanceAfter: {
    type: Number,
    required: [true, 'Balance after transaction is required']
  },
  fees: {
    type: Number,
    default: 0,
    min: [0, 'Fees cannot be negative']
  },
  taxes: {
    type: Number,
    default: 0,
    min: [0, 'Taxes cannot be negative']
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: String,
    deviceId: String
  },
  processedAt: {
    type: Date
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

// Generate unique transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Update the updatedAt field before saving
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set processedAt when status changes to completed
  if (this.status === 'completed' && !this.processedAt) {
    this.processedAt = Date.now();
  }
  
  next();
});

// Index for efficient querying
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ type: 1, status: 1 });

// Virtual for net amount (amount - fees - taxes)
transactionSchema.virtual('netAmount').get(function() {
  return this.amount - this.fees - this.taxes;
});

// Virtual for is credit (positive impact on balance)
transactionSchema.virtual('isCredit').get(function() {
  return ['deposit', 'dividend', 'interest', 'refund', 'redemption'].includes(this.type);
});

// Virtual for is debit (negative impact on balance)
transactionSchema.virtual('isDebit').get(function() {
  return ['investment', 'withdrawal', 'fee'].includes(this.type);
});

module.exports = mongoose.model('Transaction', transactionSchema);
