import { CodeBlock } from "@/components/code-block"

export default function HealthPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Health Check</h1>
      
      <p>
        The API provides health check endpoints for monitoring and orchestration.
      </p>

      <h2>Basic Health Check</h2>
      <CodeBlock 
        code="GET https://fpl-api-6h0d.onrender.com/health" 
        language="bash" 
      />

      <p>Example:</p>
      <CodeBlock 
        code="curl https://fpl-api-6h0d.onrender.com/health" 
        language="bash" 
        filename="terminal"
      />

      <p>Response:</p>
      <CodeBlock 
        code={`{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "uptime": 12345.67,
    "database": "connected"
  },
  "requestId": "req-1"
}`}
        language="json"
        filename="health-response.json"
      />

      <h2>Readiness Check</h2>
      <CodeBlock 
        code="GET https://fpl-api-6h0d.onrender.com/health/ready" 
        language="bash" 
      />

      <p>Example:</p>
      <CodeBlock 
        code="curl https://fpl-api-6h0d.onrender.com/health/ready" 
        language="bash" 
        filename="terminal"
      />

      <p>Response:</p>
      <CodeBlock 
        code={`{
  "success": true,
  "data": {
    "ready": true,
    "lastSync": {
      "elements": "2024-01-01T10:00:00.000Z",
      "teams": "2024-01-01T10:00:00.000Z",
      "fixtures": "2024-01-01T10:00:00.000Z",
      "events": "2024-01-01T10:00:00.000Z",
      "elementTypes": "2024-01-01T10:00:00.000Z"
    }
  },
  "requestId": "req-1"
}`}
        language="json"
        filename="ready-response.json"
      />

      <h2>Status Codes</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>200</code></td>
            <td>OK</td>
            <td>Service is healthy</td>
          </tr>
          <tr>
            <td><code>503</code></td>
            <td>Service Unavailable</td>
            <td>Service is unhealthy (database disconnected)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
