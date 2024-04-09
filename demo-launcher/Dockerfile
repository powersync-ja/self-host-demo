# Use Node.js 20 Docker image as base
FROM node:20

ARG POWERSYNC_PORT

# Set the working directory inside the container
WORKDIR /app

# Copy demo private key to CWD
COPY .env ./

RUN mkdir demo-launcher

WORKDIR /app/demo-launcher

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm install -g pnpm@8

# Install dependencies
RUN pnpm install

# Copy the rest of the demo launcher code to the container
COPY / ./

# Build TypeScript code
RUN pnpm run build

WORKDIR /app

# Clone the example app
RUN git clone https://github.com/powersync-ja/powersync-js.git

WORKDIR /app/powersync-js

RUN pnpm install && pnpm build:packages

WORKDIR /app

# Command to run the application
CMD ["node", "demo-launcher/dist/index.js", "/app/powersync-js/demos/example-nextjs", $PS_PORT]