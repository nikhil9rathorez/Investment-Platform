const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getTrendingProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Product creation/update validation
const productValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['mutual_fund', 'fixed_deposit', 'bonds', 'equity', 'real_estate', 'gold', 'cryptocurrency'])
    .withMessage('Please select a valid category'),
  body('minInvestment')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Minimum investment must be at least ₹1'),
  body('maxInvestment')
    .isNumeric()
    .custom((value, { req }) => {
      if (parseFloat(value) <= parseFloat(req.body.minInvestment)) {
        throw new Error('Maximum investment must be greater than minimum investment');
      }
      return true;
    }),
  body('expectedReturn')
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Expected return must be between 0 and 100%'),
  body('tenure')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('Tenure must be at least 1 month'),
  body('riskLevel')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Please select a valid risk level'),
  body('totalUnitsAvailable')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('Total units must be at least 1'),
  body('issuer')
    .isLength({ min: 2, max: 100 })
    .withMessage('Issuer name must be between 2 and 100 characters')
];

// Public routes
router.get('/', getProducts);
router.get('/trending', getTrendingProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
