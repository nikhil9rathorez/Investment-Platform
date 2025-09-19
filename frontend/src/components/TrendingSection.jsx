import { useState, useEffect } from 'react';
import { marketAPI } from '@/services/api';
import { 
  TrendingUp, 
  Flame,
  Eye,
  ArrowUp,
  ArrowDown,
  Volume2,
  Heart,
  Share2
} from 'lucide-react';

const TrendingSection = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingData();
    // Refresh data every minute
    const interval = setInterval(fetchTrendingData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingData = async () => {
    try {
      setError(null);
      const [trendingRes, insightsRes] = await Promise.all([
        marketAPI.getTrendingTopics(),
        marketAPI.getPortfolioInsights()
      ]);
      
      setTrendingTopics(trendingRes.data.data);
      setInsights(insightsRes.data.data);
    } catch (error) {
      console.error('Error fetching trending data:', error);
      setError('Failed to fetch trending data');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'negative':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ArrowUp className="w-4 h-4" />;
      case 'negative':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <Volume2 className="w-4 h-4" />;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-danger-500 bg-danger-50';
      case 'medium':
        return 'border-l-warning-500 bg-warning-50';
      case 'low':
        return 'border-l-success-500 bg-success-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'recommendation':
        return <TrendingUp className="w-5 h-5 text-primary-600" />;
      case 'alert':
        return <Eye className="w-5 h-5 text-warning-600" />;
      case 'opportunity':
        return <Flame className="w-5 h-5 text-success-600" />;
      case 'performance':
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <Share2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Flame className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchTrendingData}
          className="mt-2 text-primary-600 hover:text-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Trending Now
          </h3>
          <span className="text-xs text-gray-500">
            Updated just now
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(trendingTopics || []).map((topic) => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${getSentimentColor(topic.sentiment)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                  {topic.topic}
                </h4>
                <div className="flex items-center space-x-1 ml-2">
                  {getSentimentIcon(topic.sentiment)}
                  <span className="text-sm font-bold">
                    {topic.change}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {topic.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {formatVolume(topic.volume)} discussions
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  topic.sentiment === 'positive' ? 'bg-success-100 text-success-700' :
                  topic.sentiment === 'negative' ? 'bg-danger-100 text-danger-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {topic.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Insights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          Investment Insights
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(insights || []).map((insight) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-sm ${getInsightColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        insight.priority === 'high' ? 'bg-danger-100 text-danger-700' :
                        insight.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                        insight.priority === 'low' ? 'bg-success-100 text-success-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.priority}
                      </span>
                      {insight.actionRequired && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">
                      {insight.type.replace('_', ' ')}
                    </span>
                    {insight.actionRequired && (
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
