# Use Node.js 20 Docker image as base
FROM node:20

ARG VITE_SUPABASE_URL=
ARG VITE_SUPABASE_ANON_KEY=
ARG VITE_POWERSYNC_URL=

# Set the working directory inside the container

RUN git clone https://github.com/powersync-ja/powersync-js.git
WORKDIR /powersync-js

RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Build packages
RUN pnpm build:packages

WORKDIR  /powersync-js/demos/react-supabase-todolist

# Build project in production mode
RUN pnpm build

# Start hosting
CMD ["pnpm", "preview", "--host"]