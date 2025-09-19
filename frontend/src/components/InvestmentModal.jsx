import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { investmentsAPI, transactionsAPI } from '@/services/api';
import { 
  X, 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Wallet,
  ArrowRight
} from 'lucide-react';

const InvestmentModal = ({ isOpen, onClose, product, mode = 'buy' }) => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculatedUnits, setCalculatedUnits] = useState(0);
  const [calculatedReturns, setCalculatedReturns] = useState(0);
  const [userInvestment, setUserInvestment] = useState(null);

  useEffect(() => {
    if (isOpen && product && mode === 'sell') {
      fetchUserInvestment();
    }
  }, [isOpen, product, mode]);

  useEffect(() => {
    if (amount && product) {
      const numAmount = parseFloat(amount) || 0;
      const pricePerUnit = product.minInvestment / 100; // Assuming 100 base units
      const calculatedUnitsValue = Math.floor(numAmount / pricePerUnit);
      const potentialReturns = (numAmount * product.expectedReturn / 100);
      
      setCalculatedUnits(calculatedUnitsValue);
      setCalculatedReturns(potentialReturns);
      setUnits(calculatedUnitsValue.toString());
    }
  }, [amount, product]);

  const fetchUserInvestment = async () => {
    try {
      const response = await investmentsAPI.getUserInvestments({
        productId: product._id
      });
      
      if (response.data.success && response.data.data.investments.length > 0) {
        setUserInvestment(response.data.data.investments[0]);
      }
    } catch (error) {
      console.error('Error fetching user investment:', error);
    }
  };

  const handleInvestment = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validation
      const investmentAmount = parseFloat(amount);
      if (!investmentAmount || investmentAmount <= 0) {
        setError('Please enter a valid investment amount');
        return;
      }

      if (mode === 'buy') {
        if (investmentAmount < product.minInvestment) {
          setError(`Minimum investment amount is ${formatCurrency(product.minInvestment)}`);
          return;
        }

        if (investmentAmount > product.maxInvestment) {
          setError(`Maximum investment amount is ${formatCurrency(product.maxInvestment)}`);
          return;
        }

        if (investmentAmount > user.balance) {
          setError('Insufficient wallet balance');
          return;
        }

        // Create investment
        const investmentData = {
          productId: product._id,
          amount: investmentAmount,
          units: calculatedUnits,
          paymentMethod: 'wallet'
        };

        const response = await investmentsAPI.createInvestment(investmentData);
        
        if (response.data.success) {
          setSuccess(`Successfully invested ${formatCurrency(investmentAmount)} in ${product.name}!`);
          
          // Update user balance
          const newBalance = user.balance - investmentAmount;
          updateUser({ ...user, balance: newBalance });
          
          setTimeout(() => {
            onClose();
            setAmount('');
            setUnits('');
          }, 2000);
        }
      } else if (mode === 'sell') {
        if (!userInvestment) {
          setError('No investment found to redeem');
          return;
        }

        const unitsToSell = parseInt(units);
        if (unitsToSell > userInvestment.units) {
          setError(`You can only sell up to ${userInvestment.units} units`);
          return;
        }

        // Redeem investment
        const response = await investmentsAPI.redeemInvestment(userInvestment._id, {
          unitsToRedeem: unitsToSell,
          amount: investmentAmount
        });

        if (response.data.success) {
          setSuccess(`Successfully sold ${unitsToSell} units for ${formatCurrency(investmentAmount)}!`);
          
          // Update user balance
          const newBalance = user.balance + investmentAmount;
          updateUser({ ...user, balance: newBalance });
          
          setTimeout(() => {
            onClose();
            setAmount('');
            setUnits('');
          }, 2000);
        }
      }

    } catch (error) {
      console.error('Investment error:', error);
      setError(error.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'text-success-600 bg-success-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      case 'high':
        return 'text-danger-600 bg-danger-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'buy' ? 'Invest in' : 'Sell'} {product.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {mode === 'buy' ? 'Start your investment journey' : 'Redeem your investment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Return</p>
              <p className="text-2xl font-bold text-success-600">{product.expectedReturn}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Risk Level</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(product.riskLevel)}`}>
                {product.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tenure</p>
              <p className="text-lg font-semibold text-gray-900">{product.tenure} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-lg font-semibold text-gray-900">{product.rating}</p>
            </div>
          </div>
        </div>

        {/* Investment Form */}
        <div className="p-6">
          {/* User Balance */}
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Wallet Balance</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(user?.balance || 0)}
            </span>
          </div>

          {/* Current Investment (for sell mode) */}
          {mode === 'sell' && userInvestment && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Your Current Investment</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Invested Amount</p>
                  <p className="font-semibold">{formatCurrency(userInvestment.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Units Owned</p>
                  <p className="font-semibold">{userInvestment.units}</p>
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'buy' ? 'Investment' : 'Redemption'} Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={mode === 'buy' ? `Min: ${formatCurrency(product.minInvestment)}` : '0'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min={mode === 'buy' ? product.minInvestment : 0}
                max={mode === 'buy' ? Math.min(product.maxInvestment, user?.balance || 0) : userInvestment?.amount || 0}
              />
            </div>
            {mode === 'buy' && (
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Min: {formatCurrency(product.minInvestment)}</span>
                <span>Max: {formatCurrency(Math.min(product.maxInvestment, user?.balance || 0))}</span>
              </div>
            )}
          </div>

          {/* Units Calculation */}
          {amount && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="w-5 h-5 text-primary-600" />
                <h4 className="font-medium text-gray-900">Investment Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Units</p>
                  <p className="font-bold text-lg text-gray-900">{calculatedUnits}</p>
                </div>
                <div>
                  <p className="text-gray-600">Potential Returns</p>
                  <p className="font-bold text-lg text-success-600">
                    {formatCurrency(calculatedReturns)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Value*</p>
                  <p className="font-bold text-lg text-primary-600">
                    {formatCurrency((parseFloat(amount) || 0) + calculatedReturns)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                *Projected value after {product.tenure} months at {product.expectedReturn}% return
              </p>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
              <p className="text-danger-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
              <p className="text-success-700">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleInvestment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                mode === 'buy' 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-gray-300'
                  : 'bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-300'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'buy' ? (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Invest {amount ? formatCurrency(parseFloat(amount)) : 'Now'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      <span>Sell {units} Units</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Investment Disclaimer:</strong> All investments are subject to market risks. 
              Past performance does not guarantee future results. Please read all scheme related 
              documents carefully before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
