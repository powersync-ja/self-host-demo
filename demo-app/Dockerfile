# Use Node.js 20 Docker image as base
FROM node:20

ENV POWERSYNC_PORT=8080

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm install -g pnpm@8

# Install dependencies
RUN pnpm install

# Copy the rest of the demo launcher code to the container
COPY / ./

# Build TypeScript code
RUN pnpm run build

# Command to run the application
CMD ["pnpm", "preview", "--host"]