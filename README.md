# FPL API

An unofficial **Fantasy Premier League (FPL) API** built with **Fastify**, **GraphQL**, and **PostgreSQL**. This API provides comprehensive access to FPL data including players, teams, fixtures, events, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

## Features

- **High Performance** - Built with Fastify for maximum speed
- **GraphQL API** - Flexible data querying with GraphQL
- **Production Ready** - Security headers, rate limiting, and error handling
- **Docker Support** - Easy deployment with Docker and docker-compose
-  **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Data Synchronization** - Automated sync with official FPL API
- **PostgreSQL Database** - Reliable data storage with Drizzle ORM
- **Type Safe** - Full TypeScript support
- **Monitoring** - Health checks and readiness probes

## Quick Start

### Prerequisites

- Node.js >= 20
- PostgreSQL >= 14
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/flavnat/fpl-api.git
   cd fpl-api
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database connection and other settings.

4. **Run database migrations**
   ```bash
   yarn db:push
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:3000`

## API Key Authentication

The FPL API uses API key authentication to protect endpoints. You need an API key to access GraphQL and sync endpoints.

### Step 1: Generate Your API Key

Generate a secure random API key using one of these methods:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option C: Using online generator**
Use a secure password generator to create a 64-character hexadecimal string.

Example output:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### Step 2: Configure Your API Key

1. Open your `.env` file
2. Set the `API_KEY` variable with your generated key:

```env
API_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

> ⚠️ **Important**: Never commit your `.env` file to version control. Keep your API key secret!

### Step 3: Using Your API Key

Include your API key in the `x-api-key` header for all protected requests:

**GraphQL Request:**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"query": "{ teams { items { id name } } }"}'
```

**Sync Request:**
```bash
curl -X POST http://localhost:3000/sync/all \
  -H "x-api-key: YOUR_API_KEY"
```

### Protected Endpoints

| Endpoint | Auth Required | Header |
|----------|---------------|--------|
| `/graphql` | ✓ Yes | `x-api-key` |
| `/graphiql` | ✓ Yes | `x-api-key` |
| `/sync/*` | ✓ Yes | `x-api-key` |
| `/health` | ✗ No | - |
| `/health/ready` | ✗ No | - |
| `/api/auth/*` | ✗ No | - |
| `/protected` | ✓ Yes | Session cookie |

### Error Responses

**Missing API Key:**
```json
{
  "errors": [{ "message": "API key is required" }]
}
```

**Invalid API Key:**
```json
{
  "errors": [{ "message": "Invalid API key" }]
}
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL + API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Using Docker

```bash
# Build the image
docker build -t fpl-api .

# Run the container
docker run -p 3000:3000 --env-file .env fpl-api
```

## API Documentation

### Endpoints

- **GraphQL Endpoint**: `http://localhost:3000/graphql`
- **GraphiQL Interface**: `http://localhost:3000/graphiql` (development only)
- **Swagger Documentation**: `http://localhost:3000/documentation`
- **Health Check**: `http://localhost:3000/health`
- **Readiness Check**: `http://localhost:3000/health/ready`

### GraphQL Queries

#### Get Players (Elements)

```graphql
query {
  elements(limit: 10, offset: 0) {
    items {
      id
      web_name
      now_cost
      total_points
      team {
        name
        short_name
      }
      element_type {
        singular_name
      }
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}
```

#### Get Fixtures

```graphql
query {
  fixtures(limit: 10) {
    items {
      id
      kickoff_time
      team_h {
        name
      }
      team_a {
        name
      }
      team_h_score
      team_a_score
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}
```

#### Get Teams

```graphql
query {
  teams {
    items {
      id
      name
      short_name
      strength
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}
```

#### Get Events (Gameweeks)

```graphql
query {
  events {
    items {
      id
      name
      deadline_time
      is_current
      is_next
      most_captained {
        web_name
      }
      most_selected {
        web_name
      }
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}
```

#### Get Element Types (Positions)

