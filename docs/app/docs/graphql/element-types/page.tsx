import { CodeBlock } from "@/components/code-block"

export default function ElementTypesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Element Types</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Query player position definitions (Goalkeeper, Defender, Midfielder, Forward) and squad rules.
        </p>
      </div>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Query</h2>
        <CodeBlock 
          code={`query {
  element_types {
    items {
      id
      singular_name
      singular_name_short
      plural_name
      plural_name_short
      squad_select
      squad_min_select
      squad_max_select
      squad_min_play
      squad_max_play
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
          filename="element-types-query.graphql"
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
                { field: "id", type: "Int", desc: "Position ID (1=GK, 2=DEF, 3=MID, 4=FWD)" },
                { field: "singular_name", type: "String", desc: "Full name (e.g., \"Goalkeeper\")" },
                { field: "singular_name_short", type: "String", desc: "Short name (e.g., \"GKP\")" },
                { field: "squad_select", type: "Int", desc: "Max players in squad for this position" },
                { field: "squad_min_play", type: "Int", desc: "Min players in starting XI" },
                { field: "squad_max_play", type: "Int", desc: "Max players in starting XI" },
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Position IDs</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Position</th>
                <th className="px-4 py-3 text-left font-medium">Short</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, pos: "Goalkeeper", short: "GKP" },
                { id: 2, pos: "Defender", short: "DEF" },
                { id: 3, pos: "Midfielder", short: "MID" },
                { id: 4, pos: "Forward", short: "FWD" },
              ].map((row, i) => (
                <tr key={row.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-primary">{row.id}</td>
                  <td className="px-4 py-3">{row.pos}</td>
                  <td className="px-4 py-3">{row.short}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
