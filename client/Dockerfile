# Stage 1: Build the project
FROM node:18-alpine AS builder

WORKDIR /build

ARG VITE_SOCKET_URL=http://localhost:3000
ARG VITE_SOCKET_PATH=/socket.io
ARG VITE_API_URL=/api/v2
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_SOCKET_PATH=$VITE_SOCKET_PATH
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
COPY package*.json .

RUN npm ci

# Copy the rest of the source code and build
COPY . .

RUN npm run build
RUN npm prune --omit=dev

# Stage 2: Serve the `dist` folder
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the built frontend from the builder stage
COPY --from=builder /build/dist dist/
COPY --from=builder /build/package*.json .
COPY --from=builder /build/node_modules ./node_modules

# Expose the port
EXPOSE 5173

# Start the server
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]