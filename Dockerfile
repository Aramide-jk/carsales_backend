# Stage 1: build
FROM public.ecr.aws/library/node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production image
FROM public.ecr.aws/library/node:18

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "dist/server.js"]
