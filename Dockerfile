# ==========================
# Stage 1: Build Stage
# ==========================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install all dependencies (including dev for build)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ==========================
# Stage 2: Production Stage
# ==========================
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Set environment
ENV NODE_ENV=production
EXPOSE 8000

# Start the app
CMD ["node", "dist/server.js"]
