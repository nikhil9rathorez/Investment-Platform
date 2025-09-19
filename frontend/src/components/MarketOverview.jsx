import { useState, useEffect } from 'react';
import { marketAPI } from '@/services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  Target,
  Newspaper
} from 'lucide-react';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setError(null);
      const response = await marketAPI.getMarketOverview();
      if (response?.data?.data) {
        setMarketData(response.data.data);
      } else {
        setMarketData({
          indices: [],
          movers: { gainers: [], losers: [], mostActive: [] },
          news: [],
          sectors: []
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError('Failed to fetch market data');
      // Set empty data structure to prevent undefined errors
      setMarketData({
        indices: [],
        movers: { gainers: [], losers: [], mostActive: [] },
        news: [],
        sectors: []
      });
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

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(number);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? 
      <ArrowUp className="w-4 h-4 text-success-600" /> : 
      <ArrowDown className="w-4 h-4 text-danger-600" />;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchMarketData}
          className="mt-2 text-primary-600 hover:text-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
            Market Indices
          </h3>
          <span className="text-xs text-gray-500">
            Last updated: {marketData?.lastUpdated ? formatTimeAgo(marketData.lastUpdated) : 'Just now'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(marketData?.indices || []).map((index, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{index.name}</h4>
                {getChangeIcon(index.change)}
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(index.value)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
                  {index.change >= 0 ? '+' : ''}{formatNumber(index.change)}
                </span>
                <span className={`text-sm ${getChangeColor(index.changePercent)}`}>
                  ({index.changePercent >= 0 ? '+' : ''}{index.changePercent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Movers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-600" />
          Top Movers
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gainers */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-success-600" />
              Top Gainers
            </h4>
            <div className="space-y-2">
              {(marketData?.movers?.gainers || []).map((stock, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(stock.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success-600">
                      +{stock.changePercent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-danger-600" />
              Top Losers
            </h4>
            <div className="space-y-2">
              {(marketData?.movers?.losers || []).map((stock, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(stock.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-danger-600">
                      {stock.changePercent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-1 text-primary-600" />
              Most Active
            </h4>
            <div className="space-y-2">
              {(marketData?.movers?.mostActive || []).map((stock, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(stock.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getChangeColor(stock.changePercent)}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial News */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Newspaper className="w-5 h-5 mr-2 text-primary-600" />
          Market News
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(marketData?.news || []).map((article, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                  {article.title}
                </h4>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  article.sentiment === 'positive' ? 'bg-success-100 text-success-700' :
                  article.sentiment === 'negative' ? 'bg-danger-100 text-danger-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {article.category?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.source}</span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(article.publishedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Performance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
          Sector Performance
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(marketData?.sectors || []).map((sector, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200">
              <p className="font-medium text-gray-900 text-sm mb-1">{sector.sector}</p>
              <p className={`text-lg font-bold ${getChangeColor(sector.performance)}`}>
                {sector.performance >= 0 ? '+' : ''}{sector.performance}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
