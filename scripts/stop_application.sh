#!/bin/bash
set -e

echo "Stopping existing backend container..."

# Stop the container
docker stop backend 2>/dev/null || true

# Force remove the container
docker rm -f backend 2>/dev/null || true

# Double-check it's gone
if docker ps -a | grep -q backend; then
    echo "WARNING: Container still exists, forcing removal..."
    CONTAINER_ID=$(docker ps -aq -f name=backend)
    docker rm -f $CONTAINER_ID 2>/dev/null || true
fi

# Clean up any dangling containers
docker container prune -f || true

echo "Application stopped successfully"
