#!/bin/bash
set -e

REGION="us-east-1"
ACCOUNT_ID="734649603753"
REPO="backend"

echo "Installing dependencies..."
dnf install -y docker awscli jq 2>/dev/null || yum install -y docker awscli jq

# Ensure Docker is running
systemctl enable docker
systemctl start docker

# Add ec2-user to docker group
usermod -aG docker ec2-user || true

# Clean up old backend containers if they exist
echo "Cleaning up old containers..."
docker stop backend 2>/dev/null || true
docker rm -f backend 2>/dev/null || true

echo "Authenticating with ECR..."
aws ecr get-login-password --region ${REGION} \
  | docker login \
      --username AWS \
      --password-stdin \
      ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

echo "Pulling latest Docker image..."
# Remove old image to force fresh pull
docker rmi ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest 2>/dev/null || true

# Pull latest
docker pull ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest

echo "Before install completed successfully"
