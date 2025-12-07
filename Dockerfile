# ==========================
# Stage 1: Build Stage
# ==========================
FROM public.ecr.aws/docker/library/node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================
# Stage 2: Production Stage
# ==========================
FROM public.ecr.aws/docker/library/node:18

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/server.js"]

