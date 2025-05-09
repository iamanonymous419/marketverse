# =====================================================
# 🛠️ Marketverse Project Makefile 🛠️
# Automates Docker, Database, and Development Tasks
# =====================================================
#
# 👉 Available Commands:
#
# 📦 Docker Image Management:
#   make docker-build         → Build the Docker image
#   make docker-image-push    → Push the image to Docker Hub
#
# 🗄️ Database Management:
#   make run-database         → Start PostgreSQL container
#   make stop-database        → Stop PostgreSQL container
#
# 🚀 Project Setup & Development:
#   make install              → Install dependencies
#   make format               → Format the codebase
#   make build                → Build the project
#   make dev                  → Run in development mode
#   make start                → Start in production mode
#   make production           → Build & start in production
#
# 🐳 Docker Compose Commands:
#   make compose-run          → Start all services
#   make compose-build        → Build & start all services
#   make compose-stop         → Stop all running services
#
# 🧹 Cleanup:
#   make clean                → Remove unused Docker data
#
# =====================================================

# Variables
CONTAINER_NAME = your_username/marketverse:your_image_tag
KEY = your_clerk_public_key

# ------------------------------
# 📦 Docker Image Management
# ------------------------------

# Build Docker image with Clerk API key
docker-build:
	@echo "🚀 Building Docker image: $(CONTAINER_NAME) ..."
	docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$(KEY) -t $(CONTAINER_NAME) .
	@echo "✅ Docker build completed!"

# Push Docker image to registry
docker-image-push:
	@echo "📤 Pushing Docker image: $(CONTAINER_NAME) ..."
	docker push $(CONTAINER_NAME)
	@echo "✅ Docker image pushed successfully!"

# ------------------------------
# 🗄️ Database Management
# ------------------------------

# Start only the database container
run-database:
	@echo "🗄️ Starting PostgreSQL database..."
	docker compose up -d database
	@echo "✅ Database is running!"

# Stop the database container
stop-database:
	@echo "🛑 Stopping PostgreSQL database..."
	docker compose stop database
	@echo "✅ Database stopped!"

# ------------------------------
# 🚀 Project Setup & Development
# ------------------------------

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pnpm install
	@echo "✅ Dependencies installed!"

# Format code using PNPM
format:
	@echo "📝 Formatting code..."
	pnpm run format
	@echo "✅ Code formatted successfully!"

# Build the project
build:
	@echo "🔨 Building the project..."
	pnpm run build
	@echo "✅ Build completed!"

# For Lint 
lint:
	@echo "Linting started"
	pnpm run lint
	@echo "✅ Linting done"

# Run the project in development mode
dev:
	@echo "🚀 Running the project in development mode..."
	pnpm run dev

# for run drizzle stuido 
studio:
	@echo "🚀 Running the project in stuidot mode..."
	pnpm exec drizzle-kit studio

# Start the project in production mode
start:
	@echo "🚀 Starting the project..."
	pnpm run start

# Build and start in production
production: build start
	@echo "🚀 Running in production mode..."
	@echo "✅ Marketverse is live!"

# ------------------------------
# 🐳 Docker Compose Commands
# ------------------------------

# Start all services using Docker Compose
compose-run:
	@echo "🚀 Starting all services with Docker Compose..."
	docker compose up -d
	@echo "✅ All services are up and running!"

# Build and start services using Docker Compose
compose-build:
	@echo "🔨 Building and starting services with Docker Compose..."
	docker compose up --build -d
	@echo "✅ Services built and started!"

# Stop all services using Docker Compose
compose-stop:
	@echo "🛑 Stopping all services..."
	docker compose down
	@echo "✅ Services stopped!"

# ------------------------------
# 🧹 Cleanup
# ------------------------------

# Remove unused Docker data
clean:
	@echo "🧹 Cleaning up Docker system..."
	docker system prune -f
	@echo "✅ Cleanup complete!"
