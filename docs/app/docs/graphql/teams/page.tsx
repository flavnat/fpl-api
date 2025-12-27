import { CodeBlock } from "@/components/code-block"

export default function TeamsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Teams</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Query Premier League team data including strength ratings for attack, defense, and overall performance.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Query</h2>
        <CodeBlock 
          code={`query {
  teams {
    items {
      id
      name
      short_name
      code
      strength
      strength_overall_home
      strength_overall_away
      strength_attack_home
      strength_attack_away
      strength_defence_home
      strength_defence_away
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
          filename="teams-query.graphql"
        />
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
                { field: "id", type: "Int", desc: "Unique team ID" },
                { field: "name", type: "String", desc: "Full team name" },
                { field: "short_name", type: "String", desc: "3-letter abbreviation" },
                { field: "strength", type: "Int", desc: "Overall strength rating" },
                { field: "strength_attack_home", type: "Int", desc: "Home attack strength" },
                { field: "strength_defence_away", type: "Int", desc: "Away defence strength" },
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
