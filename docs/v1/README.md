# Introduction

Welcome to the FPL API Documentation (v1).

This API provides data from the Fantasy Premier League game, synced and stored in a PostgreSQL database for easier querying.

## Features

- **GraphQL API**: Powerful querying capabilities.
- **REST API**: Standard endpoints for data retrieval.
- **Auto-Sync**: Data remains up-to-date with FPL.

## Quick Start: Live Query

You can test the API immediately using our **[Interactive GraphiQL Editor](https://fpl-api-6h0d.onrender.com/graphiql)**.

Try running this query to get live scores for matches currently in progress:

```graphql
query GetLiveScores {
  fixtures(where: { started: { eq: true }, finished: { eq: false } }) {
    items {
      minutes
      team_h { short_name }
      team_a { short_name }
      team_h_score
      team_a_score
    }
  }
}
```

## Base URL

The API is accessible at:
```text
https://fpl-api-6h0d.onrender.com/graphql
```

