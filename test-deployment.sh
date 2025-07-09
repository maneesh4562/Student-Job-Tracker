#!/bin/bash

# Test Deployment Script for AI Resume Analyzer
# This script tests the deployment without actually deploying

set -e

echo "🧪 Testing AI Resume Analyzer Deployment Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Check if Docker is installed
print_status "Testing Docker installation..."
if command -v docker &> /dev/null; then
    print_status "✅ Docker is installed"
    docker --version
else
    print_error "❌ Docker is not installed"
    exit 1
fi

# Test 2: Check if Docker Compose is installed
print_status "Testing Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    print_status "✅ Docker Compose is installed"
    docker-compose --version
else
    print_error "❌ Docker Compose is not installed"
    exit 1
fi

# Test 3: Check if Node.js is installed
print_status "Testing Node.js installation..."
if command -v node &> /dev/null; then
    print_status "✅ Node.js is installed"
    node --version
else
    print_error "❌ Node.js is not installed"
    exit 1
fi

# Test 4: Check if Python is installed
print_status "Testing Python installation..."
if command -v python3 &> /dev/null; then
    print_status "✅ Python is installed"
    python3 --version
else
    print_error "❌ Python is not installed"
    exit 1
fi

# Test 5: Check if required files exist
print_status "Testing required files..."
required_files=(
    "docker-compose.yml"
    "Dockerfile"
    "Dockerfile.client"
    "nginx.conf"
    "deploy.sh"
    "server/package.json"
    "client/package.json"
    "nlp-service/requirements.txt"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "✅ $file exists"
    else
        print_error "❌ $file is missing"
        exit 1
    fi
done

# Test 6: Check if environment files exist
print_status "Testing environment files..."
env_files=(
    "server/.env.production"
    "client/.env.production"
)

for file in "${env_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "✅ $file exists"
    else
        print_warning "⚠️  $file is missing (will be created during deployment)"
    fi
done

# Test 7: Test Docker build (dry run)
print_status "Testing Docker build process..."
if docker-compose config > /dev/null 2>&1; then
    print_status "✅ Docker Compose configuration is valid"
else
    print_error "❌ Docker Compose configuration is invalid"
    exit 1
fi

# Test 8: Check available ports
print_status "Testing port availability..."
ports=(3000 5001 8000 27017)

for port in "${ports[@]}"; do
    if lsof -i :$port > /dev/null 2>&1; then
        print_warning "⚠️  Port $port is already in use"
    else
        print_status "✅ Port $port is available"
    fi
done

# Test 9: Check disk space
print_status "Testing disk space..."
available_space=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$available_space" -gt 5 ]; then
    print_status "✅ Sufficient disk space available ($available_space GB)"
else
    print_warning "⚠️  Low disk space ($available_space GB). Recommended: >5GB"
fi

# Test 10: Check memory
print_status "Testing available memory..."
total_mem=$(free -g | awk 'NR==2{print $2}')
if [ "$total_mem" -gt 4 ]; then
    print_status "✅ Sufficient memory available ($total_mem GB)"
else
    print_warning "⚠️  Low memory ($total_mem GB). Recommended: >4GB"
fi

echo ""
print_status "🎉 All deployment tests passed!"
echo ""
print_status "Next steps:"
echo "  1. Update environment variables in .env.production files"
echo "  2. Run: ./deploy.sh"
echo "  3. Access the application at http://localhost:3000"
echo ""
print_warning "Remember to:"
echo "  - Set up MongoDB Atlas for production"
echo "  - Configure SSL certificates"
echo "  - Set up monitoring and logging"
echo "  - Configure backup strategies" 