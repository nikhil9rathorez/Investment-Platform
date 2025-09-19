// MongoDB Initialization Script
// This script runs when the container starts for the first time

// Switch to the application database
db = db.getSiblingDB('mini_investment_platform');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mini_investment_platform'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ category: 1, isActive: 1 });
db.products.createIndex({ expectedReturn: -1 });
db.investments.createIndex({ user: 1, status: 1 });
db.transactions.createIndex({ user: 1, createdAt: -1 });
db.transactions.createIndex({ transactionId: 1 }, { unique: true });

// Insert comprehensive sample products
db.products.insertMany([
  // EQUITY STOCKS - Popular Indian stocks
  {
    name: "Reliance Industries Ltd (RIL)",
    description: "India's largest private sector company with interests in petrochemicals, oil & gas, telecom, and retail. Strong fundamentals with consistent growth.",
    category: "equity",
    minInvestment: 3000,
    maxInvestment: 5000000,
    expectedReturn: 18,
    tenure: 36,
    riskLevel: "medium",
    totalUnitsAvailable: 25000,
    unitsSold: 3450,
    issuer: "Reliance Industries Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tata Consultancy Services (TCS)",
    description: "Leading global IT services and consulting company with strong digital transformation capabilities and consistent dividend payments.",
    category: "equity",
    minInvestment: 4000,
    maxInvestment: 3000000,
    expectedReturn: 16,
    tenure: 24,
    riskLevel: "medium",
    totalUnitsAvailable: 20000,
    unitsSold: 2800,
    issuer: "Tata Consultancy Services Limited",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "HDFC Bank Ltd",
    description: "India's largest private sector bank with robust retail banking operations and strong asset quality. Consistent performer with stable returns.",
    category: "equity",
    minInvestment: 1650,
    maxInvestment: 4000000,
    expectedReturn: 14,
    tenure: 18,
    riskLevel: "low",
    totalUnitsAvailable: 30000,
    unitsSold: 4200,
    issuer: "HDFC Bank Limited",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Infosys Limited",
    description: "Global IT services company with strong presence in digital technologies, cloud, and AI. Excellent track record of shareholder returns.",
    category: "equity",
    minInvestment: 1800,
    maxInvestment: 2500000,
    expectedReturn: 15,
    tenure: 30,
    riskLevel: "medium",
    totalUnitsAvailable: 22000,
    unitsSold: 3100,
    issuer: "Infosys Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "ICICI Bank Ltd",
    description: "Second largest private sector bank in India with diversified business portfolio and strong retail franchise.",
    category: "equity",
    minInvestment: 1200,
    maxInvestment: 3500000,
    expectedReturn: 13,
    tenure: 24,
    riskLevel: "medium",
    totalUnitsAvailable: 28000,
    unitsSold: 4750,
    issuer: "ICICI Bank Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hindustan Unilever Ltd (HUL)",
    description: "India's largest FMCG company with strong brand portfolio and rural penetration. Consistent dividend paying stock.",
    category: "equity",
    minInvestment: 2600,
    maxInvestment: 2000000,
    expectedReturn: 12,
    tenure: 36,
    riskLevel: "low",
    totalUnitsAvailable: 18000,
    unitsSold: 2200,
    issuer: "Hindustan Unilever Limited",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "State Bank of India (SBI)",
    description: "India's largest public sector bank with extensive branch network and strong government backing. Value investment opportunity.",
    category: "equity",
    minInvestment: 850,
    maxInvestment: 5000000,
    expectedReturn: 16,
    tenure: 24,
    riskLevel: "medium",
    totalUnitsAvailable: 40000,
    unitsSold: 6800,
    issuer: "State Bank of India",
    rating: "AA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Asian Paints Ltd",
    description: "India's largest paint company with strong brand recognition and consistent market leadership. Premium quality stock.",
    category: "equity",
    minInvestment: 3200,
    maxInvestment: 1800000,
    expectedReturn: 14,
    tenure: 30,
    riskLevel: "medium",
    totalUnitsAvailable: 15000,
    unitsSold: 1890,
    issuer: "Asian Paints Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wipro Limited",
    description: "Global IT services company with expertise in digital transformation, cloud, and cybersecurity. Strong ESG focus.",
    category: "equity",
    minInvestment: 650,
    maxInvestment: 2200000,
    expectedReturn: 13,
    tenure: 36,
    riskLevel: "medium",
    totalUnitsAvailable: 24000,
    unitsSold: 3650,
    issuer: "Wipro Limited",
    rating: "AA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Larsen & Toubro Ltd (L&T)",
    description: "India's largest engineering and construction company with strong order book and infrastructure focus.",
    category: "equity",
    minInvestment: 3600,
    maxInvestment: 2800000,
    expectedReturn: 17,
    tenure: 48,
    riskLevel: "high",
    totalUnitsAvailable: 16000,
    unitsSold: 2100,
    issuer: "Larsen & Toubro Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // MUTUAL FUNDS
  {
    name: "SBI Blue Chip Fund - Direct Growth",
    description: "Large-cap equity fund investing in fundamentally strong companies with sustainable competitive advantages and consistent performance.",
    category: "mutual_fund",
    minInvestment: 5000,
    maxInvestment: 2000000,
    expectedReturn: 12.5,
    tenure: 36,
    riskLevel: "medium",
    totalUnitsAvailable: 50000,
    unitsSold: 8900,
    issuer: "SBI Mutual Fund",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "HDFC Top 100 Fund - Direct Growth",
    description: "Diversified large-cap fund focusing on top 100 companies by market capitalization with long-term wealth creation focus.",
    category: "mutual_fund",
    minInvestment: 5000,
    maxInvestment: 1500000,
    expectedReturn: 13.2,
    tenure: 60,
    riskLevel: "medium",
    totalUnitsAvailable: 45000,
    unitsSold: 12400,
    issuer: "HDFC Mutual Fund",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "ICICI Prudential Technology Fund",
    description: "Sector-focused fund investing in technology and IT companies with high growth potential and innovation focus.",
    category: "mutual_fund",
    minInvestment: 5000,
    maxInvestment: 1000000,
    expectedReturn: 16.8,
    tenure: 36,
    riskLevel: "high",
    totalUnitsAvailable: 30000,
    unitsSold: 7800,
    issuer: "ICICI Prudential Mutual Fund",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Axis Small Cap Fund - Direct Growth",
    description: "Small-cap fund with focus on emerging companies with strong fundamentals and high growth potential.",
    category: "mutual_fund",
    minInvestment: 5000,
    maxInvestment: 800000,
    expectedReturn: 18.5,
    tenure: 60,
    riskLevel: "high",
    totalUnitsAvailable: 35000,
    unitsSold: 6200,
    issuer: "Axis Mutual Fund",
    rating: "AA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mirae Asset Hybrid Equity Fund",
    description: "Balanced advantage fund with dynamic asset allocation between equity and debt based on market conditions.",
    category: "mutual_fund",
    minInvestment: 1000,
    maxInvestment: 1200000,
    expectedReturn: 11.2,
    tenure: 36,
    riskLevel: "medium",
    totalUnitsAvailable: 60000,
    unitsSold: 15600,
    issuer: "Mirae Asset Mutual Fund",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // FIXED DEPOSITS
  {
    name: "HDFC Bank Fixed Deposit - 18 Months",
    description: "High-interest fixed deposit with flexible tenure and guaranteed returns. Senior citizen benefits available.",
    category: "fixed_deposit",
    minInvestment: 25000,
    maxInvestment: 10000000,
    expectedReturn: 7.8,
    tenure: 18,
    riskLevel: "low",
    totalUnitsAvailable: 10000,
    unitsSold: 2890,
    maturityDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
    issuer: "HDFC Bank",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "SBI Fixed Deposit - 3 Years",
    description: "Long-term fixed deposit with attractive interest rates and tax saving benefits under section 80C.",
    category: "fixed_deposit",
    minInvestment: 10000,
    maxInvestment: 5000000,
    expectedReturn: 8.2,
    tenure: 36,
    riskLevel: "low",
    totalUnitsAvailable: 15000,
    unitsSold: 4200,
    maturityDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
    issuer: "State Bank of India",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "ICICI Bank Flexi Fixed Deposit",
    description: "Flexible fixed deposit allowing partial withdrawals with competitive interest rates and liquidity options.",
    category: "fixed_deposit",
    minInvestment: 50000,
    maxInvestment: 15000000,
    expectedReturn: 7.6,
    tenure: 24,
    riskLevel: "low",
    totalUnitsAvailable: 8000,
    unitsSold: 1950,
    maturityDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
    issuer: "ICICI Bank",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // BONDS
  {
    name: "Government of India 10-Year Bond",
    description: "Sovereign bonds issued by Government of India with semi-annual coupon payments and sovereign guarantee.",
    category: "bonds",
    minInvestment: 10000,
    maxInvestment: 50000000,
    expectedReturn: 7.4,
    tenure: 120,
    riskLevel: "low",
    totalUnitsAvailable: 100000,
    unitsSold: 18900,
    maturityDate: new Date(Date.now() + 120 * 30 * 24 * 60 * 60 * 1000),
    issuer: "Government of India",
    rating: "AAA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Corporate Bond - Tata Motors Finance",
    description: "High-yield corporate bond from Tata Motors Finance with quarterly interest payments and strong credit rating.",
    category: "bonds",
    minInvestment: 100000,
    maxInvestment: 25000000,
    expectedReturn: 9.2,
    tenure: 60,
    riskLevel: "medium",
    totalUnitsAvailable: 25000,
    unitsSold: 4800,
    maturityDate: new Date(Date.now() + 60 * 30 * 24 * 60 * 60 * 1000),
    issuer: "Tata Motors Finance Limited",
    rating: "AA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "REC Limited Green Bonds",
    description: "ESG-focused green bonds for renewable energy projects with tax benefits and environmental impact.",
    category: "bonds",
    minInvestment: 50000,
    maxInvestment: 20000000,
    expectedReturn: 8.8,
    tenure: 84,
    riskLevel: "medium",
    totalUnitsAvailable: 40000,
    unitsSold: 8900,
    maturityDate: new Date(Date.now() + 84 * 30 * 24 * 60 * 60 * 1000),
    issuer: "REC Limited",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // REAL ESTATE
  {
    name: "Embassy Office Parks REIT",
    description: "India's first listed REIT with portfolio of premium office spaces across Bangalore and other major cities.",
    category: "real_estate",
    minInvestment: 40000,
    maxInvestment: 10000000,
    expectedReturn: 10.8,
    tenure: 60,
    riskLevel: "medium",
    totalUnitsAvailable: 12000,
    unitsSold: 2890,
    issuer: "Embassy Office Parks Management Services",
    rating: "A+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mindspace Business Parks REIT",
    description: "Commercial real estate investment trust focusing on office spaces in key business districts.",
    category: "real_estate",
    minInvestment: 35000,
    maxInvestment: 8000000,
    expectedReturn: 9.8,
    tenure: 48,
    riskLevel: "medium",
    totalUnitsAvailable: 8000,
    unitsSold: 1650,
    issuer: "K Raheja Corp Investment Managers",
    rating: "A",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // GOLD
  {
    name: "Digital Gold 24K - SafeGold",
    description: "Invest in pure 24K gold with 100% transparency, insured storage, and easy liquidity. Buy gold starting from ₹100.",
    category: "gold",
    minInvestment: 100,
    maxInvestment: 2000000,
    expectedReturn: 8.5,
    tenure: 12,
    riskLevel: "low",
    totalUnitsAvailable: 500000,
    unitsSold: 89000,
    issuer: "SafeGold",
    rating: "Not Rated",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gold ETF - SBI Gold Fund",
    description: "Exchange Traded Fund backed by physical gold with high liquidity and transparent pricing.",
    category: "gold",
    minInvestment: 1000,
    maxInvestment: 5000000,
    expectedReturn: 7.8,
    tenure: 18,
    riskLevel: "low",
    totalUnitsAvailable: 200000,
    unitsSold: 45000,
    issuer: "SBI Mutual Fund",
    rating: "AA+",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // CRYPTOCURRENCY
  {
    name: "Bitcoin Investment Plan",
    description: "Systematic investment plan in Bitcoin with dollar-cost averaging strategy to reduce volatility impact.",
    category: "cryptocurrency",
    minInvestment: 500,
    maxInvestment: 1000000,
    expectedReturn: 25,
    tenure: 24,
    riskLevel: "high",
    totalUnitsAvailable: 50000,
    unitsSold: 12800,
    issuer: "CoinDCX",
    rating: "Not Rated",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ethereum Smart Investment",
    description: "Professional managed Ethereum investment with automated rebalancing and risk management.",
    category: "cryptocurrency",
    minInvestment: 1000,
    maxInvestment: 800000,
    expectedReturn: 22,
    tenure: 18,
    riskLevel: "high",
    totalUnitsAvailable: 30000,
    unitsSold: 7800,
    issuer: "WazirX Pro",
    rating: "Not Rated",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Crypto Index Fund",
    description: "Diversified cryptocurrency portfolio tracking top 10 cryptocurrencies by market cap with professional management.",
    category: "cryptocurrency",
    minInvestment: 2000,
    maxInvestment: 500000,
    expectedReturn: 20,
    tenure: 36,
    riskLevel: "high",
    totalUnitsAvailable: 25000,
    unitsSold: 4200,
    issuer: "Unocoin",
    rating: "Not Rated",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create admin user and sample users
let adminUserId = new ObjectId();
let user1Id = new ObjectId();
let user2Id = new ObjectId();
let user3Id = new ObjectId();

db.users.insertMany([
  {
    _id: adminUserId,
    name: "Admin User",
    email: "admin@gripinvest.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfR7JkzWsm4lfyW1q", // password: Admin123
    role: "admin",
    balance: 0,
    kycStatus: "verified",
    createdAt: new Date()
  },
  {
    _id: user1Id,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfR7JkzWsm4lfyW1q", // password: User123
    role: "user",
    balance: 245000,
    phoneNumber: "9876543210",
    kycStatus: "verified",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
  },
  {
    _id: user2Id,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfR7JkzWsm4lfyW1q", // password: User123
    role: "user",
    balance: 125000,
    phoneNumber: "9876543211",
    kycStatus: "verified",
    address: {
      street: "456 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
  },
  {
    _id: user3Id,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfR7JkzWsm4lfyW1q", // password: User123
    role: "user",
    balance: 85000,
    phoneNumber: "9876543212",
    kycStatus: "pending",
    address: {
      street: "789 Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  }
]);

// Get product IDs for sample investments
let products = db.products.find({}).toArray();
let rilProduct = products.find(p => p.name.includes("Reliance Industries"));
let tcsProduct = products.find(p => p.name.includes("Tata Consultancy"));
let hdfcBankProduct = products.find(p => p.name.includes("HDFC Bank Ltd"));
let sbiMutualFund = products.find(p => p.name.includes("SBI Blue Chip"));
let hdfcMutualFund = products.find(p => p.name.includes("HDFC Top 100"));
let digitalGold = products.find(p => p.name.includes("Digital Gold"));
let bitcoinPlan = products.find(p => p.name.includes("Bitcoin Investment"));
let hdfc18MonthFD = products.find(p => p.name.includes("HDFC Bank Fixed Deposit - 18"));

// Create sample investments
let investments = [];
let investmentId1 = new ObjectId();
let investmentId2 = new ObjectId();
let investmentId3 = new ObjectId();
let investmentId4 = new ObjectId();
let investmentId5 = new ObjectId();
let investmentId6 = new ObjectId();
let investmentId7 = new ObjectId();
let investmentId8 = new ObjectId();
let investmentId9 = new ObjectId();
let investmentId10 = new ObjectId();

if (rilProduct && tcsProduct && hdfcBankProduct && sbiMutualFund && hdfcMutualFund && digitalGold && bitcoinPlan && hdfc18MonthFD) {
  investments = [
    // User 1 Investments (Rahul Sharma)
    {
      _id: investmentId1,
      user: user1Id,
      product: rilProduct._id,
      amount: 50000,
      units: 16,
      pricePerUnit: 3125,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      expectedReturn: 18,
      currentValue: 56800, // 13.6% gain
      returns: 6800,
      transactionId: "TXN" + Date.now() + "A1",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId2,
      user: user1Id,
      product: sbiMutualFund._id,
      amount: 75000,
      units: 2500,
      pricePerUnit: 30,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      expectedReturn: 12.5,
      currentValue: 81250, // 8.33% gain
      returns: 6250,
      transactionId: "TXN" + Date.now() + "A2",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId3,
      user: user1Id,
      product: digitalGold._id,
      amount: 25000,
      units: 395,
      pricePerUnit: 63.29,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      expectedReturn: 8.5,
      currentValue: 26500, // 6% gain
      returns: 1500,
      transactionId: "TXN" + Date.now() + "A3",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    
    // User 2 Investments (Priya Patel)
    {
      _id: investmentId4,
      user: user2Id,
      product: tcsProduct._id,
      amount: 80000,
      units: 20,
      pricePerUnit: 4000,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      expectedReturn: 16,
      currentValue: 87200, // 9% gain
      returns: 7200,
      transactionId: "TXN" + Date.now() + "B1",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId5,
      user: user2Id,
      product: hdfcMutualFund._id,
      amount: 100000,
      units: 1818,
      pricePerUnit: 55,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      expectedReturn: 13.2,
      currentValue: 109000, // 9% gain
      returns: 9000,
      transactionId: "TXN" + Date.now() + "B2",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId6,
      user: user2Id,
      product: hdfc18MonthFD._id,
      amount: 200000,
      units: 8,
      pricePerUnit: 25000,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      maturityDate: new Date(Date.now() + 15 * 30 * 24 * 60 * 60 * 1000),
      expectedReturn: 7.8,
      currentValue: 204000, // 2% gain (FD grows slowly)
      returns: 4000,
      transactionId: "TXN" + Date.now() + "B3",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    
    // User 3 Investments (Amit Kumar)
    {
      _id: investmentId7,
      user: user3Id,
      product: hdfcBankProduct._id,
      amount: 35000,
      units: 21,
      pricePerUnit: 1667,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      expectedReturn: 14,
      currentValue: 36750, // 5% gain
      returns: 1750,
      transactionId: "TXN" + Date.now() + "C1",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId8,
      user: user3Id,
      product: bitcoinPlan._id,
      amount: 15000,
      units: 30,
      pricePerUnit: 500,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      expectedReturn: 25,
      currentValue: 18000, // 20% gain (crypto volatility)
      returns: 3000,
      transactionId: "TXN" + Date.now() + "C2",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      _id: investmentId9,
      user: user3Id,
      product: digitalGold._id,
      amount: 10000,
      units: 158,
      pricePerUnit: 63.29,
      status: "confirmed",
      investmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expectedReturn: 8.5,
      currentValue: 10300, // 3% gain
      returns: 300,
      transactionId: "TXN" + Date.now() + "C3",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    
    // Recent investment
    {
      _id: investmentId10,
      user: user1Id,
      product: sbiMutualFund._id,
      amount: 50000,
      units: 1666,
      pricePerUnit: 30.01,
      status: "pending",
      investmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expectedReturn: 12.5,
      currentValue: 50000, // No gain yet
      returns: 0,
      transactionId: "TXN" + Date.now() + "A4",
      paymentMethod: "wallet",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];
  
  db.investments.insertMany(investments);
}

// Create sample transactions
let transactions = [
  // User 1 Transactions (Rahul Sharma)
  {
    user: user1Id,
    type: "deposit",
    amount: 500000,
    status: "completed",
    description: "Initial wallet funding - Bank Transfer",
    transactionId: "TXN" + Date.now() + "DEP001",
    paymentMethod: "bank_transfer",
    balanceBefore: 0,
    balanceAfter: 500000,
    fees: 0,
    taxes: 0,
    processedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000)
  },
  {
    user: user1Id,
    investment: investmentId1,
    type: "investment",
    amount: 50000,
    status: "completed",
    description: "Investment in Reliance Industries Ltd (RIL)",
    transactionId: "TXN" + Date.now() + "INV001",
    paymentMethod: "wallet",
    balanceBefore: 500000,
    balanceAfter: 450000,
    fees: 250,
    taxes: 0,
    processedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
  },
  {
    user: user1Id,
    investment: investmentId2,
    type: "investment",
    amount: 75000,
    status: "completed",
    description: "Investment in SBI Blue Chip Fund - Direct Growth",
    transactionId: "TXN" + Date.now() + "INV002",
    paymentMethod: "wallet",
    balanceBefore: 450000,
    balanceAfter: 375000,
    fees: 375,
    taxes: 0,
    processedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  },
  {
    user: user1Id,
    type: "deposit",
    amount: 100000,
    status: "completed",
    description: "Additional wallet funding - UPI",
    transactionId: "TXN" + Date.now() + "DEP002",
    paymentMethod: "upi",
    balanceBefore: 375000,
    balanceAfter: 475000,
    fees: 0,
    taxes: 0,
    processedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
  },
  {
    user: user1Id,
    investment: investmentId3,
    type: "investment",
    amount: 25000,
    status: "completed",
    description: "Investment in Digital Gold 24K - SafeGold",
    transactionId: "TXN" + Date.now() + "INV003",
    paymentMethod: "wallet",
    balanceBefore: 475000,
    balanceAfter: 450000,
    fees: 125,
    taxes: 0,
    processedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
  },
  {
    user: user1Id,
    type: "dividend",
    amount: 2400,
    status: "completed",
    description: "Dividend received from Reliance Industries Ltd",
    transactionId: "TXN" + Date.now() + "DIV001",
    balanceBefore: 450000,
    balanceAfter: 452400,
    fees: 0,
    taxes: 360, // 15% TDS on dividend
    processedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  
  // User 2 Transactions (Priya Patel)
  {
    user: user2Id,
    type: "deposit",
    amount: 400000,
    status: "completed",
    description: "Initial wallet funding - Bank Transfer",
    transactionId: "TXN" + Date.now() + "DEP003",
    paymentMethod: "bank_transfer",
    balanceBefore: 0,
    balanceAfter: 400000,
    fees: 0,
    taxes: 0,
    processedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000)
  },
  {
    user: user2Id,
    investment: investmentId4,
    type: "investment",
    amount: 80000,
    status: "completed",
    description: "Investment in Tata Consultancy Services (TCS)",
    transactionId: "TXN" + Date.now() + "INV004",
    paymentMethod: "wallet",
    balanceBefore: 400000,
    balanceAfter: 320000,
    fees: 400,
    taxes: 0,
    processedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
  },
  {
    user: user2Id,
    investment: investmentId5,
    type: "investment",
    amount: 100000,
    status: "completed",
    description: "Investment in HDFC Top 100 Fund - Direct Growth",
    transactionId: "TXN" + Date.now() + "INV005",
    paymentMethod: "wallet",
    balanceBefore: 320000,
    balanceAfter: 220000,
    fees: 500,
    taxes: 0,
    processedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
  },
  {
    user: user2Id,
    investment: investmentId6,
    type: "investment",
    amount: 200000,
    status: "completed",
    description: "Investment in HDFC Bank Fixed Deposit - 18 Months",
    transactionId: "TXN" + Date.now() + "INV006",
    paymentMethod: "wallet",
    balanceBefore: 220000,
    balanceAfter: 20000,
    fees: 1000,
    taxes: 0,
    processedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  
  // User 3 Transactions (Amit Kumar)
  {
    user: user3Id,
    type: "deposit",
    amount: 150000,
    status: "completed",
    description: "Initial wallet funding - UPI",
    transactionId: "TXN" + Date.now() + "DEP004",
    paymentMethod: "upi",
    balanceBefore: 0,
    balanceAfter: 150000,
    fees: 0,
    taxes: 0,
    processedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  },
  {
    user: user3Id,
    investment: investmentId7,
    type: "investment",
    amount: 35000,
    status: "completed",
    description: "Investment in HDFC Bank Ltd",
    transactionId: "TXN" + Date.now() + "INV007",
    paymentMethod: "wallet",
    balanceBefore: 150000,
    balanceAfter: 115000,
    fees: 175,
    taxes: 0,
    processedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    user: user3Id,
    investment: investmentId8,
    type: "investment",
    amount: 15000,
    status: "completed",
    description: "Investment in Bitcoin Investment Plan",
    transactionId: "TXN" + Date.now() + "INV008",
    paymentMethod: "wallet",
    balanceBefore: 115000,
    balanceAfter: 100000,
    fees: 75,
    taxes: 0,
    processedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    user: user3Id,
    investment: investmentId9,
    type: "investment",
    amount: 10000,
    status: "completed",
    description: "Investment in Digital Gold 24K - SafeGold",
    transactionId: "TXN" + Date.now() + "INV009",
    paymentMethod: "wallet",
    balanceBefore: 100000,
    balanceAfter: 90000,
    fees: 50,
    taxes: 0,
    processedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  
  // Recent transactions
  {
    user: user1Id,
    investment: investmentId10,
    type: "investment",
    amount: 50000,
    status: "processing",
    description: "Investment in SBI Blue Chip Fund - Direct Growth",
    transactionId: "TXN" + Date.now() + "INV010",
    paymentMethod: "wallet",
    balanceBefore: 295000,
    balanceAfter: 245000,
    fees: 250,
    taxes: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    user: user2Id,
    type: "deposit",
    amount: 75000,
    status: "completed",
    description: "Additional wallet funding - Card Payment",
    transactionId: "TXN" + Date.now() + "DEP005",
    paymentMethod: "card",
    balanceBefore: 20000,
    balanceAfter: 95000,
    fees: 750, // 1% card processing fee
    taxes: 0,
    processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    user: user2Id,
    type: "interest",
    amount: 1300,
    status: "completed",
    description: "Interest earned on HDFC Fixed Deposit",
    transactionId: "TXN" + Date.now() + "INT001",
    balanceBefore: 95000,
    balanceAfter: 96300,
    fees: 0,
    taxes: 130, // 10% TDS on interest
    processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    user: user3Id,
    type: "deposit",
    amount: 25000,
    status: "pending",
    description: "Wallet funding - Bank Transfer (Processing)",
    transactionId: "TXN" + Date.now() + "DEP006",
    paymentMethod: "bank_transfer",
    balanceBefore: 85000,
    balanceAfter: 85000, // Not yet processed
    fees: 0,
    taxes: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

db.transactions.insertMany(transactions);

print('Database initialized with comprehensive sample data');
print('Users created:');
print('- Admin: admin@gripinvest.com / Admin123');
print('- User 1: rahul.sharma@example.com / User123 (Balance: ₹2,45,000)');
print('- User 2: priya.patel@example.com / User123 (Balance: ₹1,25,000)');
print('- User 3: amit.kumar@example.com / User123 (Balance: ₹85,000)');
print('Sample investments and transactions added for realistic portfolio data');
print('30+ investment products added across all categories');
print('Complete transaction history with various payment methods');
