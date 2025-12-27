import { CodeBlock } from "@/components/code-block"

export default function BaseUrlPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Base URL</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The root URL for all API requests. Both REST and GraphQL endpoints share this base domain.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Production URL</h2>
        <CodeBlock 
          code="https://fpl-api-6h0d.onrender.com" 
          language="bash" 
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Available Endpoints</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Endpoint</th>
                <th className="px-4 py-3 text-left font-medium">Method</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { path: "/", method: "GET", desc: "API info and available endpoints" },
                { path: "/graphql", method: "POST", desc: "GraphQL endpoint" },
                { path: "/graphiql", method: "GET", desc: "GraphQL interactive playground" },
                { path: "/documentation", method: "GET", desc: "Swagger/OpenAPI documentation" },
                { path: "/health", method: "GET", desc: "Health check with database connectivity" },
                { path: "/health/ready", method: "GET", desc: "Readiness check with sync status" },
              ].map((row) => (
                <tr key={row.path} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.path}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      row.method === 'GET' ? 'bg-green-500/10 text-green-500 ring-green-500/20' : 
                      row.method === 'POST' ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' : 
                      'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                    }`}>
                      {row.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
