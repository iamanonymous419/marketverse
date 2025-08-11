# Use Node.js LTS Alpine version for a smaller image size (Alpine = minimal Linux distro)
FROM node:iron-alpine

# Install pnpm globally (specific version for reproducibility)
RUN npm install -g pnpm@10.4.1

# Set working directory inside the container
WORKDIR /app

# Initialize a new package.json (non-interactive)
RUN pnpm init

# Install required dependencies:
# - drizzle-kit: CLI for Drizzle ORM
# - drizzle-orm: Drizzle ORM library
# - pg: PostgreSQL client
# - @types/pg: TypeScript type definitions for pg
# - dotenv: Load environment variables from a .env file
RUN pnpm install drizzle-kit drizzle-orm pg @types/pg dotenv

# Copy database-related source files into the container
COPY src/db/ ./src/db/

# Copy Drizzle configuration file into the container
COPY drizzle.config.ts ./

# Copy TypeScript configuration file into the container
COPY tsconfig.json ./

# Default container command:
# - Run Drizzle generate (generate SQL migrations from schema)
# - Push migrations to the database
CMD ["sh", "-c", "pnpm drizzle-kit generate && pnpm drizzle-kit push"]

# Alternative commands (uncomment if needed):
# CMD ["pnpm", "drizzle-kit", "generate"]  # Only generate migrations
# CMD ["pnpm", "drizzle-kit", "push"]      # Only push migrations
