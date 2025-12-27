import { CodeBlock } from "@/components/code-block"

export default function ResponseFormatPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Response Format</h1>
      
      <p>
        All REST API responses follow a consistent format for easy parsing.
      </p>

      <h2>Success Response</h2>
      <CodeBlock 
        code={`{
  "success": true,
  "data": {
    // Response data here
  },
  "requestId": "req-1"
}`}
        language="json"
        filename="success-structure.json"
      />

      <h2>Error Response</h2>
      <CodeBlock 
        code={`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "requestId": "req-1"
}`}
        language="json"
        filename="error-structure.json"
      />

      <h2>GraphQL Response</h2>
      <p>GraphQL responses follow the standard GraphQL response format:</p>
      <CodeBlock 
        code={`{
  "data": {
    "teams": {
      "items": [
        { "id": 1, "name": "Arsenal" },
        { "id": 2, "name": "Aston Villa" }
      ],
      "meta": {
        "total": 20,
        "limit": 50,
        "offset": 0,
        "lastSynced": "2024-01-01T00:00:00Z"
      }
    }
  }
}`}
        language="json"
        filename="graphql-response.json"
      />

      <h2>Pagination Metadata</h2>
      <p>All list queries include pagination metadata:</p>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>total</code></td>
            <td>Int</td>
            <td>Total number of items available</td>
          </tr>
          <tr>
            <td><code>limit</code></td>
            <td>Int</td>
            <td>Number of items returned</td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>Int</td>
            <td>Number of items skipped</td>
          </tr>
          <tr>
            <td><code>lastSynced</code></td>
            <td>String</td>
            <td>Last sync time (ISO 8601)</td>
          </tr>
        </tbody>
      </table>

      <h2>Request ID</h2>
      <p>
        Every response includes a <code>requestId</code> field for debugging and support purposes.
        Include this ID when reporting issues.
      </p>
    </div>
  )
}
