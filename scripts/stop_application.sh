#!/bin/bash
set -e

echo "Stopping existing backend container..."
docker stop backend || true
docker rm backend || true

echo "Application stopped successfully"
