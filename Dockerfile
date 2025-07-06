# Use Node.js 18 LTS
FROM node:18-alpine

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create tmp directory for production database
RUN mkdir -p /tmp

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
