# Database Migration Docker Setup

This repository contains a Docker-based database migration system using Drizzle ORM for the Marketverse project.

## 📋 Prerequisites

- Docker installed on your system
- Docker Hub account (for pushing images)
- Valid database schema files in `src/db/`
- `drizzle.config.ts` configured properly

## 🚀 Quick Start

### 1. Build Migration Docker Image

Build the migration Docker image from the project root:

```bash
docker build -f src/db/Dockerfile -t migration:latest .
```

### 2. Create Docker Network

Create a dedicated network for database operations:

```bash
docker network create db-network
```

### 3. Run PostgreSQL Test Container

Start a PostgreSQL container for testing migrations:

```bash
docker run -d \
  --name postgres-test \
  --network db-network \
  -e POSTGRES_DB=marketverse \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password123 \
  -p 5432:5432 \
  postgres:latest
```

### 4. Run Database Migration

Execute the migration against the test database:

```bash
docker run --rm \
  --network db-network \
  -e DATABASE_URL="postgresql://postgres:password123@postgres-test:5432/marketverse" \
  migration:latest
```

### 5. Verify Migration Success

Connect to PostgreSQL and check if tables were created:

```bash
docker exec -it postgres-test psql -U postgres -d marketverse
```

Inside psql, run:

```sql
\dt  -- List all tables
\q   -- Quit psql
```

**Expected Output:**

```
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | buyer_address   | table | postgres
 public | buyer_payment   | table | postgres
 public | buyer_profile   | table | postgres
 public | newsletter      | table | postgres
 public | orders          | table | postgres
 public | payment_account | table | postgres
 public | products        | table | postgres
 public | reviews         | table | postgres
 public | sellers         | table | postgres
 public | sellers_info    | table | postgres
(10 rows)
```

## 🔄 Migration Workflow

### When Schema Changes

Every time you modify your database schema:

1. **Build new migration image:**

   ```bash
   docker build -f src/db/Dockerfile -t migration:v1.0.1 .
   ```

2. **Tag for Docker Hub:**

   ```bash
   docker tag migration:v1.0.1 your-dockerhub-username/marketverse-migration:v1.0.1
   ```

3. **Push to Docker Hub:**

   ```bash
   docker push your-dockerhub-username/marketverse-migration:v1.0.1
   ```

4. **Test the migration:**

   ```bash
   # Clean up previous test (if exists)
   docker rm -f postgres-test

   # Run new PostgreSQL container
   docker run -d \
     --name postgres-test \
     --network db-network \
     -e POSTGRES_DB=marketverse \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password123 \
     -p 5432:5432 \
     postgres:latest

   # Wait for PostgreSQL to be ready
   sleep 10

   # Run migration
   docker run --rm \
     --network db-network \
     -e DATABASE_URL="postgresql://postgres:password123@postgres-test:5432/marketverse" \
     migration:v1.0.1
   ```

### Version Tagging Strategy

- **Major changes (breaking):** `v2.0.0`, `v3.0.0`
- **Minor changes (new features):** `v1.1.0`, `v1.2.0`
- **Patch changes (fixes):** `v1.0.1`, `v1.0.2`

## 🛠️ Useful Commands

### Check Migration Logs

```bash
docker run --rm \
  --network db-network \
  -e DATABASE_URL="postgresql://postgres:password123@postgres-test:5432/marketverse" \
  migration:latest
```

### Inspect Database Schema

```bash
# Connect to database
docker exec -it postgres-test psql -U postgres -d marketverse

# Inside psql:
\dt              -- List tables
\d+ table_name   -- Describe specific table
\dn              -- List schemas
\du              -- List users
SELECT version(); -- PostgreSQL version
\q               -- Quit
```

### Clean Up Test Environment

```bash
# Remove test containers
docker rm -f postgres-test

# Remove network
docker network rm db-network

# Remove unused images
docker image prune
```

## 📁 File Structure

```
├── src/db/
│   ├── Dockerfile          # Migration container definition
│   ├── schema.ts          # Database schema files
│   └── index.ts           # Database connection
├── drizzle.config.ts      # Drizzle configuration
└── package.json           # Minimal dependencies for migration
```

## ⚠️ Important Notes

- **Manual Process:** Currently, migrations are run manually. Future automation with Jenkins is planned.
- **Always Test:** Test migrations on a clean database before applying to production.
- **Version Control:** Always tag and push migration images to Docker Hub for version tracking.
- **Environment Variables:** Ensure `DATABASE_URL` matches your target database configuration.
- **Network Isolation:** Always use Docker networks for container communication.

## 🔧 Troubleshooting

### Migration Fails

- Check if PostgreSQL container is running: `docker ps`
- Verify network connectivity: `docker network inspect db-network`
- Check migration logs for specific errors

### No Tables Created

- Ensure `drizzle.config.ts` points to correct schema files
- Verify environment variables are set correctly
- Check if migration container has access to `src/db/` folder

### Connection Errors

- Confirm both containers are on the same network
- Use container name (`postgres-test`) as hostname in DATABASE_URL
- Wait for PostgreSQL to fully start before running migrations (10-15 seconds)

## 📝 Future Enhancements

- [ ] Automated CI/CD pipeline with Jenkins
- [ ] Integration with production databases
- [ ] Rollback mechanisms
- [ ] Migration validation tests
- [ ] Automated Docker Hub publishing
