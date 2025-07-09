# 🚀 AI Resume Analyzer - Production Deployment Guide

This guide will help you deploy the AI Resume Analyzer application to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Node.js](https://nodejs.org/) (v18.0+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for production database)
- Domain name (optional but recommended)

## 🏗️ Architecture Overview

The application consists of four main components:

1. **Frontend** (React + Vite) - Port 3000
2. **Backend API** (Node.js + Express) - Port 5001
3. **NLP Service** (Python + FastAPI) - Port 8000
4. **Database** (MongoDB) - Port 27017

## 🔧 Environment Configuration

### 1. Backend Environment (.env.production)

```bash
# Production Environment Configuration
NODE_ENV=production
PORT=5001

# MongoDB Production Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ai-resume-analyzer?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# NLP Service Configuration
NLP_SERVICE_URL=https://your-nlp-service-domain.com

# External APIs
GITHUB_JOBS_API=https://jobs.github.com/positions.json

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/production.log

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 2. Frontend Environment (.env.production)

```bash
# Production Environment Configuration
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_NLP_SERVICE_URL=https://your-nlp-service-domain.com
```

## 🐳 Docker Deployment

### Quick Start

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd AIResume_Analyser
   ```

2. **Update environment variables:**
   - Edit `server/.env.production`
   - Edit `client/.env.production`
   - Update `docker-compose.yml` with your domain names

3. **Deploy:**
   ```bash
   ./deploy.sh
   ```

### Manual Deployment

1. **Build and start services:**
   ```bash
   docker-compose down --volumes --remove-orphans
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Check service health:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - NLP Service: http://localhost:8000

## ☁️ Cloud Deployment Options

### Option 1: AWS (Recommended)

#### Using AWS ECS with Fargate

1. **Install AWS CLI and configure:**
   ```bash
   aws configure
   ```

2. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name ai-resume-frontend
   aws ecr create-repository --repository-name ai-resume-backend
   aws ecr create-repository --repository-name ai-resume-nlp
   ```

3. **Build and push images:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build and push
   docker build -t ai-resume-frontend .
   docker tag ai-resume-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-resume-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-resume-frontend:latest
   ```

4. **Deploy using AWS ECS:**
   - Create ECS cluster
   - Create task definitions
   - Create services
   - Set up Application Load Balancer

#### Using AWS EC2

1. **Launch EC2 instance:**
   ```bash
   # Launch Ubuntu 22.04 instance
   # Install Docker and Docker Compose
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

2. **Deploy application:**
   ```bash
   git clone <your-repo-url>
   cd AIResume_Analyser
   ./deploy.sh
   ```

### Option 2: Google Cloud Platform

1. **Install Google Cloud SDK:**
   ```bash
   gcloud init
   ```

2. **Deploy using Cloud Run:**
   ```bash
   # Deploy backend
   gcloud run deploy ai-resume-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated

   # Deploy frontend
   gcloud run deploy ai-resume-frontend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Deploy backend:**
   ```bash
   cd server
   heroku create ai-resume-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   git push heroku main
   ```

3. **Deploy frontend:**
   ```bash
   cd client
   heroku create ai-resume-frontend
   heroku config:set VITE_API_BASE_URL=https://ai-resume-backend.herokuapp.com/api
   git push heroku main
   ```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

#### Using Let's Encrypt (Free)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

#### Using AWS Certificate Manager

1. **Request certificate in AWS Console**
2. **Attach to Application Load Balancer**

### 2. Environment Variables Security

- Use AWS Secrets Manager or HashiCorp Vault
- Never commit secrets to version control
- Rotate secrets regularly

### 3. Database Security

- Use MongoDB Atlas with VPC peering
- Enable network access controls
- Use strong authentication
- Enable encryption at rest

## 📊 Monitoring and Logging

### 1. Application Monitoring

#### Using AWS CloudWatch

```bash
# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent

# Configure monitoring
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

#### Using Prometheus + Grafana

1. **Add Prometheus configuration:**
   ```yaml
   # prometheus.yml
   global:
     scrape_interval: 15s
   
   scrape_configs:
     - job_name: 'ai-resume-backend'
       static_configs:
         - targets: ['localhost:5001']
   ```

2. **Deploy with docker-compose:**
   ```yaml
   prometheus:
     image: prom/prometheus
     ports:
       - "9090:9090"
     volumes:
       - ./prometheus.yml:/etc/prometheus/prometheus.yml
   
   grafana:
     image: grafana/grafana
     ports:
       - "3001:3000"
   ```

### 2. Log Management

#### Using ELK Stack

```yaml
# docker-compose.yml addition
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

kibana:
  image: docker.elastic.co/kibana/kibana:7.17.0
  ports:
    - "5601:5601"
  depends_on:
    - elasticsearch

logstash:
  image: docker.elastic.co/logstash/logstash:7.17.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
```

## 🔄 CI/CD Pipeline

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker images
      run: |
        docker build -t ai-resume-backend .
        docker tag ai-resume-backend:latest ${{ steps.login-ecr.outputs.registry }}/ai-resume-backend:latest
        docker push ${{ steps.login-ecr.outputs.registry }}/ai-resume-backend:latest
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service --cluster ai-resume-cluster --service ai-resume-backend --force-new-deployment
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   sudo lsof -i :5001
   
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Docker build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Database connection issues:**
   ```bash
   # Check MongoDB connection
   mongo "mongodb://your-connection-string"
   
   # Test from application
   curl http://localhost:5001/api/health
   ```

4. **Memory issues:**
   ```bash
   # Check container resource usage
   docker stats
   
   # Increase memory limits in docker-compose.yml
   ```

### Health Checks

```bash
# Check all services
curl -f http://localhost:5001/api/health
curl -f http://localhost:8000/health
curl -f http://localhost:3000

# Check Docker containers
docker-compose ps
docker-compose logs -f
```

## 📈 Performance Optimization

### 1. Frontend Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

### 2. Backend Optimization

- Enable caching (Redis)
- Implement rate limiting
- Use connection pooling
- Optimize database queries

### 3. Database Optimization

- Create proper indexes
- Use read replicas
- Implement caching layer
- Monitor query performance

## 🔄 Backup and Recovery

### 1. Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://your-connection-string" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backup/$DATE"
aws s3 sync /backup s3://your-backup-bucket
```

### 2. Application Backup

```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/

# Backup configuration
cp .env.production backup_env_$(date +%Y%m%d)
```

## 📞 Support

For deployment issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Test individual services
4. Check network connectivity
5. Review security group settings

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure automated backups
3. Implement CI/CD pipeline
4. Set up staging environment
5. Plan for scaling

---

**Happy Deploying! 🚀** 