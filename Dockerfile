FROM node:20-alpine

WORKDIR /app

# Copy package files and install all dependencies (including dev for building)
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Set environment
ENV NODE_ENV=production
EXPOSE 8000

# Only run runtime dependencies in production

CMD ["node", "dist/server.js"]
