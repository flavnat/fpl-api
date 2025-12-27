import { CodeBlock } from "@/components/code-block"

export default function FixturesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Fixtures</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Query match fixtures, results, and difficulty ratings for upcoming and past games.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Query</h2>
        <CodeBlock 
          code={`query {
  fixtures(limit: 10) {
    items {
      id
      kickoff_time
      finished
      started
      team_h_score
      team_a_score
      team_h_difficulty
      team_a_difficulty
      team_h {
        name
        short_name
      }
      team_a {
        name
        short_name
      }
      event {
        name
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
          filename="fixtures-query.graphql"
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
                { field: "id", type: "Int", desc: "Unique fixture ID" },
                { field: "kickoff_time", type: "String", desc: "Match kickoff time (ISO 8601)" },
                { field: "finished", type: "Boolean", desc: "Whether the match has finished" },
                { field: "team_h", type: "Team", desc: "Home team details" },
                { field: "team_a", type: "Team", desc: "Away team details" },
                { field: "team_h_score", type: "Int", desc: "Home team score" },
                { field: "team_a_score", type: "Int", desc: "Away team score" },
                { field: "team_h_difficulty", type: "Int", desc: "Fixture difficulty for home team (1-5)" },
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
