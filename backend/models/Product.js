const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    enum: [
      'mutual_fund',
      'fixed_deposit',
      'bonds',
      'equity',
      'real_estate',
      'gold',
      'cryptocurrency'
    ]
  },
  minInvestment: {
    type: Number,
    required: [true, 'Please specify minimum investment amount'],
    min: [1, 'Minimum investment must be at least 1']
  },
  maxInvestment: {
    type: Number,
    required: [true, 'Please specify maximum investment amount']
  },
  expectedReturn: {
    type: Number,
    required: [true, 'Please provide expected return percentage'],
    min: [0, 'Expected return cannot be negative'],
    max: [100, 'Expected return cannot exceed 100%']
  },
  tenure: {
    type: Number, // in months
    required: [true, 'Please specify tenure in months'],
    min: [1, 'Tenure must be at least 1 month']
  },
  riskLevel: {
    type: String,
    required: [true, 'Please specify risk level'],
    enum: ['low', 'medium', 'high']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalUnitsAvailable: {
    type: Number,
    required: [true, 'Please specify total units available'],
    min: [1, 'Must have at least 1 unit available']
  },
  unitsSold: {
    type: Number,
    default: 0
  },
  launchDate: {
    type: Date,
    default: Date.now
  },
  maturityDate: {
    type: Date,
    required: function() {
      return this.category === 'fixed_deposit' || this.category === 'bonds';
    }
  },
  issuer: {
    type: String,
    required: [true, 'Please provide issuer information'],
    maxlength: [100, 'Issuer name cannot exceed 100 characters']
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: String,
    enum: ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'Not Rated'],
    default: 'Not Rated'
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for units remaining
productSchema.virtual('unitsRemaining').get(function() {
  return this.totalUnitsAvailable - this.unitsSold;
});

// Virtual for investment availability
productSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.unitsRemaining > 0;
});

module.exports = mongoose.model('Product', productSchema);
