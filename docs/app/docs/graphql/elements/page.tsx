import { CodeBlock } from "@/components/code-block"

export default function ElementsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Elements (Players)</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Query player data including stats, costs, and performance metrics for the current season.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Query</h2>
        <CodeBlock 
          code={`query {
  elements(limit: 10, offset: 0) {
    items {
      id
      web_name
      first_name
      second_name
      now_cost
      total_points
      goals_scored
      assists
      clean_sheets
      minutes
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
}`}
          language="graphql"
          filename="elements-query.graphql"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Parameters</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Parameter</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { param: "limit", type: "Int", desc: "Number of players to return (default: 50)" },
                { param: "offset", type: "Int", desc: "Number of players to skip (default: 0)" },
              ].map((row, i) => (
                <tr key={row.param} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.param}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                  <td className="px-4 py-3">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Fields</h2>
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
                { field: "id", type: "Int", desc: "Unique player ID" },
                { field: "web_name", type: "String", desc: "Display name (shirt name)" },
                { field: "now_cost", type: "Int", desc: "Current price (divide by 10 for £M)" },
                { field: "total_points", type: "Int", desc: "Total FPL points this season" },
                { field: "team", type: "Team", desc: "Player's team details" },
                { field: "element_type", type: "ElementType", desc: "Position (GK, DEF, MID, FWD)" },
              ].map((row, i) => (
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
    </div>
  )
}
