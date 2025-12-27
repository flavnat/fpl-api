import { CodeBlock } from "@/components/code-block"

export default function EventsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Events (Gameweeks)</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Query gameweek data including transfer deadlines, status, and top performing players.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Query</h2>
        <CodeBlock 
          code={`query {
  events {
    items {
      id
      name
      deadline_time
      is_current
      is_next
      is_previous
      finished
      average_entry_score
      highest_score
      most_captained {
        web_name
      }
      most_selected {
        web_name
      }
      top_element {
        web_name
        total_points
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
          filename="events-query.graphql"
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
                { field: "id", type: "Int", desc: "Gameweek number" },
                { field: "name", type: "String", desc: "Gameweek name (e.g., \"Gameweek 1\")" },
                { field: "deadline_time", type: "String", desc: "Transfer deadline (ISO 8601)" },
                { field: "is_current", type: "Boolean", desc: "Is this the current gameweek" },
                { field: "is_next", type: "Boolean", desc: "Is this the next gameweek" },
                { field: "finished", type: "Boolean", desc: "Has this gameweek finished" },
                { field: "most_captained", type: "Element", desc: "Most captained player" },
                { field: "top_element", type: "Element", desc: "Highest scoring player" },
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
