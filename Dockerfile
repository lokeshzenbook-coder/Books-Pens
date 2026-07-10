# -----------------------------
# Builder Stage
# -----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifest
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the application (remove this line if your project doesn't have a build script)
RUN npm run build

# -----------------------------
# Runtime Stage
# -----------------------------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package manifest
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application from builder
COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]
