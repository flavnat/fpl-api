# FPL API

An unofficial **Fantasy Premier League (FPL) API** built with **Fastify**, **GraphQL**, and **PostgreSQL**. This API provides comprehensive access to FPL data including players, teams, fixtures, events, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

## Base URL

```
https://fpl-api-6h0d.onrender.com
```

## Features

- **High Performance** - Built with Fastify for maximum speed
- **GraphQL API** - Flexible data querying with GraphQL
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Data Synchronization** - Automated sync with official FPL API
- **Type Safe** - Full TypeScript support

## API Documentation

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info and available endpoints |
| `/graphql` | POST | GraphQL endpoint |
| `/graphiql` | GET | GraphQL interactive playground |
| `/documentation` | GET | Swagger/OpenAPI documentation |
| `/health` | GET | Health check with database connectivity |
| `/health/ready` | GET | Readiness check with sync status |

---

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

---

### Health Check

```bash
# Basic health check
curl https://fpl-api-6h0d.onrender.com/health

# Readiness check with sync status
curl https://fpl-api-6h0d.onrender.com/health/ready
```

---

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    "count": 123
  },
  "requestId": "req-1"
}
```

**Error Response:**

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

## Security

- **Rate Limiting** - Prevents abuse with configurable rate limits
- **Helmet** - Security headers for protection against common vulnerabilities
- **CORS** - Configurable CORS policy
- **Input Validation** - All inputs are validated
- **Error Handling** - Secure error responses without exposing internals

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data provided by the [Official Fantasy Premier League API](https://fantasy.premierleague.com/api/)
- Built with [Fastify](https://www.fastify.io/)
- GraphQL powered by [Mercurius](https://mercurius.dev/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)

---

**Note**: This is an unofficial API and is not affiliated with or endorsed by the Premier League or Fantasy Premier League.
