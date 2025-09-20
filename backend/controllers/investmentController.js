const Investment = require('../models/Investment');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create new investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const { productId, amount, units, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!productId || !amount || !units) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, amount, and units are required'
      });
    }

    // Find product and check availability
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Check if units are available
    if (product.unitsRemaining < units) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.unitsRemaining} units available`
      });
    }

    // Validate investment amount
    if (amount < product.minInvestment || amount > product.maxInvestment) {
      return res.status(400).json({
        success: false,
        message: `Investment amount must be between ₹${product.minInvestment} and ₹${product.maxInvestment}`
      });
    }

    // Get user and check balance
    const user = await User.findById(userId);
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Calculate price per unit and expected return
    const pricePerUnit = amount / units;
    const expectedReturn = (amount * product.expectedReturn * product.tenure) / (12 * 100);

    // Create investment
    const investment = await Investment.create({
      user: userId,
      product: productId,
      amount,
      units,
      pricePerUnit,
      expectedReturn,
      paymentMethod: paymentMethod || 'wallet',
      status: 'confirmed'
    });

    // Update product units sold
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { unitsSold: units } }
    );

    // Update user balance
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - amount;
    
    await User.findByIdAndUpdate(
      userId,
      { balance: balanceAfter }
    );

    // Create transaction record
    await Transaction.create({
      user: userId,
      investment: investment._id,
      type: 'investment',
      amount,
      status: 'completed',
      description: `Investment in ${product.name}`,
      paymentMethod: paymentMethod || 'wallet',
      balanceBefore,
      balanceAfter,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });

    // Populate the investment with product details for response
    const populatedInvestment = await Investment.findById(investment._id)
      .populate('product', 'name category expectedReturn tenure riskLevel issuer')
      .populate('user', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: { investment: populatedInvestment }
    });

  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating investment'
    });
  }
};

// @desc    Get user's investments
// @route   GET /api/investments
// @access  Private
const getUserInvestments = async (req, res) => {
  try {
    const {
      status,
      category,
      sortBy = 'investmentDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let query = Investment.find(filter)
      .populate('product', 'name category expectedReturn tenure riskLevel issuer rating')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Filter by product category if specified
    if (category) {
      query = query.populate({
        path: 'product',
        match: { category },
        select: 'name category expectedReturn tenure riskLevel issuer rating'
      });
    }

    const investments = await query;

    // Filter out null products if category filter was applied
    const filteredInvestments = category 
      ? investments.filter(inv => inv.product !== null)
      : investments;

    // Get total count
    let totalQuery = Investment.countDocuments(filter);
    if (category) {
      const allInvestments = await Investment.find(filter).populate('product', 'category');
      const filteredCount = allInvestments.filter(inv => inv.product && inv.product.category === category).length;
      var total = filteredCount;
    } else {
      var total = await totalQuery;
    }

    // Calculate portfolio summary
    const portfolioStats = await Investment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), status: { $in: ['confirmed', 'matured'] } } },
      {
        $group: {
          _id: null,
          totalInvested: { $sum: '$amount' },
          totalCurrentValue: { $sum: '$currentValue' },
          totalReturns: { $sum: '$returns' },
          totalInvestments: { $sum: 1 }
        }
      }
    ]);

    const stats = portfolioStats[0] || {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalReturns: 0,
      totalInvestments: 0
    };

    res.status(200).json({
      success: true,
      data: {
        investments: filteredInvestments,
        portfolioStats: stats,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalInvestments: total,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching investments'
    });
  }
};

// @desc    Get single investment
// @route   GET /api/investments/:id
// @access  Private
const getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('product', 'name category expectedReturn tenure riskLevel issuer rating description')
      .populate('user', 'name email');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Check if investment belongs to user
    if (investment.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this investment'
      });
    }

    res.status(200).json({
      success: true,
      data: { investment }
    });

  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching investment'
    });
  }
};

// @desc    Redeem investment (sell/exit)
// @route   PUT /api/investments/:id/redeem
// @access  Private
const redeemInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('product');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Check if investment belongs to user
    if (investment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to redeem this investment'
      });
    }

    // Check if investment can be redeemed
    if (investment.status === 'redeemed' || investment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Investment already redeemed or cancelled'
      });
    }

    const { unitsToRedeem } = req.body;
    let redemptionAmount;

    // If specific units are provided, calculate partial redemption
    if (unitsToRedeem && unitsToRedeem < investment.units) {
      const pricePerUnit = investment.currentValue / investment.units;
      redemptionAmount = unitsToRedeem * pricePerUnit;
      
      // Update investment with remaining units
      await Investment.findByIdAndUpdate(
        investment._id,
        { 
          units: investment.units - unitsToRedeem,
          amount: investment.amount * ((investment.units - unitsToRedeem) / investment.units),
          currentValue: investment.currentValue * ((investment.units - unitsToRedeem) / investment.units)
        }
      );
    } else {
      // Full redemption
      redemptionAmount = investment.currentValue;
      await Investment.findByIdAndUpdate(
        investment._id,
        { status: 'redeemed' }
      );
    }

    // Update user balance
    const user = await User.findById(req.user.id);
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + redemptionAmount;

    await User.findByIdAndUpdate(
      req.user.id,
      { balance: balanceAfter }
    );

    // Update product units (return units to available pool)
    await Product.findByIdAndUpdate(
      investment.product._id,
      { $inc: { unitsSold: -(unitsToRedeem || investment.units) } }
    );

    // Create redemption transaction with a unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    await Transaction.create({
      user: req.user.id,
      investment: investment._id,
      type: 'redemption',
      amount: redemptionAmount,
      status: 'completed',
      description: `Redemption of ${unitsToRedeem || investment.units} units in ${investment.product.name}`,
      paymentMethod: 'wallet',
      balanceBefore,
      balanceAfter,
      transactionId
    });

    res.status(200).json({
      success: true,
      message: 'Investment redeemed successfully',
      data: {
        redemptionAmount,
        newBalance: balanceAfter,
        remainingUnits: unitsToRedeem ? investment.units - unitsToRedeem : 0
      }
    });

  } catch (error) {
    console.error('Redeem investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while redeeming investment'
    });
  }
};

// @desc    Get investment analytics/dashboard
// @route   GET /api/investments/analytics
// @access  Private
const getInvestmentAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get overall portfolio stats
    const portfolioStats = await Investment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalCurrentValue: { $sum: '$currentValue' }
        }
      }
    ]);

    // Get category-wise breakdown
    const categoryBreakdown = await Investment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: { $in: ['confirmed', 'matured'] } } },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          count: { $sum: 1 },
          totalInvested: { $sum: '$amount' },
          totalCurrentValue: { $sum: '$currentValue' }
        }
      }
    ]);

    // Get monthly investment trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrend = await Investment.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          investmentDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$investmentDate' },
            month: { $month: '$investmentDate' }
          },
          totalInvested: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        portfolioStats,
        categoryBreakdown,
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('Get investment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

module.exports = {
  createInvestment,
  getUserInvestments,
  getInvestment,
  redeemInvestment,
  getInvestmentAnalytics
};
