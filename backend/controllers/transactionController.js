const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get user's transaction history
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = async (req, res) => {
  try {
    const {
      type,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with population
    const transactions = await Transaction.find(filter)
      .populate('investment', 'amount units product status')
      .populate({
        path: 'investment',
        populate: {
          path: 'product',
          select: 'name category'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Calculate summary statistics
    const summaryStats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), status: 'completed' } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Transaction.countDocuments({
      user: req.user.id,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalTransactions: total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
          limit: limitNum
        },
        summary: {
          stats: summaryStats,
          recentActivity
        }
      }
    });

  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('investment', 'amount units product status transactionId')
      .populate({
        path: 'investment',
        populate: {
          path: 'product',
          select: 'name category expectedReturn tenure riskLevel'
        }
      });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: { transaction }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
};

// @desc    Add money to wallet (Demo purpose - simulate payment gateway)
// @route   POST /api/transactions/add-money
// @access  Private
const addMoneyToWallet = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    if (amount < 100 || amount > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be between ₹100 and ₹1,00,000'
      });
    }

    // Get user current balance
    const user = await User.findById(userId);
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + amount;

    // Update user balance
    await User.findByIdAndUpdate(
      userId,
      { balance: balanceAfter }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'deposit',
      amount,
      status: 'completed',
      description: `Money added to wallet via ${paymentMethod || 'payment gateway'}`,
      paymentMethod: paymentMethod || 'upi',
      balanceBefore,
      balanceAfter,
      processedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Money added to wallet successfully',
      data: {
        transaction,
        newBalance: balanceAfter
      }
    });

  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding money to wallet'
    });
  }
};

// @desc    Withdraw money from wallet
// @route   POST /api/transactions/withdraw
// @access  Private
const withdrawFromWallet = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹100'
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

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - amount;

    // Update user balance
    await User.findByIdAndUpdate(
      userId,
      { balance: balanceAfter }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'withdrawal',
      amount,
      status: 'completed',
      description: `Money withdrawn from wallet via ${paymentMethod || 'bank transfer'}`,
      paymentMethod: paymentMethod || 'bank_transfer',
      paymentDetails: paymentDetails || {},
      balanceBefore,
      balanceAfter,
      processedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal processed successfully',
      data: {
        transaction,
        newBalance: balanceAfter
      }
    });

  } catch (error) {
    console.error('Withdraw money error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing withdrawal'
    });
  }
};

// @desc    Get transaction analytics
// @route   GET /api/transactions/analytics
// @access  Private
const getTransactionAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get monthly transaction summary (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyAnalytics = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get transaction type breakdown
    const typeBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get spending patterns (investments by category)
    const investmentsByCategory = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'investment',
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'investments',
          localField: 'investment',
          foreignField: '_id',
          as: 'investmentInfo'
        }
      },
      { $unwind: '$investmentInfo' },
      {
        $lookup: {
          from: 'products',
          localField: 'investmentInfo.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          totalInvested: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyAnalytics,
        typeBreakdown,
        investmentsByCategory
      }
    });

  } catch (error) {
    console.error('Get transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction analytics'
    });
  }
};

module.exports = {
  getUserTransactions,
  getTransaction,
  addMoneyToWallet,
  withdrawFromWallet,
  getTransactionAnalytics
};
