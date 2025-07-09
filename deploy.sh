#!/bin/bash

# AI Resume Analyzer Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Starting AI Resume Analyzer Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p server/uploads
mkdir -p ssl

# Set environment variables
export NODE_ENV=production

# Build and start services
print_status "Building and starting services..."
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check backend
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
    exit 1
fi

# Check NLP service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_status "✅ NLP service is healthy"
else
    print_error "❌ NLP service health check failed"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_error "❌ Frontend health check failed"
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "📱 Frontend: http://localhost:3000"
print_status "🔧 Backend API: http://localhost:5001"
print_status "🤖 NLP Service: http://localhost:8000"
print_status "🗄️  MongoDB: localhost:27017"

echo ""
print_warning "Remember to:"
echo "  1. Update environment variables in .env.production files"
echo "  2. Set up SSL certificates for production"
echo "  3. Configure your domain names"
echo "  4. Set up monitoring and logging"
echo "  5. Configure backup strategies"

echo ""
print_status "To view logs: docker-compose logs -f"
print_status "To stop services: docker-compose down" 