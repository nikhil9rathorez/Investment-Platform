# 🛠️ Setup Guide - Mini Investment Platform

This guide will help you set up and run the Mini Investment Platform locally or in a production environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** (recommended)
- **MongoDB** (if running without Docker)
- **Git** (to clone the repository)

## 🚀 Quick Setup with Docker (Recommended)

This is the fastest way to get the platform running:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mini-investment-platform
```

### 2. Start with Docker Compose

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

### 4. Test with Demo Account

- **Admin Login**: `admin@gripinvest.com` / `Admin123`
- **Or register a new account**: Click "Get Started" on the homepage

## 🔧 Manual Setup (Local Development)

If you prefer to run services individually:

### 1. Setup MongoDB

**Option A: Using Docker**
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7-jammy
```

**Option B: Local MongoDB Installation**
- Install MongoDB Community Edition
- Start MongoDB service
- Create database: `mini_investment_platform`

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# Update MongoDB URI, JWT secret, etc.

# Start development server
npm run dev

# Backend will be available at http://localhost:5000
```

### 3. Setup Frontend

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Frontend will be available at http://localhost:3000
```

## 🌱 Initialize Database with Sample Data

The database will be automatically initialized with sample data when using Docker. For manual setup:

### 1. Connect to MongoDB

```bash
# Using MongoDB shell
mongosh "mongodb://admin:password123@localhost:27017/mini_investment_platform?authSource=admin"
```

### 2. Run Initialization Script

```javascript
// Copy and paste the content from docker/mongodb/init-mongo.js
// Or import it directly:
load('/path/to/docker/mongodb/init-mongo.js');
```

## 🔐 Environment Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://admin:password123@localhost:27017/mini_investment_platform?authSource=admin

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12
```

### Frontend Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Verify Installation

### 1. Health Checks

```bash
# Check backend health
curl http://localhost:5000/health

# Expected response:
# {
#   "success": true,
#   "message": "Mini Investment Platform API is running",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "version": "1.0.0"
# }
```

### 2. Test API Endpoints

```bash
# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Get products list
curl http://localhost:5000/api/products
```

### 3. Frontend Access

1. Open http://localhost:3000
2. You should see the landing page
3. Click "Get Started" to register
4. Or use admin credentials: `admin@gripinvest.com` / `Admin123`

## 🏗️ Development Workflow

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Frontend Development

```bash
cd frontend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🐳 Docker Development Environment

For development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# This will:
# - Mount source code as volumes
# - Enable hot reload for both frontend and backend
# - Use development configurations
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000 or 5000
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs <mongo-container-id>

# Connect to MongoDB container
docker exec -it <mongo-container-id> mongosh
```

#### Docker Issues
```bash
# Clean up Docker resources
docker-compose down
docker system prune -f

# Rebuild containers
docker-compose up --build -d
```

#### Frontend Not Loading
- Check if VITE_API_URL is correctly set
- Verify backend is running on the specified port
- Check browser console for CORS errors

#### Backend API Errors
- Verify MongoDB connection string
- Check if all required environment variables are set
- Review backend logs for specific errors

### Performance Issues

#### Slow Database Queries
- Ensure proper indexes are created
- Check MongoDB logs for slow queries
- Optimize query patterns

#### Frontend Loading Slowly
- Check network tab for large bundle sizes
- Verify code splitting is working
- Use React DevTools to identify performance bottlenecks

## 📦 Production Deployment

### 1. Production Docker Setup

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production environment
docker-compose -f docker-compose.yml up -d

# Monitor services
docker-compose ps
docker-compose logs -f
```

### 2. Environment Security

For production, ensure:
- Change default passwords
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up proper database authentication

### 3. Database Backup

```bash
# Backup MongoDB data
docker exec <mongo-container> mongodump --out /backup

# Restore from backup
docker exec <mongo-container> mongorestore /backup
```

## 📊 Monitoring

### Application Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Health Monitoring

```bash
# Check container health
docker-compose ps

# View detailed container info
docker inspect <container-name>
```

## 🆘 Getting Help

If you encounter any issues:

1. Check the logs for error messages
2. Verify all prerequisites are installed
3. Ensure ports 3000, 5000, and 27017 are available
4. Review environment variable configuration
5. Check Docker service status

For additional support:
- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

---

🎉 **Congratulations!** Your Mini Investment Platform should now be up and running!

Visit http://localhost:3000 to start exploring the platform.
