import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { investmentsAPI, transactionsAPI } from '@/services/api';
import MarketOverview from '@/components/MarketOverview';
import RecentActivities from '@/components/RecentActivities';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Eye,
  BarChart3,
  Clock,
  Target,
  Shield
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [investmentAnalytics, setInvestmentAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [investmentsRes, transactionsRes, analyticsRes] = await Promise.all([
        investmentsAPI.getUserInvestments({ limit: 5 }).catch(err => ({ data: { portfolioStats: null, investments: [] } })),
        transactionsAPI.getUserTransactions({ limit: 5 }).catch(err => ({ data: { transactions: [] } })),
        investmentsAPI.getInvestmentAnalytics().catch(err => ({ data: { categoryBreakdown: [] } }))
      ]);

      // Safely set the data with fallbacks
      setPortfolioStats(investmentsRes?.data?.portfolioStats || {
        totalInvested: 0,
        totalCurrentValue: 0,
        totalReturns: 0,
        totalInvestments: 0
      });
      setRecentTransactions(transactionsRes?.data?.transactions || []);
      setInvestmentAnalytics(analyticsRes?.data || { categoryBreakdown: [] });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set safe fallback values
      setPortfolioStats({
        totalInvested: 0,
        totalCurrentValue: 0,
        totalReturns: 0,
        totalInvestments: 0
      });
      setRecentTransactions([]);
      setInvestmentAnalytics({ categoryBreakdown: [] });
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'investment':
        return <ArrowUpRight className="w-4 h-4 text-primary-600" />;
      case 'redemption':
        return <ArrowDownRight className="w-4 h-4 text-success-600" />;
      case 'deposit':
        return <Plus className="w-4 h-4 text-success-600" />;
      default:
        return <ArrowDownRight className="w-4 h-4 text-gray-600" />;
    }
  };

  const quickActions = [
    {
      title: 'Add Money',
      description: 'Fund your wallet',
      icon: Plus,
      href: '/wallet',
      color: 'bg-success-500'
    },
    {
      title: 'Explore Products',
      description: 'Browse investments',
      icon: Eye,
      href: '/products',
      color: 'bg-primary-500'
    },
    {
      title: 'View Portfolio',
      description: 'Check investments',
      icon: BarChart3,
      href: '/investments',
      color: 'bg-warning-500'
    }
  ];

  const statsCards = [
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
      icon: TrendingUp,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Total Returns',
      value: formatCurrency(portfolioStats?.totalReturns || 0),
      icon: ArrowUpRight,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      title: 'Active Investments',
      value: portfolioStats?.totalInvestments || 0,
      icon: Shield,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-100">
              Track your investments and grow your wealth with smart decisions.
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Wallet Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(user?.balance || 0)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards removed as requested */}

      {/* Market Overview */}
      <div className="card">
        <MarketOverview />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Breakdown</h3>
            <Link to="/investments" className="text-sm text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          
          {investmentAnalytics?.categoryBreakdown?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentAnalytics.categoryBreakdown.map(item => ({
                      name: item._id,
                      value: item.totalInvested,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {investmentAnalytics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No investments yet</p>
                <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm">
                  Start investing →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Recent Activities */}
        <div className="card">
          <RecentActivities />
        </div>
      </div>

      {/* Legacy Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700">
            View All →
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'investment' ? 'text-danger-600' : 'text-success-600'
                  }`}>
                    {transaction.type === 'investment' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