```graphql
query {
  element_types {
    items {
      id
      singular_name
      squad_select
      squad_min_play
    }
    meta {
      total
      limit
      offset
      lastSynced
    }
  }
}
```

### REST API Endpoints

#### Sync Data (Requires API Key)

All sync endpoints require an API key in the `x-api-key` header.

```bash
# Sync all data
curl -X POST http://localhost:3000/sync/all \
  -H "x-api-key: your-api-key"

# Sync specific resources
curl -X POST http://localhost:3000/sync/elements \
  -H "x-api-key: your-api-key"

curl -X POST http://localhost:3000/sync/teams \
  -H "x-api-key: your-api-key"

curl -X POST http://localhost:3000/sync/fixtures \
  -H "x-api-key: your-api-key"

curl -X POST http://localhost:3000/sync/events \
  -H "x-api-key: your-api-key"

curl -X POST http://localhost:3000/sync/element-types \
  -H "x-api-key: your-api-key"
```

### Response Format

Success responses follow this standard format:

```json
{
  "success": true,
  "data": {
    "count": 123
    // or other data
  },
  "requestId": "req-1"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "requestId": "req-1"
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL_LOCAL` | Local database connection string | - |
| `DATABASE_URL_DEV` | Development database connection string | - |
| `DATABASE_URL_PROD` | Production database connection string | - |
| `API_KEY` | API key for sync endpoints | `your-secret-api-key-change-in-production` |
| `RATE_LIMIT_MAX` | Maximum requests per window | `100` |
| `RATE_LIMIT_WINDOW` | Rate limit time window | `15 minutes` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `*` |
| `ENABLE_GRAPHIQL` | Enable GraphiQL interface | `true` |
| `ENABLE_SWAGGER` | Enable Swagger documentation | `true` |
| `LOG_LEVEL` | Logging level | `info` |

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev                # Start development server with hot reload

# Building
yarn build              # Build for production
yarn start              # Start production server

# Database
yarn db:push            # Push schema changes to database
yarn db:generate        # Generate migrations
yarn db:migrate         # Run migrations
yarn db:show            # Open Drizzle Studio

# Code Quality
yarn lint               # Run ESLint
yarn lint:fix           # Fix ESLint errors
```

### Project Structure

```
fpl-api/
├── src/
│   ├── config/           # Configuration files
│   ├── db/               # Database schema and migrations
│   ├── graphql/          # GraphQL schema, resolvers, loaders
│   ├── middleware/       # Custom middleware
│   ├── modules/          # Feature modules (elements, teams, etc.)
│   ├── plugins/          # Fastify plugins
│   ├── routes/           # REST API routes
│   ├── utils/            # Utility functions
│   ├── app.ts            # Application entry point
│   └── server.ts         # Server configuration
├── .github/              # GitHub Actions workflows
├── docs/                 # Additional documentation
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── package.json
```

## Security

- **Rate Limiting**: Prevents abuse with configurable rate limits
- **Helmet**: Security headers for protection against common vulnerabilities
- **CORS**: Configurable CORS policy
- **API Key Authentication**: Protects sensitive sync endpoints
- **Input Validation**: All inputs are validated
- **Error Handling**: Secure error responses without exposing internals

## Monitoring

### Health Checks

The API provides health check endpoints for monitoring:

- `/health` - Basic health check with database connectivity
- `/health/ready` - Readiness probe with sync status

### Logging

Structured logging with request IDs for tracing:

```json
{
  "level": "info",
  "time": 1234567890,
  "requestId": "uuid",
  "msg": "Request completed",
  "statusCode": 200
}
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data provided by the [Official Fantasy Premier League API](https://fantasy.premierleague.com/api/)
- Built with [Fastify](https://www.fastify.io/)
- GraphQL powered by [Mercurius](https://mercurius.dev/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)

---

**Note**: This is an unofficial API and is not affiliated with or endorsed by the Premier League or Fantasy Premier League.
