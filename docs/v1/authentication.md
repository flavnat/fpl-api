# Authentication

The public API endpoints (GraphQL and REST data retrieval) are **free and public**. You do not need an API key to access them.

## Sync Endpoints

The synchronization endpoints (e.g., `/sync/*`) are restricted to administrators.

To access these, you must provide the `x-api-key` header:

```http
POST /sync/fixtures HTTP/1.1
Host: https://fpl-api-6h0d.onrender.com
x-api-key: YOUR_ADMIN_KEY
```
