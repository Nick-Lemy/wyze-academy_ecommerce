FROM node:24-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Build the project (if applicable)
RUN yarn build

# Start the app
CMD ["yarn", "start"]

