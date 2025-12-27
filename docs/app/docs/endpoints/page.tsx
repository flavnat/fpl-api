import { CodeBlock } from "@/components/code-block"

export default function EndpointsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>REST API Endpoints</h1>
      
      <p>
        Overview of all available REST endpoints in the FPL API.
      </p>

      <h2>Base URL</h2>
      <CodeBlock 
        code="https://fpl-api-6h0d.onrender.com" 
        language="bash" 
      />

      <h2>Endpoints</h2>
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/</code></td>
            <td>GET</td>
            <td>API info and available endpoints</td>
          </tr>
          <tr>
            <td><code>/graphql</code></td>
            <td>POST</td>
            <td>GraphQL endpoint for queries</td>
          </tr>
          <tr>
            <td><code>/graphiql</code></td>
            <td>GET</td>
            <td>Interactive GraphQL playground</td>
          </tr>
          <tr>
            <td><code>/documentation</code></td>
            <td>GET</td>
            <td>Swagger/OpenAPI documentation</td>
          </tr>
          <tr>
            <td><code>/health</code></td>
            <td>GET</td>
            <td>Health check with database status</td>
          </tr>
          <tr>
            <td><code>/health/ready</code></td>
            <td>GET</td>
            <td>Readiness check with sync status</td>
          </tr>
        </tbody>
      </table>

      <h2>Root Endpoint</h2>
      <p>The root endpoint returns API information:</p>
      <CodeBlock 
        code="curl https://fpl-api-6h0d.onrender.com/" 
        language="bash" 
        filename="terminal"
      />

      <p>Response:</p>
      <CodeBlock 
        code={`{
  "name": "FPL API",
  "version": "1.0.0",
  "description": "Unofficial Fantasy Premier League API",
  "endpoints": {
    "graphql": "/graphql",
    "graphiql": "/graphiql",
    "documentation": "/documentation",
    "health": "/health",
    "ready": "/health/ready"
  }
}`}
        language="json"
        filename="response.json"
      />
    </div>
  )
}
