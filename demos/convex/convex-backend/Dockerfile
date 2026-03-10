FROM node:20

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy dependency files first for better layer caching
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
