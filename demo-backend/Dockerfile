# Use Node.js 20 Docker image as base
FROM node:20

ENV DATABASE_HOST=
ENV DATABASE_PORT=
ENV DATABASE_NAME=
ENV DATABASE_USER=
ENV DATABASE_PASSWORD=
ENV POWERSYNC_URL=
ENV POWERSYNC_PUBLIC_KEY=
ENV POWERSYNC_PRIVATE_KEY=
ENV JWT_ISSUER=

# The commit to checkout. This is main, but keeping it constant uses caches which might not update easily
ARG GIT_COMMIT=964d62d7a975507d47486ebb2c6c9bde9b8c54c5

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g pnpm@8

RUN git init && \
    git remote add origin https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo.git && \
    git fetch origin $GIT_COMMIT && \
    git checkout FETCH_HEAD

# Install dependencies
RUN pnpm install

# Command to run the application
CMD ["pnpm", "start"]