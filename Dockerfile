FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install production dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8090

# Run the application
CMD ["node", "app.js"]
