import { CodeBlock } from "@/components/code-block"

export default function HealthPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Health Check</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Monitor API status, database connectivity, and data sync freshness.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Health Check</h2>
        <div className="group relative flex items-center gap-3 rounded-lg border border-border bg-[#0a0a0a] p-4">
          <div className="flex select-none items-center justify-center rounded-md bg-green-500/10 px-3 py-1 text-sm font-bold text-green-500">
            GET
          </div>
          <div className="flex-1 overflow-x-auto font-mono text-sm text-foreground">
            https://fpl-api-6h0d.onrender.com/health
          </div>
        </div>

        <p className="text-muted-foreground">Example:</p>
        <CodeBlock 
          code="curl https://fpl-api-6h0d.onrender.com/health" 
          language="bash" 
          filename="terminal"
        />

        <p className="text-muted-foreground">Response:</p>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Readiness Check</h2>
        <div className="group relative flex items-center gap-3 rounded-lg border border-border bg-[#0a0a0a] p-4">
          <div className="flex select-none items-center justify-center rounded-md bg-green-500/10 px-3 py-1 text-sm font-bold text-green-500">
            GET
          </div>
          <div className="flex-1 overflow-x-auto font-mono text-sm text-foreground">
            https://fpl-api-6h0d.onrender.com/health/ready
          </div>
        </div>

        <p className="text-muted-foreground">Example:</p>
        <CodeBlock 
          code="curl https://fpl-api-6h0d.onrender.com/health/ready" 
          language="bash" 
          filename="terminal"
        />

        <p className="text-muted-foreground">Response:</p>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Status Codes</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: "200", status: "OK", desc: "Service is healthy" },
                { code: "503", status: "Service Unavailable", desc: "Service is unhealthy (database disconnected)" },
              ].map((row) => (
                <tr key={row.code} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.status}</td>
                  <td className="px-4 py-3">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
