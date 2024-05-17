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

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g pnpm@8

# TODO update main branch
RUN git clone https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo.git

WORKDIR /app/powersync-nodejs-backend-todolist-demo

# Install dependencies
RUN pnpm install

# Command to run the application
CMD ["pnpm", "start"]