import { CodeBlock } from "@/components/code-block"

export default function BaseUrlPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Base URL</h1>
      
      <p>All API requests should be made to the following base URL:</p>

      <CodeBlock 
        code="https://fpl-api-6h0d.onrender.com" 
        language="bash" 
      />

      <h2>Available Endpoints</h2>

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
            <td>GraphQL endpoint</td>
          </tr>
          <tr>
            <td><code>/graphiql</code></td>
            <td>GET</td>
            <td>GraphQL interactive playground</td>
          </tr>
          <tr>
            <td><code>/documentation</code></td>
            <td>GET</td>
            <td>Swagger/OpenAPI documentation</td>
          </tr>
          <tr>
            <td><code>/health</code></td>
            <td>GET</td>
            <td>Health check with database connectivity</td>
          </tr>
          <tr>
            <td><code>/health/ready</code></td>
            <td>GET</td>
            <td>Readiness check with sync status</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
