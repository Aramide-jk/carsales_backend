#!/bin/bash
set -e

REGION="us-east-1"
ACCOUNT_ID="734649603753"
REPO="backend"

echo "Installing dependencies..."
dnf install -y docker awscli jq || yum install -y docker awscli jq

# Ensure Docker is running
systemctl enable docker
systemctl start docker

# Add ec2-user to docker group
usermod -aG docker ec2-user || true

echo "Authenticating with ECR..."
aws ecr get-login-password --region ${REGION} \
  | docker login \
      --username AWS \
      --password-stdin \
      ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

echo "Pulling latest Docker image..."
docker pull ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest

echo "Before install completed successfully"
