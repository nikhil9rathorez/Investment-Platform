import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  PieChart, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Investments',
      description: 'Bank-grade security with comprehensive KYC verification and encrypted transactions.'
    },
    {
      icon: PieChart,
      title: 'Diversified Portfolio',
      description: 'Choose from mutual funds, bonds, equity, real estate, gold, and cryptocurrency.'
    },
    {
      icon: Zap,
      title: 'Instant Trading',
      description: 'Buy and sell investments instantly with real-time portfolio tracking.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Get insights from financial experts and AI-powered recommendations.'
    }
  ];

  const stats = [
    { value: '₹10M+', label: 'Total Investments' },
    { value: '5000+', label: 'Active Users' },
    { value: '12%', label: 'Average Returns' },
    { value: '99.9%', label: 'Uptime' }
  ];

  const investmentCategories = [
    { name: 'Mutual Funds', return: '8-12%', risk: 'Medium', icon: '📊' },
    { name: 'Fixed Deposits', return: '6-8%', risk: 'Low', icon: '🏦' },
    { name: 'Equity Bonds', return: '10-15%', risk: 'High', icon: '📈' },
    { name: 'Gold', return: '5-10%', risk: 'Low', icon: '🥇' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Invest Smart,
                  <br />
                  <span className="text-yellow-400">Grow Wealth</span>
                </h1>
                <p className="text-xl text-primary-100 leading-relaxed">
                  Start your investment journey with GripInvest. Access diverse investment 
                  options, get expert guidance, and watch your money grow with confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register"
                  className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Investing</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-colors text-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-primary-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>SEBI regulated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Start with ₹1,00,000</h3>
                <div className="space-y-4">
                  {investmentCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-semibold">{category.name}</p>
                          <p className="text-sm text-primary-200">Risk: {category.risk}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{category.return}</p>
                        <p className="text-sm text-primary-200">Expected Returns</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GripInvest?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to make smart investment decisions and grow your wealth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors who trust GripInvest to grow their wealth. 
              Get started today with just ₹1,000.
            </p>
            <Link 
              to="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Grip<span className="text-primary-600">Invest</span>
              </span>
            </div>
            <p className="text-gray-600 text-center md:text-right">
              © 2025 GripInvest. A demo investment platform for Grip Invest Winter Internship 2025.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
