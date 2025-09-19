# 🚀 Mini Investment Platform

A comprehensive full-stack investment platform built for **Grip Invest Winter Internship 2025**. This project demonstrates modern web development practices with a focus on user experience, security, and scalability.

![Platform Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [AI Integration](#ai-integration)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

GripInvest is a modern investment platform that allows users to:
- Browse and invest in various financial instruments
- Manage their investment portfolio
- Track transactions and analytics
- Secure wallet management
- Real-time portfolio tracking

### Demo Credentials
- **Admin**: `admin@gripinvest.com` / `Admin123`
- **User Registration**: Available on the platform

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure password hashing
- Role-based access control (User/Admin)
- Rate limiting and security headers
- Input validation and sanitization

### 💰 Investment Management
- **Product Categories**: Mutual Funds, Fixed Deposits, Bonds, Equity, Real Estate, Gold, Cryptocurrency
- Real-time portfolio tracking
- Investment analytics and insights
- Risk assessment tools

### 💳 Wallet System
- Secure wallet management
- Add/withdraw money functionality
- Transaction history tracking
- Balance management

### 📊 Dashboard & Analytics
- Comprehensive portfolio dashboard
- Interactive charts and graphs
- Performance tracking
- Investment breakdown by categories

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme support
- Intuitive user interface
- Real-time notifications

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API + React Query
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7
- **Reverse Proxy**: Nginx
- **Environment**: Development & Production configs

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose
- MongoDB (if running locally)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd mini-investment-platform

# Start the application with Docker
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

### Option 2: Local Development

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start MongoDB (ensure it's running on port 27017)

# Start backend server
cd ../backend
npm run dev

# Start frontend server (in another terminal)
cd ../frontend
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phoneNumber": "9876543210"
}
```

#### POST `/api/auth/login`
User login authentication.

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Product Endpoints

#### GET `/api/products`
Get all investment products with filtering options.

**Query Parameters:**
- `category`: Filter by category (mutual_fund, bonds, etc.)
- `riskLevel`: Filter by risk level (low, medium, high)
- `page`: Page number for pagination
- `limit`: Number of items per page

#### GET `/api/products/:id`
Get detailed information about a specific product.

### Investment Endpoints

#### POST `/api/investments`
Create a new investment.

```json
{
  "productId": "product_id_here",
  "amount": 10000,
  "units": 100,
  "paymentMethod": "wallet"
}
```

#### GET `/api/investments`
Get user's investment portfolio.

#### PUT `/api/investments/:id/redeem`
Redeem/sell an investment.

### Transaction Endpoints

#### POST `/api/transactions/add-money`
Add money to wallet.

```json
{
  "amount": 50000,
  "paymentMethod": "upi"
}
```

#### GET `/api/transactions`
Get transaction history with filtering options.

## 🏗️ Architecture

### Backend Architecture
```
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication, validation, error handling
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── utils/           # Helper functions
└── server.js        # Application entry point
```

### Frontend Architecture
```
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Header, Footer)
│   └── ui/          # UI components (Buttons, Forms)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API service functions
├── utils/           # Helper functions
└── App.jsx          # Main application component
```

### Database Schema

#### Users Collection
- Authentication details
- Profile information
- Wallet balance
- KYC status

#### Products Collection
- Investment product details
- Risk and return information
- Availability status

#### Investments Collection
- User investment records
- Transaction references
- Performance tracking

#### Transactions Collection
- Financial transaction logs
- Payment method details
- Status tracking

## 🤖 AI Integration

This project leverages AI tools for enhanced development:

### Development Assistance
- **Code Generation**: AI-powered code completion and generation
- **Testing**: Automated test case generation
- **Documentation**: AI-assisted documentation writing
- **Error Handling**: Smart error detection and resolution

### User Experience Enhancement
- **Smart Recommendations**: AI-driven investment suggestions
- **Risk Assessment**: Automated risk analysis
- **Portfolio Optimization**: AI-powered portfolio balancing

### How AI Helped This Project
1. **Rapid Prototyping**: Generated boilerplate code and components
2. **Code Quality**: Automated code review and optimization
3. **Testing Scenarios**: Generated comprehensive test cases
4. **Documentation**: Created detailed API documentation
5. **Error Handling**: Implemented robust error handling patterns

## 🔒 Security

### Implemented Security Measures
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper cross-origin resource sharing
- **Security Headers**: Helmet.js for secure headers
- **Environment Variables**: Sensitive data protection

### Security Best Practices
- Non-root Docker containers
- Secure database connections
- Input validation on both client and server
- Error handling without information leakage
- Secure password policies

## 🚀 Deployment

### Production Deployment

```bash
# Build and deploy with Docker
docker-compose -f docker-compose.yml up -d --build

# Or deploy individual services
docker-compose up mongodb -d
docker-compose up backend -d
docker-compose up frontend -d
```

### Environment Configuration

#### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://username:password@host:port/database
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

#### Frontend Environment Variables
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Health Checks
- **Backend**: `http://localhost:5000/health`
- **Frontend**: `http://localhost:3000/health`

## 📊 Features Demonstration

### Dashboard Analytics
- Portfolio value tracking
- Investment performance charts
- Category-wise investment breakdown
- Recent transaction history

### Investment Flow
1. Browse available investment products
2. View detailed product information
3. Calculate potential returns
4. Make investment with wallet balance
5. Track investment performance
6. Redeem when needed

### Transaction Management
- Add money to wallet via multiple payment methods
- Real-time transaction tracking
- Detailed transaction history
- Export capabilities

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### API Testing
Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes and orientations

## 🌟 Performance Optimizations

- **Frontend**: Code splitting, lazy loading, optimized images
- **Backend**: Database indexing, query optimization, caching
- **Infrastructure**: Docker multi-stage builds, Nginx compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for **Grip Invest Winter Internship 2025** evaluation purposes.

## 📞 Contact

For questions about this project:
- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]

---

**Built with ❤️ for Grip Invest Winter Internship 2025**

*This project demonstrates full-stack development capabilities, modern web technologies, and AI-assisted development practices.*
