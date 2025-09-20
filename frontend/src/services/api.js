import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  changePassword: (passwordData) => apiClient.put('/auth/change-password', passwordData),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/products?${queryString}`);
  },
  getProduct: (id) => apiClient.get(`/products/${id}`),
  getTrendingProducts: () => apiClient.get('/products/trending'),
  getProductsByCategory: (category, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/products/category/${category}?${queryString}`);
  },
  createProduct: (productData) => apiClient.post('/products', productData),
  updateProduct: (id, productData) => apiClient.put(`/products/${id}`, productData),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

// Investments API
export const investmentsAPI = {
  getUserInvestments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/investments?${queryString}`);
  },
  getInvestment: (id) => apiClient.get(`/investments/${id}`),
  createInvestment: (investmentData) => apiClient.post('/investments', investmentData),
  redeemInvestment: (id, data) => apiClient.put(`/investments/${id}/redeem`, data),
  getInvestmentAnalytics: () => apiClient.get('/investments/analytics'),
};

// Transactions API
export const transactionsAPI = {
  getUserTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/transactions?${queryString}`);
  },
  getTransaction: (id) => apiClient.get(`/transactions/${id}`),
  addMoneyToWallet: (transactionData) => apiClient.post('/transactions/add-money', transactionData),
  withdrawFromWallet: (transactionData) => apiClient.post('/transactions/withdraw', transactionData),
  getTransactionAnalytics: () => apiClient.get('/transactions/analytics'),
};

// Stocks API
export const stocksAPI = {
  getAllStocks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/stocks?${queryString}`);
  },
  getStock: (symbol) => apiClient.get(`/stocks/${symbol}`),
  getStockHistory: (symbol, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/stocks/${symbol}/history?${queryString}`);
  },
  getMarketMovers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/stocks/movers?${queryString}`);
  },
  getMarketSummary: () => apiClient.get('/stocks/summary'),
  getStocksBySector: (sector, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/stocks/sector/${sector}?${queryString}`);
  },
  searchStocks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/stocks/search?${queryString}`);
  },
};

// Market API
export const marketAPI = {
  getMarketOverview: () => apiClient.get('/market/overview'),
  getFinancialNews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/market/news?${queryString}`);
  },
  getMarketIndices: () => apiClient.get('/market/indices'),
  getSectorPerformance: () => apiClient.get('/market/sectors'),
  getTopMovers: () => apiClient.get('/market/movers'),
  getTrendingTopics: () => apiClient.get('/market/trending'),
  getMarketActivities: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/market/activities?${queryString}`);
  },
  getPortfolioInsights: () => apiClient.get('/market/insights'),
};

export default apiClient;
