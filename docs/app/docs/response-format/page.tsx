import { CodeBlock } from "@/components/code-block"

export default function ResponseFormatPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Response Format</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Standardized response structures for REST API endpoints and error handling.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Success Response</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Error Response</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">GraphQL Response</h2>
        <p className="text-muted-foreground">GraphQL responses follow the standard GraphQL response format:</p>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Pagination Metadata</h2>
        <p className="text-muted-foreground">All list queries include pagination metadata:</p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Field</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { field: "total", type: "Int", desc: "Total number of items available" },
                { field: "limit", type: "Int", desc: "Number of items returned" },
                { field: "offset", type: "Int", desc: "Number of items skipped" },
                { field: "lastSynced", type: "String", desc: "Last sync time (ISO 8601)" },
              ].map((row) => (
                <tr key={row.field} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.field}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                  <td className="px-4 py-3">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <h3 className="mb-2 font-semibold text-blue-500">Request ID</h3>
        <p className="text-sm text-blue-500/90">
          Every response includes a <code>requestId</code> field for debugging and support purposes.
          Please include this ID when reporting issues.
        </p>
      </div>
    </div>
  )
}
