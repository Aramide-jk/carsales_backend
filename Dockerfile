# ==========================
# Stage 1: Build Stage
# ==========================
FROM public.ecr.aws/library/node:18 AS build

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies (including dev for TS build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# ==========================
# Stage 2: Production Stage
# ==========================
FROM public.ecr.aws/library/node:18

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JS from build stage
COPY --from=build /app/dist ./dist

# Set environment variable for production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
