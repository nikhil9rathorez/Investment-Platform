const express = require('express');
const { body } = require('express-validator');
const {
  createInvestment,
  getUserInvestments,
  getInvestment,
  redeemInvestment,
  getInvestmentAnalytics
} = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Investment creation validation
const investmentValidation = [
  body('productId')
    .notEmpty()
    .isMongoId()
    .withMessage('Please provide a valid product ID'),
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Investment amount must be at least ₹1'),
  body('units')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('Units must be at least 1'),
  body('paymentMethod')
    .optional()
    .isIn(['wallet', 'bank_transfer', 'upi', 'card'])
    .withMessage('Please select a valid payment method')
];

// All routes are protected
router.use(protect);

// Investment routes
router.get('/analytics', getInvestmentAnalytics);
router.get('/', getUserInvestments);
router.post('/', investmentValidation, createInvestment);
router.get('/:id', getInvestment);
router.put('/:id/redeem', redeemInvestment);

module.exports = router;
