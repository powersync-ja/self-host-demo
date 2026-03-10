# Builds the Convex + PowerSync React demo app from the git repo
FROM node:20

ARG VITE_CONVEX_URL=http://127.0.0.1:3210
ARG VITE_POWERSYNC_URL=http://localhost:8080

WORKDIR /app

RUN git clone https://github.com/kobiebotha/convex-powersync-react-demo.git .

RUN npm install -g pnpm@9

RUN pnpm install --frozen-lockfile

# Vite picks up VITE_* env vars from the process environment at build time
RUN pnpm run build

# Serve the built app
CMD ["pnpm", "preview", "--host"]
