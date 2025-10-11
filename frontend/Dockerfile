FROM node:24-alpine

WORKDIR /app

# Install some stuff
npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the project (if applicable)
RUN pnpm build

# Start the app
CMD ["pnpm", "start"]

