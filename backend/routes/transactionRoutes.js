const express = require('express');
const { body } = require('express-validator');
const {
  getUserTransactions,
  getTransaction,
  addMoneyToWallet,
  withdrawFromWallet,
  getTransactionAnalytics
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Money addition validation
const addMoneyValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 100, max: 100000 })
    .withMessage('Amount must be between ₹100 and ₹1,00,000'),
  body('paymentMethod')
    .optional()
    .isIn(['upi', 'card', 'net_banking', 'bank_transfer'])
    .withMessage('Please select a valid payment method')
];

// Withdrawal validation
const withdrawalValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 100 })
    .withMessage('Minimum withdrawal amount is ₹100'),
  body('paymentMethod')
    .optional()
    .isIn(['bank_transfer', 'upi'])
    .withMessage('Please select a valid payment method'),
  body('paymentDetails')
    .optional()
    .isObject()
    .withMessage('Payment details must be an object')
];

// All routes are protected
router.use(protect);

// Transaction routes
router.get('/analytics', getTransactionAnalytics);
router.get('/', getUserTransactions);
router.post('/add-money', addMoneyValidation, addMoneyToWallet);
router.post('/withdraw', withdrawalValidation, withdrawFromWallet);
router.get('/:id', getTransaction);

module.exports = router;
