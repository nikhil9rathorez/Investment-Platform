import { useState, useEffect } from 'react';
import { investmentsAPI } from '@/services/api';
import InvestmentModal from '@/components/InvestmentModal';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  RefreshCw,
  PieChart,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('buy');
  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    fetchPortfolioData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchPortfolioData();
      setRefreshTime(new Date());
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [investmentsRes, analyticsRes] = await Promise.all([
        investmentsAPI.getUserInvestments({ limit: 50 }),
        investmentsAPI.getInvestmentAnalytics()
      ]);

      if (investmentsRes.data.success) {
        // Set status to 'confirmed' if it's not set
        const processedInvestments = (investmentsRes.data.data.investments || []).map(inv => ({
          ...inv,
          status: inv.status || 'confirmed'
        }));
        setInvestments(processedInvestments);
        setPortfolioStats(investmentsRes.data.data.portfolioStats);
        console.log('Processed investments:', processedInvestments); // Debug log
      }

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentAction = (investment, mode) => {
    console.log('Investment status:', investment.status); // Debug log
    if (mode === 'buy') {
      setSelectedProduct(investment.product);
    } else {
      // When selling, pass the full investment data
      setSelectedProduct({
        ...investment.product,
        _id: investment._id,
        currentValue: investment.currentValue || investment.amount,
        units: investment.units,
        amount: investment.amount,
        status: investment.status
      });
    }
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // Refresh portfolio data after transaction
    fetchPortfolioData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'bg-success-100 text-success-700';
      case 'matured':
        return 'bg-blue-100 text-blue-700';
      case 'redeemed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-danger-100 text-danger-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      default:
        return 'bg-warning-100 text-warning-700';
    }
  };

  const getPerformanceColor = (value) => {
    return value >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getPerformanceIcon = (value) => {
    return value >= 0 ? 
      <TrendingUp className="w-4 h-4 text-success-600" /> : 
      <TrendingDown className="w-4 h-4 text-danger-600" />;
  };

  const portfolioSummaryCards = [
    {
      title: 'Total Invested',
      value: formatCurrency(portfolioStats?.totalInvested || 0),
      icon: Target,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Current Value',
      value: formatCurrency(portfolioStats?.totalCurrentValue || 0),
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Total Returns',
      value: formatCurrency(portfolioStats?.totalReturns || 0),
      icon: TrendingUp,
      color: getPerformanceColor(portfolioStats?.totalReturns || 0),
      bgColor: (portfolioStats?.totalReturns || 0) >= 0 ? 'bg-success-50' : 'bg-danger-50'
    },
    {
      title: 'Active Investments',
      value: portfolioStats?.totalInvestments || 0,
      icon: BarChart3,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const handleSell = (stock) => {
    fetch(`/api/sellStock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Send the stock id and sale amount (using currentValue as sale amount here)
      body: JSON.stringify({ stockId: stock.id, saleAmount: stock.currentValue })
    })
      .then((res) => res.json())
      .then((data) => {
        // Update wallet and transaction history in your state management if needed
        alert('Stock sold successfully!');
      })
      .catch((err) => {
        console.error('Error selling stock:', err);
        alert('Error selling stock.');
      });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {refreshTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedView('grid')}
              className={`p-2 rounded-lg ${selectedView === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`p-2 rounded-lg ${selectedView === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={fetchPortfolioData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioSummaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portfolio Breakdown */}
      {analytics?.categoryBreakdown?.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Distribution</h3>
            <PieChart className="w-5 h-5 text-primary-600" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analytics.categoryBreakdown.map(item => ({
                      name: item._id,
                      value: item.totalInvested,
                      percentage: ((item.totalInvested / portfolioStats.totalInvested) * 100).toFixed(1)
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {analytics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${formatCurrency(value)} (${props.payload.percentage}%)`,
                      name.toUpperCase()
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                    ></div>
                    <span className="font-medium text-gray-900 capitalize">
                      {category._id.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(category.totalInvested)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((category.totalInvested / portfolioStats.totalInvested) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investment Holdings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Investments</h3>
          <span className="text-sm text-gray-600">
            {investments.length} {investments.length === 1 ? 'Investment' : 'Investments'}
          </span>
        </div>

        {investments.length > 0 ? (
          <div className={`grid ${selectedView === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            {investments.map((investment) => (
              <div key={investment._id} className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {investment.product?.name || 'Investment Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {investment.product?.description?.substring(0, 100)}...
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investment.status)}`}>
                    {investment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invested Amount</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Value</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(investment.currentValue || investment.amount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Units Owned</p>
                    <p className="font-medium text-gray-900">{investment.units}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expected Return</p>
                    <p className="font-medium text-success-600">{investment.product?.expectedReturn}%</p>
                  </div>
                </div>

                {investment.status !== 'redeemed' && investment.status !== 'cancelled' && (
                  <button
                    onClick={() => handleInvestmentAction(investment, 'sell')}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Sell Stock</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your investment journey by exploring our products.
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Explore Products
            </a>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        mode={modalMode}
      />
    </div>
  );
};

export default Investments;
