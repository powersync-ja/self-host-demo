# Use Node.js 20 Docker image as base
FROM node:20

ARG VITE_SUPABASE_URL=
ARG SUPABASE_PUBLISHABLE_KEY=
ARG VITE_POWERSYNC_URL=

ENV VITE_SUPABASE_ANON_KEY=${SUPABASE_PUBLISHABLE_KEY}

# Set the working directory inside the container

RUN git clone https://github.com/powersync-ja/powersync-js.git

RUN npm install -g pnpm

WORKDIR  /powersync-js/demos/react-supabase-todolist

# Build project in production mode
RUN pnpm install && pnpm build

# Start hosting
CMD ["pnpm", "preview", "--host"]