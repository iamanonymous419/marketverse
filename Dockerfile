# Base image for building
FROM node:iron-alpine AS builder 

# Initialize a working directory
WORKDIR /home/marketverse

# Copy package.json and package-lock.json to the working directory
COPY package.json pnpm-lock.yaml* ./

# install pnpm 
RUN npm install -g pnpm@latest-10

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Ensure Clerk environment variable is available during build
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

# Build the project
RUN pnpm run build 

# Base image for running
FROM node:iron-alpine AS runner 

# install pnpm 
RUN npm install -g pnpm@latest-10

# Initialize a working directory
WORKDIR /app

# Copy build output and necessary files
COPY --from=builder /home/marketverse/.next ./.next
COPY --from=builder /home/marketverse/node_modules ./node_modules
COPY --from=builder /home/marketverse/package.json .
COPY --from=builder /home/marketverse/pnpm-lock.yaml .

# Ensure Clerk key is available in runtime
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

# Expose ports
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]
