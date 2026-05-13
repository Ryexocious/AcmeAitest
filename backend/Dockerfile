# Use Node.js 18 Alpine as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5000

# Start script: run prisma db push to ensure schema is up-to-date, then start the server
CMD ["sh", "-c", "npx prisma db push && npm start"]
