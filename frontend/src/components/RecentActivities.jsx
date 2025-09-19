import { useState, useEffect } from 'react';
import { marketAPI } from '@/services/api';
import { 
  TrendingUp, 
  Bell, 
  DollarSign, 
  PieChart, 
  BarChart3,
  ArrowDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
    // Refresh activities every 15 seconds
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      setError(null);
      const response = await marketAPI.getMarketActivities({ limit: 10 });
      if (response?.data?.data) {
        setActivities(response.data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // If it's an authentication error, set empty activities instead of error
      if (error.response?.status === 401) {
        setActivities([]);
        setError(null);
      } else {
        setError('Failed to fetch recent activities');
        setActivities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="w-4 h-4 text-primary-600" />;
      case 'price_alert':
        return <Bell className="w-4 h-4 text-warning-600" />;
      case 'dividend':
        return <DollarSign className="w-4 h-4 text-success-600" />;
      case 'portfolio_update':
        return <PieChart className="w-4 h-4 text-purple-600" />;
      case 'market_update':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'redemption':
        return <ArrowDown className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-success-600" />;
      case 'triggered':
        return <AlertCircle className="w-3 h-3 text-warning-600" />;
      case 'credited':
        return <CheckCircle className="w-3 h-3 text-success-600" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'investment':
        return 'bg-primary-50 border-primary-200';
      case 'price_alert':
        return 'bg-warning-50 border-warning-200';
      case 'dividend':
        return 'bg-success-50 border-success-200';
      case 'portfolio_update':
        return 'bg-purple-50 border-purple-200';
      case 'market_update':
        return 'bg-blue-50 border-blue-200';
      case 'redemption':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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

  const formatActivityType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
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
          onClick={fetchActivities}
          className="mt-2 text-primary-600 hover:text-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-600" />
          Recent Activities
        </h3>
        <button 
          onClick={fetchActivities}
          className="text-xs text-primary-600 hover:text-primary-700"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`p-3 rounded-lg border transition-colors hover:shadow-sm ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      {activity.amount && (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 capitalize">
                        {formatActivityType(activity.type)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {activity.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
